import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { useTranslations, useLocale } from "next-intl";

export default async function SparePartsPage() {
  const categoriesRaw = await prisma.category.findMany({ where: { isActive: true } });
  const productsRaw = await prisma.product.findMany({ where: { isActive: true }, include: { category: true } });
  const categories = categoriesRaw.map(c => ({ ...c, icon: (c as any).icon || null, descriptionAr: c.descriptionAr || "", descriptionEn: c.descriptionEn || "" }));
  const products = productsRaw.map(p => ({ ...p, categorySlug: p.category?.slug || "", images: [] }));

  return <SparePartsView categories={categories} products={products} />;
}

function SparePartsView({ categories, products }: { categories: any[], products: any[] }) {
  const t = useTranslations("SpareParts");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[{ name: tNav("home"), href: `/${locale}` }, { name: tNav("parts") }]} />
      <div className="text-center mb-12">
        <Heading level={1} className="text-3xl md:text-4xl mb-3">{t("allCategoriesTitle")}</Heading>
        <p className="text-muted max-w-2xl mx-auto">{t("allCategoriesSubtitle")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return <CategoryCard key={cat.id} category={cat} count={count} />;
        })}
      </div>
    </Container>
  );
}