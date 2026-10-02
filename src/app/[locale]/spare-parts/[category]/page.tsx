import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductListing } from "@/components/products/ProductListing";
import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export async function generateStaticParams() {
  const cats = await prisma.category.findMany({ select: { slug: true } });
  return cats.map((cat) => ({ category: cat.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string, category: string }> }) {
  const { locale, category } = await params;
  
  // جلب التصنيف والمنتجات في المكون Async
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  
  // إرجاع 404 فقط إذا كان التصنيف نفسه غير موجود
  if (!cat) return notFound();

  const products = await prisma.product.findMany({ where: { categoryId: cat.id, isActive: true } });

  // تمرير البيانات للمكون الغير Async
  return <CategoryView cat={cat} products={products} locale={locale} />;
}

// المكون الغير Async الذي يستخدم الترجمات
function CategoryView({ cat, products, locale }: { cat: any, products: any[], locale: string }) {
  const t = useTranslations("SpareParts");
  const tNav = useTranslations("Navbar");

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[
        { name: tNav("home"), href: `/${locale}` },
        { name: tNav("parts"), href: `/${locale}/spare-parts` },
        { name: locale === "ar" ? cat.nameAr : cat.nameEn }
      ]} />
      
      <div className="mb-10 border-b border-border pb-6">
        <Heading level={1} className="text-3xl md:text-4xl mb-2">
          {locale === "ar" ? cat.nameAr : cat.nameEn}
        </Heading>
        <p className="text-muted">{locale === "ar" ? (cat.descriptionAr || "") : (cat.descriptionEn || "")}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-muted/20 mb-4" strokeWidth={1} />
          <p className="text-muted text-lg mb-6">
            {locale === "ar" ? "لا توجد منتجات في هذا التصنيف حاليًا." : "No products are currently available in this category."}
          </p>
          <Link href={`/${locale}/spare-parts`}>
            <Button variant="outline">
              {locale === "ar" ? "العودة إلى قطع الغيار" : "Back to Spare Parts"}
            </Button>
          </Link>
        </div>
      ) : (
        <ProductListing products={products as any[]} />
      )}
    </Container>
  );
}