import { prisma } from "@/lib/prisma";
import { deleteProduct, toggleProductStatus } from "@/app/admin/actions";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ include: { category: true } });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">المنتجات</h1>
        <Link href="/admin/products/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
          إضافة منتج
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-muted/5 border-b border-border">
            <tr>
              <th className="p-4 font-semibold">المنتج</th>
              <th className="p-4 font-semibold">التصنيف</th>
              <th className="p-4 font-semibold">السعر</th>
              <th className="p-4 font-semibold">الحالة</th>
              <th className="p-4 font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border">
                <td className="p-4">{p.nameAr}</td>
                <td className="p-4">{p.category?.nameAr || "-"}</td>
                <td className="p-4">{p.price.toFixed(3)} د.ك</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.isActive ? "مفعّل" : "معطّل"}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <form action={toggleProductStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-blue-500 text-sm hover:underline">
                      {p.isActive ? "تعطيل" : "تفعيل"}
                    </button>
                  </form>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-red-500 text-sm hover:underline">
                      حذف
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}