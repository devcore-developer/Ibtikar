import { prisma } from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";
import { getOrderStatusLabel } from "@/lib/localization";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const t = await getTranslations("Admin.ordersPage");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const textAlign = isRTL ? "text-right" : "text-left";

  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm min-w-[600px] table-fixed">
          <colgroup>
            <col className="w-1/4" />
            <col className="w-1/4" />
            <col className="w-1/6" />
            <col className="w-1/6" />
            <col className="w-1/6" />
          </colgroup>
          <thead className={`${textAlign} text-[#68777D] border-b border-border`}>
            <tr>
              <th className="p-4 font-medium">{t("order_id")}</th>
              <th className="p-4 font-medium">{t("customer")}</th>
              <th className="p-4 font-medium">{t("total")}</th>
              <th className="p-4 font-medium">{t("status")}</th>
              <th className="p-4 font-medium">{t("date")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id} className={`${textAlign} hover:bg-muted/5`}>
                <td className="p-4 font-mono text-primary"><Link href={`/admin/orders/${o.id}`}>{o.id.substring(0, 8)}</Link></td>
                <td className="p-4 font-medium">{o.customerName}</td>
                <td className="p-4">{o.total.toFixed(3)} {t("currency")}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    o.status === "COMPLETED" ? "bg-green-100 text-green-700" : 
                    o.status === "CANCELLED" ? "bg-red-100 text-red-700" : 
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {getOrderStatusLabel(o.status, locale)}
                  </span>
                </td>
                <td className="p-4 text-muted">{new Date(o.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-white border border-[#E8ECEE] rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/admin/orders/${o.id}`} className="font-mono text-primary text-sm font-medium">
                #{o.id.substring(0, 8).toUpperCase()}
              </Link>
              <span className={`px-2 py-1 text-xs rounded-full ${
                o.status === "COMPLETED" ? "bg-green-100 text-green-700" : 
                o.status === "CANCELLED" ? "bg-red-100 text-red-700" : 
                "bg-amber-100 text-amber-700"
              }`}>
                {getOrderStatusLabel(o.status, locale)}
              </span>
            </div>
            <h3 className="font-semibold text-[#172126] truncate">{o.customerName}</h3>
            <div className="flex justify-between items-center mt-2 text-sm text-[#68777D]">
              <span>{o.total.toFixed(3)} {t("currency")}</span>
              <span>{new Date(o.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}</span>
            </div>
            <Link href={`/admin/orders/${o.id}`} className="block text-center mt-4 pt-3 border-t border-[#E8ECEE] text-primary text-sm font-medium">
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}