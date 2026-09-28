import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { featuredProducts } from "@/data/home";
import { Thermometer, WashingMachine, Wind, Flame, ShoppingCart } from "lucide-react";

// خريطة بصرية لتمثيل المنتجات بشكل أنيق بدلاً من المكعبات العامة
const productVisuals: Record<string, any> = {
  "1": Thermometer,
  "2": WashingMachine,
  "3": Wind,
  "4": Flame
};

export function FeaturedProducts() {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <section className="py-20 md:py-24 bg-white border-y border-[#F0F2F3]">
      <Container>
        {/* رأس القسم */}
        <div className="text-center mb-12">
          <div className="w-20 h-1 bg-[#086B70] mx-auto rounded-full mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#086B70] mb-4">
            {t("productsTitle")}
          </h2>
          <p className="text-[#7B8587] max-w-xl mx-auto text-lg">
            {t("productsSubtitle")}
          </p>
        </div>
        
        {/* شبكة المنتجات */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const Icon = productVisuals[product.id] || Thermometer;
            return (
              <Card key={product.id} className="flex flex-col group bg-white border border-[#E8ECEE]/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                
                {/* منطقة الصورة المضغوطة (45-50% من ارتفاع البطاقة) */}
                <div className="relative aspect-[4/3] bg-[#F6F8F9] flex items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#EAF5F5]/40 to-transparent"></div>
                  {/* تمثيل بصري نظيف للمنتج */}
                  <div className="relative w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-10 h-10 text-[#086B70]" strokeWidth={1.5} />
                  </div>
                </div>

                {/* معلومات المنتز */}
                <CardContent className="p-4 flex flex-col flex-1">
                  <span className="text-xs font-semibold text-[#F6A623] uppercase tracking-wider mb-1 block">
                    {locale === "ar" ? product.categoryAr : product.categoryEn}
                  </span>
                  <h3 className="text-sm font-bold text-[#075F64] mb-3 line-clamp-2 flex-1">
                    {locale === "ar" ? product.nameAr : product.nameEn}
                  </h3>
                  <p className="text-lg font-extrabold text-[#086B70] mb-4">
                    {product.price}
                  </p>
                </CardContent>

                {/* زر الإضافة للسلة */}
                <CardFooter className="p-4 pt-0">
                  <button className="w-full h-11 bg-[#086B70] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#075F64] transition-colors duration-300 shadow-sm">
                    <ShoppingCart size={18} strokeWidth={2} />
                    {t("addToCart")}
                  </button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}