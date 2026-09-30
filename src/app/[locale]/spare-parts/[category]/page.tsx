import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductListing } from "@/components/products/ProductListing";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, category: string }> }) {
  const { locale, category } = await params;
  const cat = categories.find(c => c.slug === category);
  if (!cat) return {};
  
  const isAr = locale === "ar";
  return {
    title: isAr ? `${cat.nameAr} | ابتكار الخليج` : `${cat.nameEn} | Ibtikar Al Khaleej`,
    description: isAr ? `تصفح ${cat.nameAr} المتوفرة لدى ابتكار الخليج في الجهراء، الكويت.` : `Browse ${cat.nameEn} available at Ibtikar Al Khaleej in Al Jahra, Kuwait.`
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string, category: string }> }) {
  const { locale, category } = await params;
  const t = useTranslations("SpareParts");
  const tNav = useTranslations("Navbar");
  const cat = categories.find(c => c.slug === category);
  
  if (!cat) return notFound();

  const products = getProductsByCategory(category);

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[
        { name: tNav("home"), href: `/${locale}` },
        { name: tNav("parts"), href: `/${locale}/spare-parts` },
        { name: locale === "ar" ? cat.nameAr : cat.nameEn }
      ]} />
      
      <div className="mb-10 border-b border-border pb-6">
        <Heading level={1} className="text-3xl md:text-4xl mb-2 flex items-center gap-3">
          <cat.icon className="text-primary" size={32} strokeWidth={1.5} />
          {locale === "ar" ? cat.nameAr : cat.nameEn}
        </Heading>
        <p className="text-muted">{locale === "ar" ? cat.descriptionAr : cat.descriptionEn}</p>
      </div>

      <ProductListing products={products} />
    </Container>
  );
}