"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>حدث خطأ غير متوقع</h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            الرابط الذي تحاول الوصول إليه غير صحيح أو تم مسحه.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              background: "#086B70",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer"
            }}
          >
            المحاولة مرة أخرى
          </button>
        </div>
      </body>
    </html>
  );
}