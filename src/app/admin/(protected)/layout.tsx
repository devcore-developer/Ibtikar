import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ProtectedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await getSession();
  
  // التأكد من تسجيل الدخول قبل السماح بالدخول للوحة التحكم
  if (!session) {
    redirect("/admin/login");
  }

  // تغليف المحتوى بالـ Admin Shell الجديد
  return (
    <div dir="rtl">
      <AdminShell>
        {children}
      </AdminShell>
    </div>
  );
}