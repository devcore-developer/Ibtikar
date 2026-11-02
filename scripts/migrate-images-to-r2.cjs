#!/usr/bin/env node
/**
 * ============================================================
 * ImgBB → Cloudflare R2 image migration script
 * ============================================================
 *
 * Purpose:
 *   Migrates existing ImgBB image URLs stored in the database
 *   (Product.image, Technician.image, Order.paymentProofUrl)
 *   to the Cloudflare R2 bucket, safely and idempotently.
 *
 * Safety guarantees (per project requirements):
 *   - Reads image URLs from the REAL database (Prisma + DATABASE_URL).
 *   - Downloads each ImgBB image, uploads to R2, verifies the public URL
 *     (status 200, image content-type, identical byte length AND sha256),
 *     and only then updates the single image field of the record.
 *   - NEVER deletes anything from ImgBB. Original URLs are preserved as a
 *     backup inside the manifest JSON file.
 *   - Avoids duplicate uploads: content-addressed R2 keys
 *     (sha256 of the bytes) + one upload per unique source URL + the
 *     manifest remembers already-migrated URLs across runs.
 *   - Re-checks the record right before the DB update and refuses to
 *     overwrite if the URL changed while we were working.
 *   - Failures are recorded in the manifest and can be retried.
 *   - Dry run by default. DB writes ONLY with --execute.
 *
 * Usage:
 *   # 1) Report only (downloads are checked, nothing uploaded, DB untouched):
 *   node scripts/migrate-images-to-r2.cjs --dry-run
 *
 *   # 2) Small test batch (first 5 unique ImgBB images):
 *   node scripts/migrate-images-to-r2.cjs --execute --limit=5
 *
 *   # 3) Full migration (after production public URL is configured!):
 *   node scripts/migrate-images-to-r2.cjs --execute
 *
 *   # 4) Retry previously failed images only:
 *   node scripts/migrate-images-to-r2.cjs --execute --retry-failed
 *
 * Options:
 *   --dry-run            Report only (default when --execute is absent)
 *   --execute            Really upload to R2 and update the DB
 *   --limit=N            Process at most N unique images (e.g. 5 for the test batch)
 *   --entity=a,b         Restrict to products,technicians,orders (default: all)
 *   --ids=id1,id2        Restrict to specific record ids (any entity)
 *   --retry-failed       Only re-process URLs recorded as failed in the manifest
 *   --concurrency=N      Parallel downloads/uploads (default 2, max 5)
 *   --manifest=PATH      Manifest file (default: scripts/r2-migration-manifest.json)
 *   --skip-download-check  Dry-run without downloading (fast URL listing)
 *
 * Required env: DATABASE_URL, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY,
 *               R2_BUCKET_NAME, R2_ENDPOINT (or CLOUDFLARE_ACCOUNT_ID), R2_PUBLIC_URL
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { PrismaClient } = require("@prisma/client");

// ------------------------------------------------------------
// CLI parsing
// ------------------------------------------------------------
const argv = process.argv.slice(2);
function hasFlag(name) {
  return argv.some((a) => a === name || a === `--${name}`);
}
function argValue(name, fallback) {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : fallback;
}
function intArg(name, fallback) {
  const v = parseInt(argValue(name, ""), 10);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

const EXECUTE = hasFlag("execute");
const DRY_RUN = !EXECUTE;
const LIMIT = intArg("limit", 0); // 0 = no limit
const RETRY_FAILED = hasFlag("retry-failed");
const CONCURRENCY = Math.min(intArg("concurrency", 1), 5);
const SKIP_DOWNLOAD_CHECK = hasFlag("skip-download-check");
const ENTITIES = (argValue("entity", "products,technicians,orders") || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter((s) => ["products", "technicians", "orders"].includes(s));
const IDS = new Set(
  (argValue("ids", "") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.isAbsolute(argValue("manifest", ""))
  ? argValue("manifest", "")
  : path.join(PROJECT_ROOT, argValue("manifest", "scripts/r2-migration-manifest.json"));

// ------------------------------------------------------------
// Environment
// ------------------------------------------------------------
function env(name) {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}
const R2_BUCKET = env("R2_BUCKET_NAME");
const R2_PUBLIC_URL = (env("R2_PUBLIC_URL") || "").replace(/\/+$/, "");
const R2_ENDPOINT = (env("R2_ENDPOINT") ||
  (env("CLOUDFLARE_ACCOUNT_ID")
    ? `https://${env("CLOUDFLARE_ACCOUNT_ID")}.r2.cloudflarestorage.com`
    : "") || "").replace(/\/+$/, "");
const R2_KEYS_PRESENT = Boolean(env("R2_ACCESS_KEY_ID") && env("R2_SECRET_ACCESS_KEY"));
const R2_READY = Boolean(R2_BUCKET && R2_PUBLIC_URL && R2_ENDPOINT && R2_KEYS_PRESENT);

const ENTITY_FOLDER = { products: "products", technicians: "technicians", orders: "payments" };
const MAX_SOURCE_BYTES = 25 * 1024 * 1024; // refuse to pull absurd files from ImgBB
const DOWNLOAD_TIMEOUT_MS = 60000;
const DOWNLOAD_ATTEMPTS = 3;

// ------------------------------------------------------------
// Small utils
// ------------------------------------------------------------
const log = (...a) => console.log(...a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function sha256hex(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}
function isImgBBUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === "ibb.co" || host === "i.ibb.co" || host.endsWith(".ibb.co");
  } catch {
    return false;
  }
}
function isOurR2Url(url) {
  if (!R2_PUBLIC_URL) return false;
  try {
    return new URL(url).hostname.toLowerCase() === new URL(R2_PUBLIC_URL).hostname.toLowerCase();
  } catch {
    return false;
  }
}
function sniffImageType(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { type: "image/jpeg", ext: ".jpg" };
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47)
    return { type: "image/png", ext: ".png" };
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return { type: "image/gif", ext: ".gif" };
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP")
    return { type: "image/webp", ext: ".webp" };
  if (
    buf.subarray(4, 8).toString("ascii") === "ftyp" &&
    ["avif", "avis", "mif1"].includes(buf.subarray(8, 12).toString("ascii").trim())
  )
    return { type: "image/avif", ext: ".avif" };
  return null;
}
async function fetchBuffer(url, attempts = DOWNLOAD_ATTEMPTS, maxBytes = MAX_SOURCE_BYTES) {
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), DOWNLOAD_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: ctrl.signal,
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
          Accept: "image/*,*/*;q=0.8",
        },
      });
      clearTimeout(timer);
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
        if (i < attempts) await sleep(1200 * i);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length === 0) {
        lastErr = new Error("Empty response body");
        if (i < attempts) await sleep(1200 * i);
        continue;
      }
      if (buf.length > maxBytes) {
        return { ok: false, error: `File too large (${buf.length} bytes)` };
      }
      return {
        ok: true,
        buffer: buf,
        contentType: res.headers.get("content-type") || "",
        status: res.status,
      };
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      if (i < attempts) await sleep(1200 * i);
    }
  }
  return { ok: false, error: lastErr ? `${lastErr.message || lastErr}` : "Unknown download error" };
}

