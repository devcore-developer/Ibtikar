import { prisma } from "@/lib/prisma";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  // جلب إعدادات الدفع من قاعدة البيانات
  const settingsRaw = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  settingsRaw.forEach(s => settings[s.id] = s.value);

  return <CheckoutClient settings={settings} />;
}