"use client";

import { useEffect, useRef, useState } from "react";
import NextImage, { type ImageProps } from "next/image";
import { isImgBBImage, IMAGE_FALLBACK_SRC } from "@/lib/image";

/**
 * مكوّن الصورة الموحّد للمشروع بالكامل
 * Centralized image component used across the whole project
 *
 * السلوك:
 * 1. صور ImgBB (i.ibb.co / ibb.co / *.ibb.co) تُحمَّل مباشرة من المتصفح
 *    عبر unoptimized={true} لتجاوز مُحسِّن الصور في Next.js وحل مشكلة
 *    "upstream image response timed out".
 * 2. كل بقية المصادر (Cloudinary، Firebase، الملفات المحلية...) تمر عبر
 *    مُحسِّن الصور بشكل طبيعي.
 * 3. عند فشل تحميل أي صورة تُعرض صورة بديلة مع الحفاظ على أبعاد الحاوية
 *    (لا Layout Shift)، مع منع الحلقة اللانهائية إذا فشلت الصورة البديلة نفسها.
 * 4. يحافظ على كل خصائص next/image: fill, sizes, quality, priority,
 *    className, style... إلخ.
 */
export type SmartImageProps = Omit<ImageProps, "src" | "alt"> & {
  /** رابط الصورة (من قاعدة البيانات أو محلي) — يمكن أن يكون null/undefined */
  src?: string | null;
  alt?: string;
  /** صورة بديلة مخصصة (اختياري — الافتراضي /images/image-placeholder.svg) */
  fallbackSrc?: string;
};

export function SmartImage({
  src,
  alt = "",
  fallbackSrc = IMAGE_FALLBACK_SRC,
  ...rest
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // إعادة تعيين حالة الفشل عند تغيّر رابط الصورة ليُعاد المحاولة
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const isFallback = !src || failed;
  const resolvedSrc = isFallback ? fallbackSrc : src;

  // التقاط حالات فشل الصورة قبل اكتمال الـ hydration
  // (إن فشل الطلب قبل ربط onError من React نكتشفه هنا عبر naturalWidth = 0)
  const attachRef = (el: HTMLImageElement | null) => {
    imgRef.current = el;
    if (el && !isFallback && el.complete && el.naturalWidth === 0) {
      setFailed(true);
    }
  };

  return (
    <NextImage
      {...rest}
      ref={attachRef}
      src={resolvedSrc}
      alt={alt}
      // ImgBB: تجاوز المُحسِّن بالكامل (التحميل المباشر من CDN الخاص بها)
      // .svg: مُحسِّن Next.js لا يعالج SVG افتراضياً، فيُحمَّل مباشرة
      unoptimized={isImgBBImage(resolvedSrc) || resolvedSrc.endsWith(".svg")}
      onError={() => {
        // إذا كنا نعرض الصورة البديلة بالفعل لا نفعل شيئاً (منع الحلقة اللانهائية)
        if (!isFallback) setFailed(true);
      }}
    />
  );
}