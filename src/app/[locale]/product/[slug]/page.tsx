import { products, getProductBySlug, getRelatedProducts } from "@/data/products";
import { categories } from "@/data/categories"; // <--- أضف هذا الاستيراد
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGrid } from "@/components/products/ProductGrid";
import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Package } from "lucide-react";
import { ProductDetailsClient } from "@/components/products/ProductDetailsClient";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { locale: string, slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  
  const isAr = params.locale === "ar";
  const name = isAr ? product.nameAr : product.nameEn;
  return {
    title: `${name} | Ibtikar Al Khaleej`,
    description: isAr ? product.descriptionAr : product.descriptionEn
  };
}

export default function ProductDetailsPage({ params }: { params: { locale: string, slug: string } }) {
  const t = useTranslations("SpareParts");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();
  
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  const category = categories.find(c => c.id === product.categoryId);
  const related = getRelatedProducts(product.id, product.categorySlug);

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[
        { name: tNav("home"), href: `/${locale}` },
        { name: tNav("parts"), href: `/${locale}/spare-parts` },
        { name: category ? (locale === "ar" ? category.nameAr : category.nameEn) : "", href: `/${locale}/spare-parts/${product.categorySlug}` },
        { name: locale === "ar" ? product.nameAr : product.nameEn }
      ]} />

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-20">
        {/* Gallery Placeholder */}
        <div className="aspect-square bg-muted/5 border border-border rounded-xl flex items-center justify-center relative overflow-hidden">
          <Package size={128} className="text-muted/20" strokeWidth={1} />
          <span className="absolute bottom-4 end-4 bg-background/80 backdrop-blur px-3 py-1 text-xs font-medium text-muted rounded-md border border-border">
            {t("imagePlaceholder")}
          </span>
        </div>

        {/* Client Component for Info & Cart Actions */}
        <ProductDetailsClient product={product} category={category} />
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6">{t("relatedProducts")}</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </Container>
  );
}