import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/Card";
import { Package, ShoppingCart, Wrench, Mail } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const [products, orders, maintenance, messages] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.maintenanceRequest.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  const stats = [
    { label: "المنتجات", value: products, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "الطلبات", value: orders, icon: ShoppingCart, color: "bg-accent/10 text-accent" },
    { label: "طلبات الصيانة", value: maintenance, icon: Wrench, color: "bg-secondary/10 text-secondary" },
    { label: "رسائل غير مقروءة", value: messages, icon: Mail, color: "bg-error/10 text-error" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">أحدث الطلبات</h2>
          <Card>
            <CardContent className="p-0">
              {/* Map through recent orders here */}
              <div className="p-4 text-center text-muted">لا توجد طلبات حديثة</div>
            </CardContent>
          </Card>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">أحدث طلبات الصيانة</h2>
          <Card>
            <CardContent className="p-0">
              {/* Map through recent maintenance requests here */}
              <div className="p-4 text-center text-muted">لا توجد طلبات صيانة حديثة</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}