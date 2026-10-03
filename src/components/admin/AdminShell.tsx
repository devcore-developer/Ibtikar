"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { AdminLanguageSwitcher } from "./AdminLanguageSwitcher";
import { 
  LayoutDashboard, Package, Tags, ShoppingCart, Wrench, 
  ClipboardList, Mail, Settings, LogOut, Menu, X 
} from "lucide-react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isRTL = locale === "ar";
  const sidebarPos = isRTL ? "right-0" : "left-0";
  const mainMargin = isRTL ? "lg:mr-64" : "lg:ml-64";

  const navItems = [
    { href: "/admin", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/products", label: t("products"), icon: Package },
    { href: "/admin/categories", label: t("categories"), icon: Tags },
    { href: "/admin/orders", label: t("orders"), icon: ShoppingCart },
    { href: "/admin/technicians", label: t("technicians"), icon: Wrench },
    { href: "/admin/maintenance", label: t("maintenance"), icon: ClipboardList },
    { href: "/admin/messages", label: t("messages"), icon: Mail },
    { href: "/admin/settings", label: t("settings"), icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#123B4A] text-white">
      <div className="p-6 flex items-center gap-2 border-b border-white/10">
        <Image 
          src="/logos/logo.png" 
          alt="Ebtezar Al Khaleej Logo" 
          width={32} 
          height={32} 
          className="rounded-lg object-contain"
          priority
        />
        <span className="font-bold text-lg text-white">{t("brandName")}</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-[#0B5C63] text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Admin Language Switcher */}
      <div className="p-4 border-t border-white/10">
        <AdminLanguageSwitcher />
      </div>

      <div className="p-4 border-t border-white/10">
        <Link 
          href="/admin/login" 
          className="w-full h-10 px-4 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors duration-200 focus:outline-none text-white border border-white/20 hover:bg-white/10"
        >
          <LogOut size={16} />
          {t("logout")}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F6F8F9] flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-[#E8ECEE] sticky top-0 z-30">
        <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-lg hover:bg-[#F6F8F9]">
          <Menu size={24} className="text-[#172126]" />
        </button>
        <div className="flex items-center gap-2">
          <Image 
            src="/logos/logo.png" 
            alt="Ebtikar Al Khaleej Logo" 
            width={28} 
            height={28} 
            className="rounded-lg object-contain"
          />
          <span className="font-bold text-[#172126]">{t("adminPanel")}</span>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="flex flex-1">
        <aside className={`hidden lg:block w-64 fixed top-0 bottom-0 ${sidebarPos} z-30`}>
          <SidebarContent />
        </aside>

        {/* Mobile Drawer */}
        {drawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
            <aside className={`absolute top-0 bottom-0 ${sidebarPos} w-64 z-10`}>
              <button onClick={() => setDrawerOpen(false)} className={`absolute top-4 ${isRTL ? "left-4" : "right-4"} text-white/70 z-10`}>
                <X size={24} />
              </button>
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${mainMargin} p-4 lg:p-8 overflow-x-hidden w-full`}>
          {children}
        </main>
      </div>
    </div>
  );
}