"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");
  const locale = useLocale();

  const links = [
    { href: "/", label: t("home") },
    { href: "/spare-parts", label: t("parts") },
    { href: "/maintenance", label: t("maintenance") },
    { href: "/technicians", label: t("technicians") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <>
      {/* زر الهامبرجر (الـ 3 شرط) */}
      <button 
        className="lg:hidden p-2 text-[#172126] hover:bg-[#F6F8F9] rounded-full transition-colors" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* القائمة المنسدلة */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex justify-between items-center p-4 border-b border-[#E8ECEE]">
            <span className="font-bold text-lg text-[#086B70]">
              {locale === "ar" ? "القائمة" : "Menu"}
            </span>
            <button onClick={() => setIsOpen(false)} className="p-2 text-[#172126]">
              <X size={24} />
            </button>
          </div>
          <nav className="p-4 flex flex-col gap-2">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={`/${locale}${link.href}`}
                className="p-4 rounded-lg hover:bg-[#F6F8F9] text-lg font-medium text-[#172126]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}