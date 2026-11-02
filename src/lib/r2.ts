/**
 * Cloudflare R2 storage integration (server-side only).
 * تكامل تخزين Cloudflare R2 — يجب ألا يُستورد هذا الملف من أي مكوّن للعميل (Client Component).
 *
 * Credentials come ONLY from environment variables (never NEXT_PUBLIC_*):
 *   CLOUDFLARE_ACCOUNT_ID   – Cloudflare account id (used to derive endpoint if R2_ENDPOINT missing)
 *   R2_ACCESS_KEY_ID        – R2 API token access key
 *   R2_SECRET_ACCESS_KEY    – R2 API token secret
 *   R2_BUCKET_NAME          – bucket name (e.g. "ebtekar")
 *   R2_ENDPOINT             – S3 endpoint (e.g. https://<account>.r2.cloudflarestorage.com)
 *   R2_PUBLIC_URL           – public base URL serving the bucket
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

// ----------------------------------------------
// Configuration (read lazily, fail clearly)
// ----------------------------------------------

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

export function getR2Endpoint(): string | undefined {
  const explicit = getEnv("R2_ENDPOINT");
  if (explicit) return explicit.replace(/\/+$/, "");
  const accountId = getEnv("CLOUDFLARE_ACCOUNT_ID");
  if (accountId) return `https://${accountId}.r2.cloudflarestorage.com`;
  return undefined;
}

export function getR2PublicUrl(): string | undefined {
  const url = getEnv("R2_PUBLIC_URL");
  return url ? url.replace(/\/+$/, "") : undefined;
}

/** True when every required credential is present. */
export function isR2Configured(): boolean {
  return Boolean(
    getEnv("R2_ACCESS_KEY_ID") &&
      getEnv("R2_SECRET_ACCESS_KEY") &&
      getEnv("R2_BUCKET_NAME") &&
      getR2Endpoint() &&
      getR2PublicUrl()
  );
}

let cachedClient: S3Client | null = null;

function getR2Client(): S3Client {
  if (!isR2Configured()) {
    throw new Error("R2 is not configured. Set R2_* environment variables first.");
  }
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto", // R2 requires the literal region "auto"
      endpoint: getR2Endpoint(),
      credentials: {
        accessKeyId: getEnv("R2_ACCESS_KEY_ID")!,
        secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY")!,
      },
      forcePathStyle: true, // R2 addresses objects as <endpoint>/<bucket>/<key>
    });
  }
  return cachedClient;
}

// ----------------------------------------------
// Validation
// ----------------------------------------------

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Strict content-type whitelist. SVG is intentionally excluded: files from this
 * bucket are served from our own domain, and SVG can carry inline scripts (XSS).
 */
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

/** Magic-byte sniffing so a renamed .exe cannot pass as an image. */
function detectImageType(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return "image/png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  )
    return "image/webp";
  // AVIF: ftyp box with avif/avis brand
  if (
    buf.subarray(4, 8).toString("ascii") === "ftyp" &&
    ["avif", "avis", "mif1"].includes(buf.subarray(8, 12).toString("ascii").trim())
  )
    return "image/avif";
  return null;
}

export type ImageValidationResult =
  | { ok: true; contentType: string; ext: string }
  | { ok: false; error: string };

/** Validates size, declared mime type and actual magic bytes. */
export function validateImageBuffer(
  buffer: Buffer,
  declaredType?: string | null
): ImageValidationResult {
  if (buffer.length === 0) return { ok: false, error: "Empty file" };
  if (buffer.length > MAX_IMAGE_BYTES)
    return { ok: false, error: "File size exceeds 10MB" };

  const sniffed = detectImageType(buffer);
  if (!sniffed) return { ok: false, error: "Unsupported or corrupted image content" };

  if (declaredType && declaredType.startsWith("image/") && declaredType !== sniffed) {
    // Browsers may send image/jpg vs image/jpeg – normalize that case only.
    const normalized = declaredType === "image/jpg" ? "image/jpeg" : declaredType;
    if (normalized !== sniffed) {
      return { ok: false, error: `Declared type ${declaredType} does not match file content` };
    }
  }
  return { ok: true, contentType: sniffed, ext: ALLOWED_TYPES[sniffed] };
}

// ----------------------------------------------
// Upload
// ----------------------------------------------

export interface R2UploadResult {
  key: string;
  url: string;
  bucket: string;
  bytes: number;
  contentType: string;
}

/**
 * Uploads an image buffer to R2 under "<folder>/<uuid>.<ext>" and returns its
 * public URL. Keys are unique, so objects can be cached immutably forever.
 */
export async function uploadImageToR2(
  buffer: Buffer,
  declaredType: string | undefined,
  folder: string
): Promise<R2UploadResult> {
  const validation = validateImageBuffer(buffer, declaredType);
  if (!validation.ok) throw new Error(validation.error);

  const bucket = getEnv("R2_BUCKET_NAME")!;
  const publicUrl = getR2PublicUrl()!;
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "") || "misc";
  const key = `${safeFolder}/${crypto.randomUUID()}${validation.ext}`;

  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: validation.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key,
    url: `${publicUrl}/${key}`,
    bucket,
    bytes: buffer.length,
    contentType: validation.contentType,
  };
}

// ----------------------------------------------
// Deletion
// ----------------------------------------------

/**
 * Extracts an object key from a URL ONLY if it points at our own configured
 * R2 public URL. ImgBB/Cloudinary/external URLs return null, so foreign images
 * can never be deleted through this helper.
 */
export function extractR2KeyFromUrl(url: string | null | undefined): string | null {
  const publicUrl = getR2PublicUrl();
  if (!url || !publicUrl) return null;
  // Path-traversal guard BEFORE URL parsing.
  if (url.includes("..")) return null;
  try {
    const parsed = new URL(url);
    const base = new URL(publicUrl);
    if (parsed.hostname.toLowerCase() !== base.hostname.toLowerCase()) return null;
    let key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    // Public URL may include a base path prefix (e.g. https://host/<prefix>)
    const basePath = base.pathname.replace(/^\/+|\/+$/g, "");
    if (basePath && key.startsWith(`${basePath}/`)) {
      key = key.slice(basePath.length + 1);
    }
    // Only accept keys that look like our generated object keys
    return /^[a-zA-Z0-9][a-zA-Z0-9/_.-]*$/.test(key) ? key : null;
  } catch {
    return null;
  }
}

/** Deletes an object from R2 if (and only if) the URL belongs to our bucket's public URL. */
export async function deleteR2ImageByUrl(url: string): Promise<boolean> {
  const key = extractR2KeyFromUrl(url);
  if (!key) return false;
  const client = getR2Client();
  await client.send(new DeleteObjectCommand({ Bucket: getEnv("R2_BUCKET_NAME")!, Key: key }));
  return true;
}