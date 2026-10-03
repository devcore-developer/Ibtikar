import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";

export default async function ProtectedLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await getSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* يجب أن يغلف الـ Provider الـ AdminShell نفسه وليس المحتوى الداخلي فقط */}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AdminShell>
          {children}
        </AdminShell>
      </NextIntlClientProvider>
    </div>
  );
}