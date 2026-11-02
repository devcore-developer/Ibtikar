#!/usr/bin/env node
/* =============================================================
 * Ebtekar — READ-ONLY image pipeline audit
 * -------------------------------------------------------------
 * SAFE BY DESIGN:
 *   - Database: SELECT-only (prisma.findMany / count). This script
 *     contains NO update/create/delete/upsert calls at all.
 *   - R2: ListObjectsV2 only (listing keys, read-only).
 *   - HTTP: GET requests to public image URLs (no uploads).
 *   - Files: reads source files; writes ONLY one new report file:
 *       scripts/image-pipeline-audit-report.json
 *
 * Usage:
 *   node scripts/audit-image-pipeline.cjs                (full audit)
 *   node scripts/audit-image-pipeline.cjs --sample=30    (more HTTP samples)
 *   node scripts/audit-image-pipeline.cjs --no-http      (skip HTTP checks)
 *   node scripts/audit-image-pipeline.cjs --selftest     (logic self-test)
 * ============================================================= */

const fs = require("fs");
const path = require("path");

try { require("dotenv").config(); } catch (_) {}

const ROOT = process.cwd();
const SAMPLE_HTTP = intArg("sample", 15);
const DO_HTTP = !hasFlag("no-http");
const DO_SELFTEST = hasFlag("selftest");

// ------------------------------------------------------------
// small utils
// ------------------------------------------------------------
function hasFlag(name) { return process.argv.includes(`--${name}`); }
function intArg(name, def) {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  if (!a) return def;
  const n = parseInt(a.split("=")[1], 10);
  return Number.isFinite(n) && n > 0 ? n : def;
}
const log = (...a) => console.log(...a);
const section = (t) => log(`\n=== ${t} ${"=".repeat(Math.max(0, 62 - t.length))}`);

/** Strip any query string (never print tokens/keys that might be in a URL). */
function redact(url) {
  if (!url) return url;
  const i = url.indexOf("?");
  return i === -1 ? url : url.slice(0, i) + "?<redacted>";
}

function classify(url, r2PublicUrl) {
  if (!url || String(url).trim() === "") return "empty";
  let host = null;
  try { host = new URL(url).hostname.toLowerCase(); } catch { return "invalid"; }
  if (host === "ibb.co" || host === "i.ibb.co" || host.endsWith(".ibb.co")) return "imgbb";
  if (host.endsWith(".r2.dev")) return "r2";
  if (r2PublicUrl) {
    try {
      if (host === new URL(r2PublicUrl).hostname.toLowerCase()) return "r2";
    } catch {}
  }
  return "other";
}

function r2KeyFromUrl(url, r2PublicUrl) {
  try {
    const parsed = new URL(url);
    let key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    if (r2PublicUrl) {
      const base = new URL(r2PublicUrl);
      const basePath = base.pathname.replace(/^\/+|\/+$/g, "");
      if (basePath && key.startsWith(`${basePath}/`)) key = key.slice(basePath.length + 1);
    }
    return key;
  } catch { return null; }
}

async function httpProbe(url, timeoutMs = 15000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Mozilla/5.0 EbtekarAudit/1.0", Range: "bytes=0-63" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    // drain tiny body then release socket
    try { await res.arrayBuffer(); } catch {}
    return { status: res.status, contentType: res.headers.get("content-type") || "?" };
  } catch (e) {
    return { status: 0, error: String(e && e.message ? e.message : e) };
  } finally { clearTimeout(t); }
}

function pickSample(arr, n) {
  if (arr.length <= n) return arr;
  const out = []; const used = new Set();
  while (out.length < n) { const i = Math.floor(Math.random() * arr.length); if (!used.has(i)) { used.add(i); out.push(arr[i]); } }
  return out;
}

// ------------------------------------------------------------
// collect everything into a report object
// ------------------------------------------------------------
const report = {
  generatedAt: new Date().toISOString(),
  mode: "READ-ONLY",
  db: null, r2: null, http: null, manifest: null, code: null, selftest: null,
};

