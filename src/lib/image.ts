/**
 * أدوات مركزية للتعامل مع روابط الصور
 * Centralized image URL utilities
 *
 * سبب وجود هذا الملف:
 * ImgBB (i.ibb.co) يقيّد / يبطئ الطلبات القادمة من خوادم Next.js، فيفشل مُحسِّن
 * الصور عند جلب الصور عبر /_next/image مع الخطأ:
 *   "upstream image response timed out for https://i.ibb.co/..."
 *
 * الحل: اكتشاف روابط ImgBB وتحميلها مباشرة من متصفح الزائر (unoptimized) بدلاً
 * من تمريرها عبر مُحسِّن الصور، مع إبقاء التحسين مفعّلاً لكل بقية المصادر
 * (Cloudinary، Firebase، والصور المحلية).
 */

/**
 * يكتشف ما إذا كان الرابط مستضافاً على ImgBB.
 * يغطي: ibb.co و i.ibb.co وأي نطاق فرعي مثل *.ibb.co
 * الروابط النسبية (مثل /images/foo.png) أو غير الصالحة تُرجع false.
 */
export function isImgBBImage(src?: string | null): boolean {
  if (!src) return false;
  try {
    const { hostname } = new URL(src);
    const host = hostname.toLowerCase();

    return (
      host === "ibb.co" ||
      host === "i.ibb.co" ||
      host.endsWith(".ibb.co")
    );
  } catch {
    return false;
  }
}

/** الصورة البديلة المعروضة عند فشل تحميل أي صورة */
export const IMAGE_FALLBACK_SRC = "/images/image-placeholder.svg";