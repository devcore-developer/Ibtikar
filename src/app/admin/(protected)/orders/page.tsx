import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">إدارة الطلبات</h1>
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/5 border-b border-border">
            <tr>
              <th className="p-4 text-start text-sm font-medium text-muted">رقم الطلب</th>
              <th className="p-4 text-start text-sm font-medium text-muted">العميل</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الإجمالي</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الحالة</th>
              <th className="p-4 text-start text-sm font-medium text-muted">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/5">
                <td className="p-4 text-sm font-mono text-primary">
                  <Link href={`/admin/orders/${o.id}`}>{o.id.substring(0, 8)}</Link>
                </td>
                <td className="p-4 text-sm font-medium">{o.customerName}</td>
                <td className="p-4 text-sm">{o.total.toFixed(3)} د.ك</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent">{o.status}</span>
                </td>
                <td className="p-4 text-sm text-muted">{new Date(o.createdAt).toLocaleDateString("ar-KW")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}