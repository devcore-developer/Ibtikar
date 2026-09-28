import { prisma } from "@/lib/prisma";
import { updateSettings } from "../../actions";

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany();
  const getSetting = (id: string) => settings.find((s: any) => s.id === id)?.value || "";

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">إعدادات الموقع</h1>
      
      <form action={updateSettings} className="bg-surface p-6 border border-border rounded-lg max-w-2xl space-y-6">
        
        <div className="border-b border-border pb-4">
          <h2 className="text-lg font-semibold mb-4">معلومات الشركة</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">رقم الهاتف</label>
              <input name="phone" defaultValue={getSetting("phone")} className="w-full h-11 px-4 border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">واتساب</label>
              <input name="whatsapp" defaultValue={getSetting("whatsapp")} className="w-full h-11 px-4 border border-border rounded-md" />
            </div>
          </div>
        </div>

        <div className="border-b border-border pb-4">
          <h2 className="text-lg font-semibold mb-4">رسوم التوصيل</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">داخل الجهراء (د.ك)</label>
              <input name="delivery_inside" type="number" step="0.001" defaultValue={getSetting("delivery_inside") || "0.500"} className="w-full h-11 px-4 border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">خارج الجهراء (د.ك)</label>
              <input name="delivery_outside" type="number" step="0.001" defaultValue={getSetting("delivery_outside") || "1.000"} className="w-full h-11 px-4 border border-border rounded-md" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">بيانات التحويل البنكي</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم البنك</label>
              <input name="bank_name" defaultValue={getSetting("bank_name")} className="w-full h-11 px-4 border border-border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">رقم الآيبان (IBAN)</label>
              <input name="bank_iban" defaultValue={getSetting("bank_iban")} className="w-full h-11 px-4 border border-border rounded-md" />
            </div>
          </div>
        </div>

        <button type="submit" className="h-11 px-6 bg-primary text-white rounded-md">حفظ الإعدادات</button>
      </form>
    </div>
  );
}