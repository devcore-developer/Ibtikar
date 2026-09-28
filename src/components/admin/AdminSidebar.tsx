"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Wrench, Mail, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions"; // تم التعديل هنا
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "التصنيفات", icon: FolderTree },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/technicians", label: "الفنيون", icon: Wrench },
  { href: "/admin/maintenance", label: "طلبات الصيانة", icon: Wrench },
  { href: "/admin/messages", label: "الرسائل", icon: Mail },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction(); // تم التعديل هنا
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-secondary text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold">ابتكار الخليج</h1>
        <p className="text-xs text-white/60">لوحة الإدارة</p>
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
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}