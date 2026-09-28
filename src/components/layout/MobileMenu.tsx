"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Link from "next/link";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");
  const locale = useLocale();

  const links = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/spare-parts`, label: t("parts") },
    { href: `/${locale}/maintenance`, label: t("maintenance") },
    { href: `/${locale}/technicians`, label: t("technicians") },
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <div className="lg:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 -mr-2 text-[#172126]" aria-label="Toggle menu">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute top-20 inset-x-0 bg-white border-b border-[#E8ECEE] shadow-lg z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <Container>
            <nav className="flex flex-col py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="py-3 text-[#172126] hover:text-[#0B5C63] transition-colors border-b border-[#F6F8F9]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2">
                <LanguageSwitcher />
              </div>
            </nav>
          </Container>
        </div>
      )}
    </div>
  );
}