// ------------------------------------------------------------
// 0) self-test
// ------------------------------------------------------------
if (DO_SELFTEST) {
  section("SELFTEST");
  const assert = (cond, msg) => { if (!cond) throw new Error("selftest failed: " + msg); };
  assert(classify(null, "") === "empty", "null -> empty");
  assert(classify("   ", "") === "empty", "blank -> empty");
  assert(classify("https://i.ibb.co/abc/x.jpg", "") === "imgbb", "i.ibb.co -> imgbb");
  assert(classify("https://ibb.co/abc", "") === "imgbb", "ibb.co -> imgbb");
  assert(classify("https://pub-e5e0f17b3fb349d797fe1f2de98189ab.r2.dev/products/a.jpg", "") === "r2", "r2.dev -> r2");
  assert(classify("https://img.example.com/a.jpg", "https://img.example.com") === "r2", "custom domain -> r2");
  assert(classify("https://res.cloudinary.com/a.png", "") === "other", "cloudinary -> other");
  assert(classify("not a url", "") === "invalid", "garbage -> invalid");
  assert(redact("https://x.com/a.jpg?token=SECRET") === "https://x.com/a.jpg?<redacted>", "redaction");
  assert(r2KeyFromUrl("https://pub-x.r2.dev/products/k.jpg", "") === "products/k.jpg", "key extraction");
  log("selftest OK (9 assertions passed)");
  report.selftest = "ok";
  if (process.argv.length <= 3) { log("(selftest-only run)"); process.exit(0); }
}

// ------------------------------------------------------------
// 1) static code audit (always runs — no dependencies)
// ------------------------------------------------------------
const CODE_FILES = [
  "src/components/ui/SmartImage.tsx",
  "src/lib/image.ts",
  "src/lib/r2.ts",
  "src/components/products/ProductCard.tsx",
  "src/components/products/ProductGrid.tsx",
  "src/components/products/ProductDetailsClient.tsx",
  "src/app/[locale]/product/[slug]/page.tsx",
  "src/app/[locale]/page.tsx",
  "src/components/technicians/TechnicianCard.tsx",
  "src/app/[locale]/technicians/[slug]/page.tsx",
  "src/app/admin/(protected)/products/page.tsx",
  "src/components/admin/ProductForm.tsx",
  "src/components/admin/ImageUpload.tsx",
  "src/app/api/upload/route.ts",
  "src/app/admin/actions.ts",
  "next.config.mjs",
];

