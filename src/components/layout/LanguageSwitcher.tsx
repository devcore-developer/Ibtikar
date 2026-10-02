"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    // إزالة الـ locale القديم من الرابط
    const path = pathname.replace(/^\/(ar|en)/, "") || "/";
    router.push(`/${newLocale}${path}`);
  };

  return (
    <button 
      onClick={switchLocale}
      className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-[#F6F8F9] border border-[#E8ECEE] text-[#086B70] hover:bg-[#EAF5F5] transition-colors text-sm font-bold"
      aria-label="Switch Language"
    >
      <Languages size={16} />
      {locale === "ar" ? "EN" : "AR"}
    </button>
  );
}