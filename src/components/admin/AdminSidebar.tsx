"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Wrench, Mail, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Admin");

  const navItems = [
    { href: "/admin", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/products", label: t("products"), icon: Package },
    { href: "/admin/categories", label: t("categories"), icon: FolderTree },
    { href: "/admin/orders", label: t("orders"), icon: ShoppingCart },
    { href: "/admin/technicians", label: t("technicians"), icon: Wrench },
    { href: "/admin/maintenance", label: t("maintenance"), icon: Wrench },
    { href: "/admin/messages", label: t("messages"), icon: Mail },
    { href: "/admin/settings", label: t("settings"), icon: Settings },
  ];

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-secondary text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold">{t("brandName")}</h1>
        <p className="text-xs text-white/60">{t("adminPanel")}</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors">
          <LogOut size={18} />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}