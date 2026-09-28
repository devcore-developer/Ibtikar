import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteProduct, toggleProductStatus } from "@/app/admin/actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { nameAr: "asc" } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">إدارة المنتجات</h1>
        <Link href="/admin/products/new">
          <Button className="gap-2"><Plus size={18} /> إضافة منتج</Button>
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-start">
          <thead className="bg-muted/5 border-b border-border">
            <tr>
              <th className="p-4 text-start text-sm font-medium text-muted">اسم المنتج</th>
              <th className="p-4 text-start text-sm font-medium text-muted">التصنيف</th>
              <th className="p-4 text-start text-sm font-medium text-muted">السعر</th>
              <th className="p-4 text-start text-sm font-medium text-muted">الحالة</th>
              <th className="p-4 text-start text-sm font-medium text-muted">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="p-4 text-sm font-medium text-foreground">{p.nameAr}</td>
                <td className="p-4 text-sm text-muted">{p.category?.nameAr}</td>
                <td className="p-4 text-sm text-muted">{p.price.toFixed(3)} د.ك</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${p.isActive ? "bg-success/10 text-success" : "bg-muted/10 text-muted"}`}>
                    {p.isActive ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <button className="p-2 text-muted hover:text-primary"><Edit size={16} /></button>
                    </Link>
                    <form action={() => toggleProductStatus(p.id, p.isActive)}>
                      <button className="p-2 text-muted hover:text-accent" type="submit"><Plus size={16} /></button>
                    </form>
                    <form action={() => deleteProduct(p.id)}>
                      <button className="p-2 text-muted hover:text-error" type="submit"><Trash2 size={16} /></button>
                    </form>
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