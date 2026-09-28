"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (nextLocale: string) => {
    startTransition(() => {
      const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "";
      const newPath = `/${nextLocale}${pathWithoutLocale}`;
      router.replace(newPath);
    });
  };

  return (
    <div className="flex items-center text-xs font-semibold border border-[#E8ECEE] rounded-md bg-[#F6F8F9] p-0.5">
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`px-2.5 py-1 rounded transition-colors duration-200 ${
          locale === "en" 
            ? "bg-[#0B5C63] text-white shadow-sm" 
            : "text-[#68777D] hover:bg-white hover:text-[#0B5C63]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("ar")}
        disabled={isPending}
        className={`px-2.5 py-1 rounded transition-colors duration-200 ${
          locale === "ar" 
            ? "bg-[#0B5C63] text-white shadow-sm" 
            : "text-[#68777D] hover:bg-white hover:text-[#0B5C63]"
        }`}
      >
        العربية
      </button>
    </div>
  );
}