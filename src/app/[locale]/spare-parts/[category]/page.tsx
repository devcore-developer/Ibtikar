import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductListing } from "@/components/products/ProductListing";
import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

export async function generateStaticParams() {
  const cats = await prisma.category.findMany({ select: { slug: true } });
  return cats.map((cat) => ({ category: cat.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string, category: string }> }) {
  const { locale, category } = await params;
  const t = useTranslations("SpareParts");
  const tNav = useTranslations("Navbar");
  
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return notFound();

  const products = await prisma.product.findMany({ where: { categoryId: cat.id, isActive: true } });

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

      <ProductListing products={products as any[]} />
    </Container>
  );
}