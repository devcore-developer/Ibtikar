"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";

export function AdminLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    // تعيين الكوكيز لمدة سنة
    document.cookie = `admin_locale=${newLocale}; path=/; max-age=31536000`;
    router.refresh(); // تحديث الصفحة لقراءة الكوكيز الجديد
  };

  return (
    <button 
      onClick={switchLocale}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
    >
      <Languages size={18} />
      {locale === "ar" ? "English" : "العربية"}
    </button>
  );
}