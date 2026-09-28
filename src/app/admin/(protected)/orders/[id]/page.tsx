import { prisma } from "@/lib/prisma";
import { updateOrderStatus } from "@/app/admin/actions";

export default async function AdminOrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) return <div>Order not found</div>;

  const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-2">تفاصيل الطلب</h1>
      <p className="text-muted mb-8 font-mono">{order.id}</p>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface p-6 border border-border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">عناصر الطلب</h2>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between border-b last:border-0 pb-2">
                  <span className="text-sm">{item.productName} <span className="text-muted">({item.quantity})</span></span>
                  <span className="text-sm font-medium">{item.total.toFixed(3)} د.ك</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface p-6 border border-border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">معلومات العميل</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-muted" dir="ltr">{order.phone}</p>
              <p className="text-muted">{order.area}</p>
              <p className="text-muted">{order.address}</p>
            </div>
          </div>

          <div className="bg-surface p-6 border border-border rounded-lg">
            <h2 className="text-lg font-semibold mb-4">تحديث الحالة</h2>
            <form action={updateOrderStatus} className="space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <select name="status" defaultValue={order.status} className="w-full h-11 px-4 border border-border rounded-md">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" className="w-full h-11 bg-primary text-white rounded-md">حفظ</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}