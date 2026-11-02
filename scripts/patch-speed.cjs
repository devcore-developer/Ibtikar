/**
 * One-time patch: makes the R2 migration script more patient with slow ImgBB downloads.
 *  - download timeout: 30s -> 60s
 *  - attempts per image: 2 -> 3
 *  - default concurrency: 2 -> 1 (one image at a time)
 *  - small pause (0.8s) between images
 * Run:  node scripts/patch-speed.cjs
 */
const fs = require("fs");
const path = require("path");

const target = path.join("scripts", "migrate-images-to-r2.cjs");
if (!fs.existsSync(target)) {
  console.error("ERROR: " + target + " not found. Run this from the project root (D:\\DevCore\\Ebtekar).");
  process.exit(1);
}

let s = fs.readFileSync(target, "utf8");

const changes = [
  ["const DOWNLOAD_TIMEOUT_MS = 30000;", "const DOWNLOAD_TIMEOUT_MS = 60000;", "download timeout 30s -> 60s"],
  ["const DOWNLOAD_ATTEMPTS = 2;", "const DOWNLOAD_ATTEMPTS = 3;", "attempts per image 2 -> 3"],
  ['Math.min(intArg("concurrency", 2), 5)', 'Math.min(intArg("concurrency", 1), 5)', "default concurrency 2 -> 1"],
  [
    "      await processItem(item);",
    "      await processItem(item);\n      await sleep(800);",
    "pause 0.8s between images",
  ],
];

let applied = 0;
for (const [from, to, label] of changes) {
  if (s.includes(to)) {
    console.log("already applied: " + label);
    applied++;
    continue;
  }
  if (!s.includes(from)) {
    console.log("NOT FOUND (send this output to the assistant): " + label);
    continue;
  }
  s = s.split(from).join(to);
  applied++;
  console.log("patched: " + label);
}

if (applied === changes.length) {
  fs.writeFileSync(target, s, "utf8");
  console.log("ALL PATCHES APPLIED OK  (" + target + ")");
} else {
  console.log("PROBLEM: only " + applied + "/" + changes.length + " applied. NOTHING saved. Send the output above to the assistant.");
}