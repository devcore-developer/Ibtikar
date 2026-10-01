import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGrid } from "@/components/products/ProductGrid";
import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Package } from "lucide-react";
import { ProductDetailsClient } from "@/components/products/ProductDetailsClient";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  
  const isAr = locale === "ar";
  const name = isAr ? product.nameAr : product.nameEn;
  return {
    title: `${name} | Ebtikar Al Khaleej`,
    description: isAr ? product.descriptionAr || "" : product.descriptionEn || ""
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const t = useTranslations("SpareParts");
  const tNav = useTranslations("Navbar");
  
  const productRaw = await prisma.product.findUnique({
    where: { slug },
    include: { category: true }
  });

  if (!productRaw) return notFound();

  const product = {
    ...productRaw,
    descriptionAr: productRaw.descriptionAr || "",
    descriptionEn: productRaw.descriptionEn || "",
    shortDescriptionAr: productRaw.shortDescriptionAr || "",
    shortDescriptionEn: productRaw.shortDescriptionEn || "",
    partNumber: productRaw.partNumber || "",
    brand: productRaw.brand || "",
    categorySlug: productRaw.category?.slug || "",
    images: []
  };
  
  const category = productRaw.category ? { 
    ...productRaw.category, 
    icon: (productRaw.category as any).icon || null,
    descriptionAr: productRaw.category.descriptionAr || "",
    descriptionEn: productRaw.category.descriptionEn || ""
  } : undefined;

  // جلب منتجات ذات صلة مع تضمين التصنيف
  const relatedRaw = await prisma.product.findMany({
    where: { 
      categoryId: productRaw.categoryId, 
      NOT: { id: productRaw.id },
      isActive: true 
    },
    include: { category: true },
    take: 4
  });

  const related = relatedRaw.map(p => ({ 
    ...p,
    descriptionAr: p.descriptionAr || "",
    descriptionEn: p.descriptionEn || "",
    shortDescriptionAr: p.shortDescriptionAr || "",
    shortDescriptionEn: p.shortDescriptionEn || "",
    partNumber: p.partNumber || "",
    brand: p.brand || "",
    categorySlug: p.category?.slug || "",
    images: []
  }));

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[
        { name: tNav("home"), href: `/${locale}` },
        { name: tNav("parts"), href: `/${locale}/spare-parts` },
        { name: category ? (locale === "ar" ? category.nameAr : category.nameEn) : "", href: `/${locale}/spare-parts/${product.categorySlug}` },
        { name: locale === "ar" ? product.nameAr : product.nameEn }
      ]} />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-20">
        <div className="aspect-square bg-muted/5 border border-border rounded-xl flex items-center justify-center relative overflow-hidden">
          <Package size={128} className="text-muted/20" strokeWidth={1} />
          <span className="absolute bottom-4 end-4 bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium text-muted rounded-md border border-border">
            {t("imagePlaceholder")}
          </span>
        </div>

        <ProductDetailsClient product={product} category={category} />
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">{t("relatedProducts")}</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </Container>
  );
}