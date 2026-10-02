import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader, StatusBadge, AdminButton } from "@/components/admin/ui";
import { OrderStatusTimeline } from "@/components/admin/OrderStatusTimeline";
import { updateOrderStatus, verifyPaymentAction } from "@/app/admin/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, Package, User, Phone, MapPin, CreditCard, 
  Wallet, Banknote, Clock, MessageSquare, Eye 
} from "lucide-react";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) return notFound();

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];

  const statusTranslations: Record<string, string> = {
    PENDING: "قيد الانتظار", CONFIRMED: "تم التأكيد", PROCESSING: "قيد التجهيز",
    OUT_FOR_DELIVERY: "خرج للتوصيل", COMPLETED: "مكتمل", CANCELLED: "ملغي",
  };

  const paymentTranslations: Record<string, string> = {
    CASH_ON_DELIVERY: "الدفع عند الاستلام", WAMD: "وامض", BANK_TRANSFER: "تحويل بنكي",
    UNPAID: "غير مدفوع", PROOF_SUBMITTED: "إثبات الدفع مرفوع", VERIFIED: "تم التحقق", REJECTED: "مرفوض",
  };

  const PaymentIcon = order.paymentMethod === "CASH_ON_DELIVERY" ? Banknote : order.paymentMethod === "WAMD" ? Wallet : CreditCard;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-[#68777D] hover:text-[#0B5C63] mb-2">
            <ArrowRight size={16} /> العودة للطلبات
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#172126]">تفاصيل الطلب</h1>
            <span className="text-[#68777D] font-mono">#{order.id.slice(-8).toUpperCase()}</span>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-[#68777D] mt-1 text-sm flex items-center gap-1.5">
            <Clock size={14} /> تم الإنشاء في {new Date(order.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content (Left/Right in RTL) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <AdminCard>
            <AdminCardHeader title="عناصر الطلب" action={<span className="text-sm text-[#68777D]">{order.items.length} منتج</span>} />
            <div className="divide-y divide-[#E8ECEE]">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#F6F8F9] rounded-lg flex items-center justify-center border border-[#E8ECEE]">
                      <Package className="text-[#68777D]" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-[#172126]">{item.productName}</p>
                      <p className="text-xs text-[#68777D]">الكمية: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-left">
                      <p className="text-[#68777D] text-xs">سعر الوحدة</p>
                      <p className="font-medium text-[#172126]">{item.price.toFixed(3)} د.ك</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[#68777D] text-xs">الإجمالي</p>
                      <p className="font-bold text-[#172126]">{item.total.toFixed(3)} د.ك</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div className="p-5 bg-[#F6F8F9] border-t border-[#E8ECEE] space-y-2">
              <div className="flex justify-between text-sm"><span className="text-[#68777D]">المجموع الفرعي</span><span className="font-medium text-[#172126]">{order.subtotal.toFixed(3)} د.ك</span></div>
              <div className="flex justify-between text-sm"><span className="text-[#68777D]">رسوم التوصيل</span><span className="font-medium text-[#172126]">{order.deliveryFee.toFixed(3)} د.ك</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#E8ECEE]"><span>الإجمالي النهائي</span><span className="text-[#0B5C63] bg-teal-50 px-2 py-0.5 rounded-md">{order.total.toFixed(3)} د.ك</span></div>
            </div>
          </AdminCard>

          {/* Status Timeline & Control */}
          <AdminCard>
            <AdminCardHeader title="حالة الطلب" />
            <div className="p-5 space-y-6">
              <OrderStatusTimeline currentStatus={order.status} />
              <form action={updateOrderStatus} className="flex flex-col sm:flex-row gap-3 items-end pt-4 border-t border-[#E8ECEE]">
                <input type="hidden" name="id" value={order.id} />
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm mb-1 text-[#68777D]">تغيير الحالة</label>
                  <select name="status" defaultValue={order.status} className="w-full h-11 px-4 border border-[#E8ECEE] rounded-lg focus:outline-none focus:border-[#0B5C63] bg-white text-sm">
                    {statuses.map(s => <option key={s} value={s}>{statusTranslations[s]}</option>)}
                  </select>
                </div>
                <AdminButton type="submit" className="w-full sm:w-auto">حفظ التغييرات</AdminButton>
              </form>
            </div>
          </AdminCard>

          {/* Order Notes */}
          <AdminCard>
            <AdminCardHeader title="ملاحظات الطلب" icon={MessageSquare} />
            <div className="p-5">
              {order.notes ? (
                <div className="bg-[#F6F8F9] p-4 rounded-lg border border-[#E8ECEE] text-sm text-[#172126]">
                  {order.notes}
                </div>
              ) : (
                <p className="text-sm text-[#68777D]">لا توجد ملاحظات حاليًا.</p>
              )}
            </div>
          </AdminCard>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <AdminCard>
            <AdminCardHeader title="معلومات العميل" icon={User} />
            <div className="p-5 grid grid-cols-1 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <User size={18} className="text-[#68777D]" />
                <div><p className="text-[#68777D] text-xs">الاسم</p><p className="font-medium text-[#172126]">{order.customerName}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-[#68777D]" />
                <div><p className="text-[#68777D] text-xs">الهاتف</p><a href={`tel:${order.phone}`} dir="ltr" className="font-medium text-[#0B5C63] hover:underline">{order.phone}</a></div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#68777D]" />
                <div>
                  <p className="text-[#68777D] text-xs">العنوان</p>
                  <p className="font-medium text-[#172126]">{order.area === "INSIDE" ? "داخل الجهراء" : "خارج الجهراء"} - {order.address}</p>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Payment Info */}
          <AdminCard>
            <AdminCardHeader title="معلومات الدفع" icon={PaymentIcon} />
            <div className="p-5 space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#68777D]">طريقة الدفع</span>
                <span className="font-medium text-[#172126]">{paymentTranslations[order.paymentMethod]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#68777D]">حالة الدفع</span>
                <StatusBadge status={order.paymentStatus} />
              </div>

              {/* Payment Proof */}
              {order.paymentProofUrl ? (
                <div className="pt-4 border-t border-[#E8ECEE]">
                  <p className="text-[#68777D] text-xs mb-2">إثبات التحويل</p>
                  <a href={order.paymentProofUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-[#E8ECEE]">
                      <Image src={order.paymentProofUrl} alt="Payment Proof" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="bg-white px-3 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 flex items-center gap-1"><Eye size={14} /> عرض الصورة</span>
                      </div>
                    </div>
                  </a>

                  {/* Verification Actions */}
                  {order.paymentStatus === "PROOF_SUBMITTED" && (
                    <form action={verifyPaymentAction} className="flex gap-2 mt-4">
                      <input type="hidden" name="id" value={order.id} />
                      <button type="submit" name="paymentStatus" value="VERIFIED" className="flex-1 h-10 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700">تأكيد الدفع</button>
                      <button type="submit" name="paymentStatus" value="REJECTED" className="flex-1 h-10 bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-lg hover:bg-red-100">رفض</button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="pt-4 border-t border-[#E8ECEE]">
                  <p className="text-sm text-[#68777D]">لا يوجد إثبات دفع مرفوع.</p>
                </div>
              )}
            </div>
          </AdminCard>

          {/* Order Info */}
          <AdminCard>
            <AdminCardHeader title="معلومات الطلب" icon={Package} />
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#68777D]">رقم الطلب</span><span className="font-mono text-[#172126]">#{order.id.slice(-8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span className="text-[#68777D]">تاريخ الإنشاء</span><span className="font-medium text-[#172126]">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span></div>
              <div className="flex justify-between"><span className="text-[#68777D]">الحالة</span><StatusBadge status={order.status} /></div>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}