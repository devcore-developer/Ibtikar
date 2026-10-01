import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();
  
  // تمرر الـ categories فقط، ولا تمرر createProduct
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-8">إضافة منتج جديد</h1>
      <ProductForm categories={categories} />
    </div>
  );
}