"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ChevronLeft, Home, Package, Wrench, Users, Info, PhoneCall } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Navbar");
  const locale = useLocale();

  // التأكد من أننا في المتصفح قبل عرض الـ Portal
  useEffect(() => setMounted(true), []);

  const isRTL = locale === "ar";
  const drawerSide = isRTL ? "right-0" : "left-0";
  const hiddenTranslate = isRTL ? "translate-x-full" : "-translate-x-full";

  const links = [
    { href: "/", label: t("home"), icon: Home },
    { href: "/spare-parts", label: t("parts"), icon: Package },
    { href: "/maintenance", label: t("maintenance"), icon: Wrench },
    { href: "/technicians", label: t("technicians"), icon: Users },
    { href: "/about", label: t("about"), icon: Info },
    { href: "/contact", label: t("contact"), icon: PhoneCall },
  ];

  const DrawerContent = (
    <>
      {/* 1. الطبقة الخلفية المعتمة */}
      <div 
        className={`fixed inset-0 z-[90] bg-black/60 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* 2. القائمة المنزلقة (Drawer) */}
      <div 
        className={`fixed top-0 h-[100dvh] ${drawerSide} w-[80%] max-w-sm bg-white z-[100] transition-transform duration-300 ease-in-out flex flex-col shadow-[-10px_0_30px_-5px_rgba(0,0,0,0.1)] ${
          isOpen ? "translate-x-0" : hiddenTranslate
        }`}
      >
        {/* 3. رأس القائمة (ثابت لا يتحرك مع التمرير) */}
        <div className="h-[72px] flex items-center justify-between px-5 border-b border-[#E8ECEE] shrink-0">
          <span className="text-lg font-bold text-[#086B70]">
            {locale === "ar" ? "القائمة" : "Menu"}
          </span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-[#172126] hover:bg-[#F6F8F9] rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* 4. روابط التنقل (تأخذ المساحة المتبقية وتتمرر للأسفل عند الحاجة) */}
        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={`/${locale}${link.href}`}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-[#EAF5F5] hover:text-[#086B70] text-[#172126] transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F6F8F9] group-hover:bg-white flex items-center justify-center transition-colors">
                  <link.icon size={20} className="text-[#086B70]" strokeWidth={1.5} />
                </div>
                <span className="text-lg font-medium">{link.label}</span>
              </div>
              <ChevronLeft size={20} className="text-[#68777D] group-hover:text-[#086B70] opacity-50 transition-colors" />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* زر الهامبرجر (الـ 3 خطوط) */}
      <button 
        className="lg:hidden p-2 text-[#172126] hover:bg-[#F6F8F9] rounded-full transition-colors" 
        onClick={() => setIsOpen(true)}
        aria-label="Open Menu"
      >
        <Menu size={24} />
      </button>

      {/* استخدام Portal لعرض القائمة خارج حاوية الـ Navbar لتجنب مشاكل الـ backdrop-blur */}
      {mounted && createPortal(DrawerContent, document.body)}
    </>
  );
}