import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2 } from "lucide-react";

export default async function AdminTechniciansPage() {
  const technicians = await prisma.technician.findMany({ orderBy: { nameAr: "asc" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">إدارة الفنيين</h1>
        <Button className="gap-2"><Plus size={18} /> إضافة فني</Button>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-start">
          <thead className="bg-muted/5 border-b border-border">
            <tr>
              <th className="p-4 text-start text-sm font-medium text-muted">اسم الفني</th>
              <th className="p-4 text-start text-sm font-medium text-muted">التخصص</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الهاتف</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الحالة</th>
              <th className="p-4 text-start text-sm font-medium text-muted">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {technicians.map((t: any) => (
              <tr key={t.id} className="border-b border-border last:border-0">
                <td className="p-4 text-sm font-medium text-foreground">{t.nameAr}</td>
                <td className="p-4 text-sm text-muted">{t.specialtyAr}</td>
                <td className="p-4 text-sm text-muted" dir="ltr">{t.phone || "-"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${t.isActive ? "bg-success/10 text-success" : "bg-muted/10 text-muted"}`}>
                    {t.isActive ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-muted hover:text-primary"><Edit size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}