const EVIDENCE = /(SmartImage|unoptimized|isImgBBImage|remotePatterns|hostname|IMAGE_FALLBACK|fallbackSrc|image\s*\?\s|Package\b|UserCircle|\.replace\(|startsWith\(|includes\(["'`]?ibb|api\.imgbb|R2_PUBLIC_URL|uploadImageToR2|onError)/;
const SUSPICIOUS = [/\.replace\(/, /startsWith\(/, /includes\(["'`]?ibb/];

function auditCode() {
  section("CODE AUDIT (rendering pipeline)");
  const findings = []; let suspiciousCount = 0;
  for (const rel of CODE_FILES) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) { findings.push({ file: rel, exists: false }); continue; }
    const lines = fs.readFileSync(abs, "utf8").split(/\r?\n/);
    const hits = [];
    lines.forEach((ln, i) => {
      if (EVIDENCE.test(ln)) {
        hits.push({ line: i + 1, text: ln.trim().slice(0, 160) });
        if (SUSPICIOUS.some((rx) => rx.test(ln)) && !/r2\.ts/.test(rel)) suspiciousCount++;
      }
    });
    findings.push({ file: rel, exists: true, evidence: hits });
    log(`  ${rel}: ${hits.length} relevant line(s)`);
  }
  log(`  -> suspicious URL-transformation lines outside r2.ts: ${suspiciousCount}`);
  log("  (full evidence lines are in the JSON report)");
  report.code = { findings, suspiciousCount };
}

// ------------------------------------------------------------
// 2) manifest analysis
// ------------------------------------------------------------
function auditManifest() {
  section("MANIFEST (r2-migration-manifest.json)");
  const p = path.join(ROOT, "scripts", "r2-migration-manifest.json");
  if (!fs.existsSync(p)) { log("  manifest file not found — skipping"); report.manifest = { exists: false }; return; }
  const m = JSON.parse(fs.readFileSync(p, "utf8"));
  const entries = Object.entries(m.migrations || {});
  const byStatus = {};
  for (const [, v] of entries) byStatus[v.status] = (byStatus[v.status] || 0) + 1;
  log(`  unique URLs tracked: ${entries.length}`);
  log(`  by status: ${JSON.stringify(byStatus)}`);
  const failed = entries.filter(([, v]) => v.status === "failed").map(([u, v]) => ({
    url: redact(u), error: v.error, attempts: v.attempts,
    records: (v.records || []).map((r) => `${r.entityType}/${String(r.recordId).slice(0, 8)}`),
  }));
  log(`  failed entries: ${failed.length} (details in JSON)`);
  report.manifest = { exists: true, total: entries.length, byStatus, failed };
}

// ------------------------------------------------------------
// 3) database audit (SELECT only)
// ------------------------------------------------------------
async function auditDb() {
  section("DATABASE AUDIT (SELECT-only)");
  let PrismaClient;
  try { ({ PrismaClient } = require("@prisma/client")); }
  catch { log("  @prisma/client not found — run this from the project root"); report.db = { error: "no @prisma/client" }; return; }
  // Same instantiation style as migrate-images-to-r2.cjs (proven to work):
  // the generated client reads DATABASE_URL from the environment (.env).
  const prisma = new PrismaClient(
    process.env.DATABASE_URL ? { datasources: { db: { url: process.env.DATABASE_URL } } } : undefined
  );
  const r2Public = process.env.R2_PUBLIC_URL || "";

  const products = await prisma.product.findMany({
    select: { id: true, nameEn: true, nameAr: true, slug: true, image: true, isActive: true },
  });
  const technicians = await prisma.technician.findMany({ select: { id: true, nameEn: true, image: true, isActive: true } });
  const orders = await prisma.order.findMany({ select: { id: true, paymentProofUrl: true, status: true } });

  const summarize = (rows) => {
    const s = { total: rows.length, empty: 0, r2: 0, imgbb: 0, other: 0, invalid: 0 };
    const others = [];
    for (const r of rows) {
      const c = classify(r.image ?? r.paymentProofUrl, r2Public);
      s[c] = (s[c] || 0) + 1;
      if (c === "other") others.push(r);
    }
    s.otherSamples = others.slice(0, 20).map((r) => ({ id: r.id, url: redact(r.image ?? r.paymentProofUrl) }));
    return s;
  };

  const prodSummary = summarize(products);
  const techSummary = summarize(technicians);
  const orderSummary = summarize(orders);

  log(`  PRODUCTS    : total=${prodSummary.total} | empty=${prodSummary.empty} | r2=${prodSummary.r2} | imgbb=${prodSummary.imgbb} | other=${prodSummary.other}`);
  log(`  TECHNICIANS : total=${techSummary.total} | empty=${techSummary.empty} | r2=${techSummary.r2} | imgbb=${techSummary.imgbb} | other=${techSummary.other}`);
  log(`  ORDERS      : total=${orderSummary.total} | empty=${orderSummary.empty} | r2=${orderSummary.r2} | imgbb=${orderSummary.imgbb} | other=${orderSummary.other}`);

  const listOf = (rows, cls, map) =>
    rows.filter((r) => classify(r.image ?? r.paymentProofUrl, r2Public) === cls).slice(0, 50).map(map);

  const emptyProducts = listOf(products, "empty", (r) => ({ id: r.id, name: r.nameEn || r.nameAr, slug: r.slug, isActive: r.isActive }));
  const imgbbProducts = listOf(products, "imgbb", (r) => ({ id: r.id, name: r.nameEn || r.nameAr, url: redact(r.image) }));
  const r2Products = listOf(products, "r2", (r) => ({ id: r.id, url: redact(r.image) }));
  const r2Urls = products.filter((r) => classify(r.image, r2Public) === "r2").map((r) => r.image);

  log(`\n  Sample products with EMPTY image (first ${emptyProducts.length}):`);
  emptyProducts.slice(0, 10).forEach((p) => log(`   - ${p.id.slice(0, 8)}…  ${String(p.name).slice(0, 40)}  [active=${p.isActive}]`));

  report.db = {
    products: { ...prodSummary, emptySample: emptyProducts, imgbbSample: imgbbProducts, r2Sample: r2Products },
    technicians: techSummary, orders: orderSummary,
    r2Urls, // full list used by the R2 cross-check
  };

  // keep prisma handle for later sections
  return { prisma, products, technicians, orders, r2Public, r2Urls };
}

// ------------------------------------------------------------
// 4) R2 bucket cross-check (ListObjectsV2 — read-only)
// ------------------------------------------------------------
async function auditR2(dbCtx) {
  section("R2 BUCKET CROSS-CHECK (ListObjectsV2 — read-only)");
  if (!dbCtx) { log("  skipped (no DB context)"); report.r2 = { skipped: true }; return; }
  let S3Client, ListObjectsV2Command;
  try { ({ S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3")); }
  catch { log("  @aws-sdk/client-s3 not found — skipping"); report.r2 = { skipped: true }; return; }

  const acct = (process.env.CLOUDFLARE_ACCOUNT_ID || "").trim();
  const endpoint = (process.env.R2_ENDPOINT || (acct ? `https://${acct}.r2.cloudflarestorage.com` : "")).replace(/\/+$/, "");
  const bucket = process.env.R2_BUCKET_NAME;
  const r2Public = dbCtx.r2Public;
  if (!endpoint || !bucket || !process.env.R2_ACCESS_KEY_ID) { log("  R2 env vars missing — skipping"); report.r2 = { skipped: true }; return; }

  const client = new S3Client({
    region: "auto", endpoint,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
    forcePathStyle: true,
  });

  const keys = new Map(); let token;
  do {
    const page = await client.send(new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token, MaxKeys: 1000 }));
    for (const o of page.Contents || []) keys.set(o.Key, o.Size);
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  log(`  objects in bucket "${bucket}": ${keys.size}`);

  const urls = dbCtx.r2Urls || [];
  const missing = [];
  for (const u of urls) {
    const key = r2KeyFromUrl(u, r2Public);
    if (!key || !keys.has(key)) missing.push(redact(u));
  }
  log(`  DB R2 image URLs checked: ${urls.length}`);
  log(`  URLs whose object is MISSING from the bucket: ${missing.length}`);
  missing.slice(0, 10).forEach((u) => log(`   - ${u}`));
  const byFolder = {};
  for (const k of keys.keys()) { const f = k.split("/")[0]; byFolder[f] = (byFolder[f] || 0) + 1; }
  log(`  bucket objects by folder: ${JSON.stringify(byFolder)}`);
  report.r2 = { bucketObjects: keys.size, byFolder, dbR2Urls: urls.length, missingObjects: missing.slice(0, 50), missingCount: missing.length };
}

// ------------------------------------------------------------
// 5) HTTP sampling of live URLs
// ------------------------------------------------------------
async function auditHttp(dbCtx) {
  section(`HTTP SAMPLE CHECKS (${SAMPLE_HTTP} per source)`);
  if (!DO_HTTP) { log("  skipped (--no-http)"); report.http = { skipped: true }; return; }
  const r2Urls = dbCtx ? (dbCtx.r2Urls || []) : [];
  const ibbUrls = dbCtx
    ? dbCtx.products.filter((r) => classify(r.image, dbCtx.r2Public) === "imgbb").map((r) => r.image)
    : [];

  const check = async (label, urls, note) => {
    const sample = pickSample(urls, SAMPLE_HTTP);
    const results = [];
    for (const u of sample) results.push({ url: redact(u), ...(await httpProbe(u)) });
    const ok = results.filter((r) => r.status === 200 || r.status === 206).length;
    log(`  ${label}: ${ok}/${results.length} OK  ${note || ""}`);
    results.forEach((r) => log(`   - HTTP ${r.status} ${String(r.contentType || r.error || "").slice(0, 40)}  ${r.url.slice(0, 90)}`));
    return { checked: results.length, ok, results };
  };

  const out = {};
  if (r2Urls.length) out.r2 = await check("R2 (public URL)", r2Urls, "(expect 200/206)");
  else out.r2 = { checked: 0, note: "no R2 URLs in DB" };
  if (ibbUrls.length) out.imgbb = await check("ImgBB", ibbUrls, "(503 = temporary throttle — NOT deleted)");
  else out.imgbb = { checked: 0, note: "no ImgBB URLs in DB" };
  report.http = out;
}

// ------------------------------------------------------------
// run
// ------------------------------------------------------------
(async () => {
  log("================================================================");
  log(" Ebtekar image pipeline audit — READ-ONLY (no data is modified)");
  log("================================================================");

  auditCode();
  auditManifest();
  let dbCtx = null;
  try { dbCtx = await auditDb(); }
  catch (e) { log("  DB audit error: " + (e.message || e)); report.db = { error: String(e.message || e) }; }
  try { await auditR2(dbCtx); } catch (e) { log("  R2 audit error: " + (e.message || e)); report.r2 = { error: String(e.message || e) }; }
  try { await auditHttp(dbCtx); } catch (e) { log("  HTTP audit error: " + (e.message || e)); report.http = { error: String(e.message || e) }; }

  if (dbCtx && dbCtx.prisma && dbCtx.prisma.$disconnect) await dbCtx.prisma.$disconnect();

  const outPath = path.join(ROOT, "scripts", "image-pipeline-audit-report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  log("\n================================================================");
  log(` Report saved to: ${outPath}`);
  log(" No data was modified — read-only queries only.");
  log("================================================================");
})();
