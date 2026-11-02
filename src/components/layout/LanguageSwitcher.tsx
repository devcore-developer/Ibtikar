"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  // اللغة الهدف = عكس اللغة الحالية دائماً، والزر يعرض اسم اللغة الهدف نفسها.
  // الصفحة عربية (ar)   → الزر يعرض "English" (الضغط هيحوّل للإنجليزية)
  // الصفحة إنجليزية (en) → الزر يعرض "العربية" (الضغط هيحوّل للعربية)
  // المتغير واحد مستخدم في الليبل وفي الحدث نفسه، فالليبل والتحويل لا يمكن أن يختلفا أبداً.
  //
  // ملاحظة الموبايل: على الشاشات الصغيرة (< 640px) الزر يصغر قليلاً (خط 12px + بادينج أقل
  // + إخفاء الأيقونة) حتى لا يزاحم زر القائمة، ويرجع بالضبط لحجمه الأصلي من sm وطالع.
  const targetLocale = locale === "ar" ? "en" : "ar";
  const targetLabel = targetLocale === "ar" ? "العربية" : "English";

  const switchLocale = () => {
    // Remove the current locale prefix from the path safely
    // e.g., "/ar/spare-parts" -> "/spare-parts"
    // e.g., "/ar" -> ""
    const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "");

    // Rebuild the URL with the new locale, handling the root case
    const newPath = `/${targetLocale}${pathWithoutLocale === "" ? "" : pathWithoutLocale}`;

    // Persist the choice in the same NEXT_LOCALE cookie the middleware reads,
    // so the preference survives refreshes and later visits (1 year).
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; samesite=lax`;

    router.push(newPath);
  };

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1.5 h-9 px-2 min-[360px]:px-2.5 sm:px-3 rounded-full bg-[#F6F8F9] border border-[#E8ECEE] text-[#086B70] hover:bg-[#EAF5F5] transition-colors text-xs sm:text-sm font-bold"
      aria-label={`Switch to ${targetLocale === "ar" ? "Arabic" : "English"}`}
    >
      <Languages size={16} className="hidden sm:block shrink-0" />
      {/* الليبل دائماً = اسم لغة الهدف نفسها، مش اللغة الحالية */}
      {targetLabel}
    </button>
  );
}
