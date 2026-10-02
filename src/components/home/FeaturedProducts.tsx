import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/products/ProductCard";

export function FeaturedProducts({ products }: { products: any[] }) {
  const t = useTranslations("Home");

  return (
    <section className="py-20 md:py-24 bg-white border-y border-[#F0F2F3]">
      <Container>
        <div className="text-center mb-12">
          <div className="w-20 h-1 bg-[#086B70] mx-auto rounded-full mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#086B70] mb-4">
            {t("productsTitle")}
          </h2>
          <p className="text-[#7B8587] max-w-xl mx-auto text-lg">
            {t("productsSubtitle")}
          </p>
        </div>
        
        {/* استخدام مكون ProductCard الحقيقي الذي يحتوي على زر السلة */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}