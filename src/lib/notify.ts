/**
 * Server-only ntfy push notifications for the shop OWNER (Android app via ntfy).
 * إشعارات ntfy لصاحب المتجر فقط — هذا الملف مخصص للخادم حصريًا.
 *
 * ⚠️ DO NOT import this file from any client component / "use client" file.
 * ⚠️ DO NOT import this file from any Server Action that returns data used by
 *    the client UI — the topic must never reach the browser, logs or responses.
 *
 * Environment variables (server-only, set in Vercel / .env.local):
 *   NTFY_BASE_URL – optional, defaults to https://ntfy.sh
 *   NTFY_TOPIC    – REQUIRED secret topic name. Anyone who knows the topic can
 *                   post notifications, so it must stay server-side and be
 *                   unguessable (never NEXT_PUBLIC_*, never logged).
 *
 * Behaviour contract (by design):
 *   - Not configured (no/invalid NTFY_TOPIC) → silently does nothing.
 *   - Network/timeout/HTTP errors → logged without leaking the topic/URL,
 *     never thrown: callers' business logic can never fail because of ntfy.
 *   - Publishing uses the official ntfy JSON endpoint (POST <base>/) with a
 *     4-second timeout so a hanging server can never stall a response.
 */

const NTFY_TIMEOUT_MS = 4000;
const NTFY_PRIORITY_HIGH = 4;

/** ntfy topics allow letters, digits, "_" and "-" only. Also blocks topic injection. */
const VALID_TOPIC_RE = /^[A-Za-z0-9_-]{1,64}$/;

interface NtfyPublishInput {
  title: string;
  message: string;
  tags: string[];
}

/**
 * Reads + validates configuration. Returns null whenever ntfy is not safely
 * configured — callers treat null as "notifications disabled" (no-op).
 */
function resolveNtfyConfig(): { baseUrl: string; topic: string } | null {
  const topic = (process.env.NTFY_TOPIC || "").trim();
  if (!VALID_TOPIC_RE.test(topic)) return null;

  const rawBase = (process.env.NTFY_BASE_URL || "https://ntfy.sh").trim().replace(/\/+$/, "");
  try {
    const parsed = new URL(rawBase);
    // https for real servers; plain http only for localhost (self-testing).
    const isLocalHttp =
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1");
    if (parsed.protocol !== "https:" && !isLocalHttp) return null;
    return { baseUrl: rawBase, topic };
  } catch {
    return null;
  }
}

/**
 * Publishes one notification. NEVER throws and NEVER leaks the topic/URL:
 * logs contain at most the HTTP status code or the error class name.
 */
async function publishToNtfy(input: NtfyPublishInput): Promise<void> {
  const config = resolveNtfyConfig();
  if (!config) return; // Notifications disabled / misconfigured → no-op.

  try {
    const response = await fetch(`${config.baseUrl}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Official JSON publishing endpoint: avoids header-encoding issues and
      // keeps the topic out of the URL entirely.
      body: JSON.stringify({
        topic: config.topic,
        title: input.title,
        message: input.message,
        priority: NTFY_PRIORITY_HIGH,
        tags: input.tags,
      }),
      signal: AbortSignal.timeout(NTFY_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error(`[ntfy] publish failed with HTTP status ${response.status}`);
    }
  } catch (error) {
    // Log the error CLASS only (TimeoutError, TypeError...) — never the
    // message/stack, which could contain the full publishing URL.
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error(`[ntfy] publish failed (${errorName})`);
  }
}

/** Collapses whitespace/newlines and clamps length (safe, readable text). */
function sanitizeLine(value: string, maxLength: number): string {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1)}…` : clean;
}

export interface SparePartsOrderNotificationData {
  orderId: string;
  customerName: string;
  /** Total quantity across all order items (what the owner actually packs). */
  itemCount: number;
  /** Order grand total (already includes delivery fee). */
  total: number;
}

/**
 * Owner notification for a successfully created spare-parts order.
 * Await it inside after() — it resolves fast and never rejects.
 */
export async function notifyNewSparePartsOrder(
  data: SparePartsOrderNotificationData
): Promise<void> {
  const message = [
    `New spare parts order #${data.orderId}`,
    `Customer: ${sanitizeLine(data.customerName, 60)}`,
    `Items: ${data.itemCount}`,
    `Total: ${data.total.toFixed(3)} KWD`,
  ].join("\n");

  await publishToNtfy({
    title: "Ebtekar - New Spare Parts Order",
    message,
    tags: ["shopping_cart"],
  });
}

export interface MaintenanceRequestNotificationData {
  requestId: string;
  customerName: string;
  /** Free-text appliance type as entered/stored (no schema changes). */
  applianceType: string;
  /** Human-readable service name resolved from the existing static services data. */
  serviceName: string;
}

/**
 * Owner notification for a successfully saved maintenance request.
 * Await it inside after() — it resolves fast and never rejects.
 */
export async function notifyNewMaintenanceRequest(
  data: MaintenanceRequestNotificationData
): Promise<void> {
  const message = [
    `New maintenance request #${data.requestId}`,
    `Customer: ${sanitizeLine(data.customerName, 60)}`,
    `Appliance: ${sanitizeLine(data.applianceType, 40)}`,
    `Service: ${sanitizeLine(data.serviceName, 60)}`,
  ].join("\n");

  await publishToNtfy({
    title: "Ebtekar - New Maintenance Request",
    message,
    tags: ["hammer_and_wrench"],
  });
}