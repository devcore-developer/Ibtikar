import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const t = await getTranslations("Admin");
  
  const product = await prisma.product.findUnique({
    where: { id: params.id }
  });

  if (!product) return notFound();

  const categories = await prisma.category.findMany();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("productsPage.edit_title")}</h1>
      <ProductForm 
        mode="edit" 
        product={JSON.parse(JSON.stringify(product))} 
        categories={JSON.parse(JSON.stringify(categories))} 
      />
    </div>
  );
}