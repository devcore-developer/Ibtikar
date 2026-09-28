import { prisma } from "@/lib/prisma";
import { createProduct } from "@/app/admin/actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">إضافة منتج جديد</h1>
      
      <form action={createProduct} className="bg-surface p-6 border border-border rounded-lg max-w-2xl space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم بالعربية</label>
            <input name="nameAr" required className="w-full h-11 px-4 border border-border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">الاسم بالإنجليزية</label>
            <input name="nameEn" required className="w-full h-11 px-4 border border-border rounded-md" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الرابط (Slug)</label>
          <input name="slug" required className="w-full h-11 px-4 border border-border rounded-md" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">السعر (د.ك)</label>
            <input name="price" type="number" step="0.001" required className="w-full h-11 px-4 border border-border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">التصنيف</label>
            <select name="categoryId" required className="w-full h-11 px-4 border border-border rounded-md">
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الوصف بالعربية</label>
          <textarea name="descriptionAr" rows={3} className="w-full p-2 border border-border rounded-md"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">رقم القطعة (اختياري)</label>
          <input name="partNumber" className="w-full h-11 px-4 border border-border rounded-md" />
        </div>
        
        <button type="submit" className="h-11 px-6 bg-primary text-white rounded-md hover:bg-primary/90">حفظ المنتج</button>
      </form>
    </div>
  );
}