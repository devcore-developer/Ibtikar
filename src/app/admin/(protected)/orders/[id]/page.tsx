import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader, StatusBadge, AdminButton } from "@/components/admin/ui";
import { updateOrderStatus } from "@/app/admin/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) return notFound();

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-[#68777D] hover:text-[#0B5C63] mb-2">
            <ArrowRight size={16} /> العودة للطلبات
          </Link>
          <h1 className="text-2xl font-bold text-[#172126]">تفاصيل الطلب</h1>
          <p className="text-[#68777D] mt-1">#{order.id.slice(-8).toUpperCase()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <AdminCardHeader title="عناصر الطلب" />
            <div className="p-5 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b border-[#E8ECEE] last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-[#172126]">{item.productName}</p>
                    <p className="text-sm text-[#68777D]">{item.quantity} × {item.price.toFixed(3)} د.ك</p>
                  </div>
                  <p className="font-bold text-[#172126]">{item.total.toFixed(3)} د.ك</p>
                </div>
              ))}
            </div>
            <div className="p-5 bg-[#F6F8F9] border-t border-[#E8ECEE] space-y-2">
              <div className="flex justify-between text-sm"><span className="text-[#68777D]">المجموع الفرعي</span><span>{order.subtotal.toFixed(3)} د.ك</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#68777D]">رسوم التوصيل</span><span>{order.deliveryFee.toFixed(3)} د.ك</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#E8ECEE]"><span>الإجمالي</span><span className="text-[#0B5C63]">{order.total.toFixed(3)} د.ك</span></div>
            </div>
          </AdminCard>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          <AdminCard>
            <AdminCardHeader title="معلومات العميل" />
            <div className="p-5 space-y-3 text-sm">
              <div><p className="text-[#68777D] mb-1">الاسم</p><p className="font-medium">{order.customerName}</p></div>
              <div><p className="text-[#68777D] mb-1">الهاتف</p><p className="font-medium ltr-dir" dir="ltr">{order.phone}</p></div>
              <div><p className="text-[#68777D] mb-1">المنطقة</p><p className="font-medium">{order.area === "INSIDE" ? "داخل الجهراء" : "خارج الجهراء"}</p></div>
              <div><p className="text-[#68777D] mb-1">العنوان</p><p className="font-medium">{order.address}</p></div>
              {order.notes && <div><p className="text-[#68777D] mb-1">ملاحظات</p><p className="font-medium">{order.notes}</p></div>}
            </div>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader title="تحديث الحالة" />
            <form action={updateOrderStatus} className="p-5 space-y-4">
              <input type="hidden" name="id" value={order.id} />
              <select name="status" defaultValue={order.status} className="w-full h-11 px-4 border border-[#E8ECEE] rounded-lg focus:outline-none focus:border-[#0B5C63] bg-white">
                {statuses.map(s => <option key={s} value={s}>{statusTranslations[s]}</option>)}
              </select>
              <AdminButton type="submit" className="w-full">حفظ التغييرات</AdminButton>
            </form>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

// Helper for translations if not imported
const statusTranslations: Record<string, string> = {
  PENDING: "قيد الانتظار", CONFIRMED: "تم التأكيد", PROCESSING: "قيد التجهيز",
  OUT_FOR_DELIVERY: "خرج للتوصيل", COMPLETED: "مكتمل", CANCELLED: "ملغي",
};