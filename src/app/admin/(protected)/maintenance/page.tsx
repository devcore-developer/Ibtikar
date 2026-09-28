import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminMaintenancePage() {
  const requests = await prisma.maintenanceRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">طلبات الصيانة</h1>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-start">
          <thead className="bg-muted/5 border-b border-border">
            <tr>
              <th className="p-4 text-start text-sm font-medium text-muted">رقم الطلب</th>
              <th className="p-4 text-start text-sm font-medium text-muted">العميل</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الجهاز</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الهاتف</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الحالة</th>
              <th className="p-4 text-start text-sm font-medium text-muted">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r: any) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/5">
                <td className="p-4 text-sm font-mono text-primary">
                  <Link href={`/admin/maintenance/${r.id}`}>{r.id.substring(0, 8)}</Link>
                </td>
                <td className="p-4 text-sm font-medium">{r.customerName}</td>
                <td className="p-4 text-sm text-muted">{r.applianceType}</td>
                <td className="p-4 text-sm text-muted" dir="ltr">{r.phone}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-accent/10 text-accent">{r.status}</span>
                </td>
                <td className="p-4 text-sm text-muted">{new Date(r.createdAt).toLocaleDateString("ar-KW")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}