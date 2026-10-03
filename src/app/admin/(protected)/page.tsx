import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader, EmptyState } from "@/components/admin/ui";
import { Package, ShoppingCart, ClipboardList, Mail, Wrench, Clock } from "lucide-react";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { formatCurrency } from "@/lib/format";
import { getOrderStatusLabel, getLocalizedField } from "@/lib/localization";

export default async function AdminDashboard() {
  const t = await getTranslations("Admin");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const textAlign = isRTL ? "text-right" : "text-left";

  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
  const maintenanceCount = await prisma.maintenanceRequest.count();
  const unreadMessages = await prisma.contactMessage.count({ where: { isRead: false } });
  const technicianCount = await prisma.technician.count();

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { items: true }
  });

  const stats = [
    { label: t("stats.totalProducts"), value: productCount, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: t("stats.totalOrders"), value: orderCount, icon: ShoppingCart, color: "bg-teal-50 text-teal-600" },
    { label: t("stats.pendingOrders"), value: pendingOrders, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: t("stats.maintenanceRequests"), value: maintenanceCount, icon: ClipboardList, color: "bg-indigo-50 text-indigo-600" },
    { label: t("stats.newMessages"), value: unreadMessages, icon: Mail, color: "bg-red-50 text-red-600" },
    { label: t("stats.totalTechnicians"), value: technicianCount, icon: Wrench, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-8 w-full max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-[#172126]">{t("welcome")}</h1>
        <p className="text-[#68777D] mt-1">{t("welcomeSubtitle")}</p>
      </div>

      {/* Stats Grid - 2 columns on mobile, auto scales on desktop */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-full">
        {stats.map((stat) => (
          <AdminCard key={stat.label} className="p-4 w-full min-w-0 overflow-hidden">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-[#172126]">{stat.value}</p>
            <p className="text-xs text-[#68777D] mt-1 truncate">{stat.label}</p>
          </AdminCard>
        ))}
      </div>

      {/* Recent Orders */}
      <AdminCard>
        <AdminCardHeader title={t("recentOrders")} action={<Link href="/admin/orders" className="text-sm text-[#0B5C63] font-medium hover:underline">{t("viewAll")}</Link>} />
        <div className="p-4">
          {recentOrders.length === 0 ? (
            <EmptyState title={t("noOrders")} description={t("noOrdersDesc")} />
          ) : (
            <>
              {/* Desktop Table (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full text-sm min-w-[600px] table-fixed">
                  <colgroup>
                    <col className="w-1/4" />
                    <col className="w-1/4" />
                    <col className="w-1/6" />
                    <col className="w-1/6" />
                    <col className="w-1/6" />
                  </colgroup>
                  <thead className={`${textAlign} text-[#68777D] border-b border-[#E8ECEE]`}>
                    <tr>
                      <th className="p-3 font-medium">{t("table.order")}</th>
                      <th className="p-3 font-medium">{t("table.customer")}</th>
                      <th className="p-3 font-medium">{t("table.total")}</th>
                      <th className="p-3 font-medium">{t("table.status")}</th>
                      <th className="p-3 font-medium">{t("table.date")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8ECEE]">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className={`${textAlign} hover:bg-[#F6F8F9]`}>
                        <td className="p-3 font-medium text-[#172126]">
                          <Link href={`/admin/orders/${order.id}`} className="hover:text-[#0B5C63]">
                            #{order.id.slice(-8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="p-3">{order.customerName}</td>
                        <td className="p-3 font-medium">{formatCurrency(order.total, locale)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === "COMPLETED" ? "bg-green-100 text-green-700" : 
                            order.status === "CANCELLED" ? "bg-red-100 text-red-700" : 
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {getOrderStatusLabel(order.status, locale)}
                          </span>
                        </td>
                        <td className="p-3 text-[#68777D]">
                          {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards (Visible on mobile only) */}
              <div className="md:hidden space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-[#E8ECEE] rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-[#0B5C63] text-sm font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </Link>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "COMPLETED" ? "bg-green-100 text-green-700" : 
                        order.status === "CANCELLED" ? "bg-red-100 text-red-700" : 
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {getOrderStatusLabel(order.status, locale)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#172126] truncate">{order.customerName}</h3>
                    <div className="flex justify-between items-center mt-2 text-sm text-[#68777D]">
                      <span>{formatCurrency(order.total, locale)}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </AdminCard>
    </div>
  );
}