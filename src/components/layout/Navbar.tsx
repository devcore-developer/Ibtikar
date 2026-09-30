"use client";

import { ShoppingBag, Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation"; // استيراد usePathname القياسي
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const fullPathname = usePathname(); // يعيد المسار كاملاً مثل /ar/spare-parts

  // إزالة الـ locale prefix من المسار ليتم مطابقته بشكل صحيح
  const pathname = fullPathname.replace(/^\/(ar|en)/, "") || "/";

  const links = [
    { href: "/", label: t("home") },
    { href: "/spare-parts", label: t("parts") },
    { href: "/maintenance", label: t("maintenance") },
    { href: "/technicians", label: t("technicians") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  // دالة للتحقق إذا كان الرابط الحالي هو الصفحة النشطة
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-[#E8ECEE]">
      <Container>
        {/* تم استخدام gap-4 للتأكد من أن الأيقونات متباعدة بشكل مريح ومحاذاة عمودياً */}
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
            <Image 
              src="/logos/logo.png" 
              alt="Ebtikar Al Khaleej Logo" 
              width={40} 
              height={40} 
              className="rounded-lg object-contain"
              priority
            />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-[#172126] text-base md:text-lg">
                {locale === "ar" ? "ابتكار الخليج" : "Ebtikar Al Khaleej"}
              </span>
              <span className="text-[10px] text-[#68777D] hidden sm:block">
                {locale === "ar" ? "للأجهزة الكهربائية والإلكترونية" : "Electrical & Electronic Appliances"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Centered */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link 
                  key={link.label} 
                  href={`/${locale}${link.href}`} 
                  className={`text-sm font-medium transition-colors duration-200 relative py-2 group ${
                    active ? "text-[#0B5C63]" : "text-[#68777D] hover:text-[#0B5C63]"
                  }`}
                >
                  {link.label}
                  {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0B5C63] rounded-full"></span>}
                  {!active && <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0B5C63] transition-all duration-300 group-hover:w-full rounded-full"></span>}
                </Link>
              );
            })}
          </nav>

          {/* Actions Section - Refined Icons */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button 
              className="hidden md:flex p-2 text-[#68777D] hover:text-[#0B5C63] hover:bg-[#F6F8F9] rounded-full transition-all duration-200 items-center justify-center" 
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            
            <Link 
              href={`/${locale}/cart`} 
              className="relative p-2 text-[#172126] hover:text-[#0B5C63] hover:bg-[#F6F8F9] rounded-full transition-all duration-200 flex items-center justify-center" 
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {/* تم تصغير الـ Badge ليكون متناسقاً (w-4 h-4) وتم استبدال right-1 بـ end-1 لدعم RTL/LTR تلقائياً */}
              <span className="absolute top-1 end-1 bg-[#F4A340] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none p-0">
                0
              </span>
            </Link>
            
            <div className="lg:hidden">
              <MobileMenu />
            </div>
          </div>

        </div>
      </Container>
    </header>
  );
}