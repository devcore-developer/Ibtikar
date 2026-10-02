import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader, StatusBadge, EmptyState } from "@/components/admin/ui";
import { Package, ShoppingCart, ClipboardList, Mail, Wrench, Clock } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
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
    { label: "إجمالي المنتجات", value: productCount, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "إجمالي الطلبات", value: orderCount, icon: ShoppingCart, color: "bg-teal-50 text-teal-600" },
    { label: "طلبات معلقة", value: pendingOrders, icon: Clock, color: "bg-amber-50 text-amber-600" },
    { label: "طلبات الصيانة", value: maintenanceCount, icon: ClipboardList, color: "bg-indigo-50 text-indigo-600" },
    { label: "رسائل جديدة", value: unreadMessages, icon: Mail, color: "bg-red-50 text-red-600" },
    { label: "عدد الفنيين", value: technicianCount, icon: Wrench, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-8 w-full max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-2xl font-bold text-[#172126]">مرحبا بك في لوحة تحكم ابتكار الخليج</h1>
        <p className="text-[#68777D] mt-1">إدارة ومتابعة جميع عمليات المتجر.</p>
      </div>

      {/* Stats Grid */}
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
        <AdminCardHeader title="أحدث الطلبات" action={<Link href="/admin/orders" className="text-sm text-[#0B5C63] font-medium hover:underline">عرض الكل</Link>} />
        <div className="p-4">
          {recentOrders.length === 0 ? (
            <EmptyState title="لا توجد طلبات حتى الآن" description="ستظهر الطلبات الجديدة هنا." />
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm min-w-[600px]">
                <thead className="text-right text-[#68777D] border-b border-[#E8ECEE]">
                  <tr>
                    <th className="p-3 font-medium">رقم الطلب</th>
                    <th className="p-3 font-medium">العميل</th>
                    <th className="p-3 font-medium">الإجمالي</th>
                    <th className="p-3 font-medium">الحالة</th>
                    <th className="p-3 font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8ECEE]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F6F8F9]">
                      <td className="p-3 font-medium text-[#172126]">
                        <Link href={`/admin/orders/${order.id}`} className="hover:text-[#0B5C63]">
                          #{order.id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="p-3">{order.customerName}</td>
                      <td className="p-3 font-medium">{order.total.toFixed(3)} د.ك</td>
                      <td className="p-3"><StatusBadge status={order.status} /></td>
                      <td className="p-3 text-[#68777D]">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminCard>
    </div>
  );
}