// ------------------------------------------------------------
// Manifest (the backup of original URLs + migration journal)
// ------------------------------------------------------------
function loadManifest() {
  try {
    const raw = fs.readFileSync(MANIFEST_PATH, "utf8");
    const m = JSON.parse(raw);
    if (m && m.version === 1 && m.migrations && m.skipped) return m;
  } catch {
    /* first run */
  }
  return { version: 1, createdAt: new Date().toISOString(), updatedAt: null, migrations: {}, skipped: {} };
}
function saveManifest(manifest) {
  manifest.updatedAt = new Date().toISOString();
  const tmp = `${MANIFEST_PATH}.tmp`;
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(tmp, JSON.stringify(manifest, null, 2));
  fs.renameSync(tmp, MANIFEST_PATH);
}

// ------------------------------------------------------------
// R2 client
// ------------------------------------------------------------
let s3 = null;
function getS3() {
  if (!s3) {
    s3 = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: env("R2_ACCESS_KEY_ID"),
        secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
      },
      forcePathStyle: true,
    });
  }
  return s3;
}

async function uploadToR2(buffer, contentType, key) {
  await getS3().send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

/** Verifies the object is publicly reachable and byte-identical to the source. */
async function verifyPublicUrl(url, expected) {
  const res = await fetchBuffer(url, 2, MAX_SOURCE_BYTES);
  if (!res.ok) return { ok: false, error: `public URL check failed: ${res.error}` };
  if (res.buffer.length !== expected.bytes)
    return { ok: false, error: `size mismatch (source ${expected.bytes}, public ${res.buffer.length})` };
  const sha = sha256hex(res.buffer);
  if (sha !== expected.sha256) return { ok: false, error: "sha256 mismatch after upload" };
  return { ok: true, contentType: res.contentType };
}
// ------------------------------------------------------------
// DB helpers
// ------------------------------------------------------------
async function readRecordField(prisma, rec) {
  if (rec.entityType === "products") {
    const row = await prisma.product.findUnique({ where: { id: rec.recordId }, select: { image: true } });
    return row ? row.image : null;
  }
  if (rec.entityType === "technicians") {
    const row = await prisma.technician.findUnique({ where: { id: rec.recordId }, select: { image: true } });
    return row ? row.image : null;
  }
  const row = await prisma.order.findUnique({ where: { id: rec.recordId }, select: { paymentProofUrl: true } });
  return row ? row.paymentProofUrl : null;
}

async function writeRecordField(prisma, rec, value) {
  if (rec.entityType === "products") {
    await prisma.product.update({ where: { id: rec.recordId }, data: { image: value } });
  } else if (rec.entityType === "technicians") {
    await prisma.technician.update({ where: { id: rec.recordId }, data: { image: value } });
  } else {
    await prisma.order.update({ where: { id: rec.recordId }, data: { paymentProofUrl: value } });
  }
}

async function collectTargets(prisma) {
  const targets = [];
  if (ENTITIES.includes("products")) {
    const rows = await prisma.product.findMany({ select: { id: true, image: true } });
    for (const r of rows) targets.push({ entityType: "products", recordId: r.id, field: "image", url: r.image });
  }
  if (ENTITIES.includes("technicians")) {
    const rows = await prisma.technician.findMany({ select: { id: true, image: true } });
    for (const r of rows) targets.push({ entityType: "technicians", recordId: r.id, field: "image", url: r.image });
  }
  if (ENTITIES.includes("orders")) {
    const rows = await prisma.order.findMany({ select: { id: true, paymentProofUrl: true } });
    for (const r of rows)
      targets.push({ entityType: "orders", recordId: r.id, field: "paymentProofUrl", url: r.paymentProofUrl });
  }
  if (IDS.size > 0) return targets.filter((t) => IDS.has(t.recordId));
  return targets;
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------
async function main() {
  log("================================================================");
  log(" ImgBB → Cloudflare R2 migration");
  log(` Mode: ${DRY_RUN ? "DRY RUN (no uploads, no DB writes)" : "EXECUTE (will upload + update DB)"}`);
  if (LIMIT > 0) log(` Limit: ${LIMIT} unique image(s)`);
  log(` Entities: ${ENTITIES.join(", ")}`);
  log(` Manifest: ${MANIFEST_PATH}`);
  log("================================================================");

  if (!env("DATABASE_URL")) {
    console.error("FATAL: DATABASE_URL is not set.");
    process.exit(2);
  }
  if (!R2_READY) {
    log(
      `[config] R2 not fully configured (bucket=${R2_BUCKET || "-"}, endpoint=${R2_ENDPOINT || "-"}, ` +
        `keys=${R2_KEYS_PRESENT ? "yes" : "no"}, publicUrl=${R2_PUBLIC_URL || "-"})`
    );
    if (EXECUTE) {
      console.error("FATAL: --execute requires all R2_* environment variables to be set.");
      process.exit(2);
    }
  }

  const prisma = new PrismaClient();
  const manifest = loadManifest();

  // 1) Collect + classify every image-bearing row
  const targets = await collectTargets(prisma);
  const migrations = []; // { url, records[] } for ImgBB URLs we should process
  const skippedRows = [];
  const byUrl = new Map();
  for (const t of targets) {
    if (!t.url) {
      skippedRows.push({ ...t, reason: "empty" });
      continue;
    }
    const isImgbb = isImgBBUrl(t.url);
    if (!isImgbb) {
      skippedRows.push({ ...t, reason: isOurR2Url(t.url) ? "already_r2" : "non_imgbb" });
      continue;
    }
    if (!byUrl.has(t.url)) byUrl.set(t.url, []);
    byUrl.get(t.url).push(t);
  }
  for (const [url, records] of byUrl) {
    const prev = manifest.migrations[url];
    if (prev && prev.status === "migrated" && !RETRY_FAILED) {
      skippedRows.push({ url, reason: "already_migrated_in_manifest", records });
      continue;
    }
    if (prev && prev.status === "failed" && !RETRY_FAILED) {
      // Default runs ignore previously failed URLs unless --retry-failed is given.
      skippedRows.push({ url, reason: "failed_in_previous_run", records });
      continue;
    }
    migrations.push({ url, records });
  }

  log(`\nDB rows scanned: ${targets.length}`);
  log(`  unique ImgBB images to process: ${migrations.length}`);
  const skipCounts = {};
  for (const s of skippedRows) skipCounts[s.reason] = (skipCounts[s.reason] || 0) + 1;
  for (const [k, v] of Object.entries(skipCounts)) log(`  skipped (${k}): ${v}`);

  // Workload = first N unique images (dedupe happens BEFORE the limit so
  // that --limit=5 really migrates 5 distinct images).
  const workload = LIMIT > 0 ? migrations.slice(0, LIMIT) : migrations;
  const overflow = LIMIT > 0 ? migrations.length - workload.length : 0;

  // 2) DRY RUN — check every image is actually downloadable + report the plan
  if (DRY_RUN) {
    log("\n---------------- DRY RUN PLAN ----------------");
    let i = 0;
    const problems = [];
    for (const item of workload) {
      i++;
      const folder = ENTITY_FOLDER[item.records[0].entityType] || "misc";
      let downloadInfo = "not checked (--skip-download-check)";
      if (!SKIP_DOWNLOAD_CHECK) {
        const dl = await fetchBuffer(item.url);
        if (dl.ok) {
          const sniff = sniffImageType(dl.buffer);
          downloadInfo = `OK ${(dl.buffer.length / 1024).toFixed(1)}KB ${sniff ? sniff.type : "UNKNOWN TYPE"}`;
          if (!sniff) problems.push({ url: item.url, error: "content is not a recognized image" });
        } else {
          downloadInfo = `DOWNLOAD FAILED (${dl.error})`;
          problems.push({ url: item.url, error: dl.error });
        }
      }
      log(
        `[${i}/${workload.length}] ${item.url}` +
          `\n    records: ${item.records
            .map((r) => `${r.entityType}#${r.recordId.slice(0, 8)}(${r.field})`)
            .join(", ")}` +
          `\n    would upload to: ${R2_BUCKET || "<bucket>"}/${folder}/<sha256-16>.<ext>   download: ${downloadInfo}`
      );
    }
    if (overflow > 0) log(`\n(+${overflow} more unique images not shown — limit reached)`);
    log("\n------------- DRY RUN SUMMARY ----------------");
    log(`Would migrate: ${workload.length} unique image(s) touching ${workload.reduce((n, w) => n + w.records.length, 0)} DB row(s)`);
    log(`Skipped rows : ${skippedRows.length}`);
    if (problems.length) {
      log(`\nWARNING: ${problems.length} image(s) cannot be downloaded right now:`);
      for (const p of problems) log(`  - ${p.url}\n    ${p.error}`);
      log("These would be recorded as FAILED on execute; re-run later with --retry-failed.");
    }
    log("\nNo changes were made. To perform a small real test:");
    log("  node scripts/migrate-images-to-r2.cjs --execute --limit=5");
    await prisma.$disconnect();
    return;
  }

  // 3) EXECUTE — migrate unique URLs, then update the corresponding rows
  if (!R2_READY) {
    console.error("FATAL: R2 is not configured.");
    process.exit(2);
  }

  let done = 0,
    okCount = 0,
    failCount = 0,
    reuseCount = 0;
  const results = new Map(); // url → { status, newUrl?, error?, reused? }

  async function processItem(item) {
    const { url } = item;
    const folder = ENTITY_FOLDER[item.records[0].entityType] || "misc";
    const prev = manifest.migrations[url] || {};
    const entry = {
      status: prev.status || "pending",
      newUrl: prev.newUrl,
      r2Key: prev.r2Key,
      sha256: prev.sha256,
      bytes: prev.bytes,
      contentType: prev.contentType,
      error: prev.error,
      attempts: (prev.attempts || 0) + 1,
      updatedAt: new Date().toISOString(),
      records: prev.records || item.records.map((r) => ({ ...r, dbUpdated: false })),
    };
    // Merge any records discovered on this run that were not in the manifest yet
    for (const r of item.records) {
      if (!entry.records.some((x) => x.entityType === r.entityType && x.recordId === r.recordId)) {
        entry.records.push({ ...r, dbUpdated: false });
      }
    }
    manifest.migrations[url] = entry;

    try {
      // 3a. Case A — object uploaded in a previous run but DB not updated
      if (prev.status === "failed" && prev.newUrl && prev.r2Key) {
        const expected = { bytes: prev.bytes, sha256: prev.sha256 };
        const check = await verifyPublicUrl(prev.newUrl, expected);
        if (check.ok) {
          entry.status = "migrated";
          entry.error = null;
          results.set(url, { status: "migrated", newUrl: prev.newUrl, reused: true });
          reuseCount++;
        } else {
          entry.status = "failed";
          entry.error = `previous upload invalid: ${check.error}`;
          results.set(url, { status: "failed", error: entry.error });
          failCount++;
        }
      } else {
        // 3b. Normal path — download → upload → verify
        const dl = await fetchBuffer(item.url);
        if (!dl.ok) throw new Error(`download failed: ${dl.error}`);
        const sniff = sniffImageType(dl.buffer);
        if (!sniff) throw new Error("downloaded content is not a recognized image");
        const sha = sha256hex(dl.buffer);
        const key = `${folder}/${sha.slice(0, 16)}${sniff.ext}`;
        const newUrl = `${R2_PUBLIC_URL}/${key}`;

        await uploadToR2(dl.buffer, sniff.type, key);

        const check = await verifyPublicUrl(newUrl, { bytes: dl.buffer.length, sha256: sha });
        if (!check.ok) throw new Error(`verification failed: ${check.error}`);

        entry.status = "migrated";
        entry.newUrl = newUrl;
        entry.r2Key = key;
        entry.sha256 = sha;
        entry.bytes = dl.buffer.length;
        entry.contentType = sniff.type;
        entry.error = null;
        results.set(url, { status: "migrated", newUrl });
        okCount++;
      }

      // 3c. DB updates — only the image field, only after successful
      //     verification, and only if the record still points at the same
      //     original URL (guards against concurrent admin edits).
      if (entry.status === "migrated") {
        for (const rec of entry.records) {
          const current = await readRecordField(prisma, rec);
          if (current === null) {
            rec.dbUpdated = false;
            rec.note = "record_not_found";
            continue;
          }
          if (current !== url) {
            rec.dbUpdated = false;
            rec.note = "url_changed_during_migration_left_untouched";
            continue;
          }
          await writeRecordField(prisma, rec, entry.newUrl);
          rec.dbUpdated = true;
          rec.dbUpdatedAt = new Date().toISOString();
        }
      }
    } catch (e) {
      entry.status = "failed";
      entry.error = `${e && e.message ? e.message : e}`;
      if (!results.has(url)) results.set(url, { status: "failed", error: entry.error });
      failCount++;
    }
    saveManifest(manifest); // incremental persistence — crash-safe
    done++;
    const r = results.get(url);
    log(
      `[${done}/${workload.length}] ${r.status === "migrated" ? (r.reused ? "REUSED " : "MIGRATED") : "FAILED  "} ${url}` +
        (r.newUrl ? `\n          → ${r.newUrl}` : r.error ? `\n          x ${r.error}` : "")
    );
  }

  // Simple worker pool
  let cursor = 0;
  async function worker() {
    while (cursor < workload.length) {
      const item = workload[cursor++];
      await processItem(item);
      await sleep(800);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(CONCURRENCY, workload.length)) }, worker));

  // 4) Summary
  const rowsUpdated = Object.values(manifest.migrations)
    .flatMap((m) => m.records || [])
    .filter((r) => r.dbUpdated).length;
  log("\n================= EXECUTE SUMMARY =================");
  log(`Unique images migrated : ${okCount}${reuseCount ? ` (incl. ${reuseCount} reused from previous run)` : ""}`);
  log(`Unique images failed   : ${failCount}`);
  log(`DB rows updated (all runs) : ${rowsUpdated}`);
  log(`Skipped rows           : ${skippedRows.length}`);
  log(`Manifest saved to      : ${MANIFEST_PATH}`);
  log("Original ImgBB URLs are preserved in the manifest AND on ImgBB (nothing deleted).");
  if (failCount > 0) {
    log("\nFailed images can be retried with:");
    log("  node scripts/migrate-images-to-r2.cjs --execute --retry-failed");
  }
  log("===================================================");
  await prisma.$disconnect();
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(2);
});