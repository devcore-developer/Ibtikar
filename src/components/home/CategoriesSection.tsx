import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { categories } from "@/data/categories";
import { ArrowRight, ArrowLeft, Refrigerator, WashingMachine, Wind, Plug, Flame, Wrench } from "lucide-react";
import Link from "next/link";

// خريطة للأيقونات لضمان توافقها مع البيانات
const iconMap: Record<string, any> = {
  cat_fridge: Refrigerator,
  cat_washer: WashingMachine,
  cat_ac: Wind,
  cat_vacuum: Plug,
  cat_cooker: Flame,
  cat_other: Wrench,
};

export function CategoriesSection() {
  const t = useTranslations("Home");
  const locale = useLocale();
  const ArrowIcon = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative py-20 md:py-28 bg-[#FAFCFC] overflow-hidden">
      {/* أشكال خلفية عضوية خفيفة جداً */}
      <div className="absolute top-0 start-0 w-1/3 h-1/3 bg-[#EAF5F5] rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 end-0 w-1/3 h-1/3 bg-[#EAF5F5] rounded-full blur-3xl opacity-40"></div>

      <Container className="relative z-10">
        {/* رأس القسم */}
        <div className="text-center mb-16">
          <div className="w-20 h-1 bg-[#086B70] mx-auto rounded-full mb-6"></div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#086B70] mb-4">
            {t("categoriesTitle")}
          </h2>
          <p className="text-[#7B8587] max-w-xl mx-auto text-lg">
            {t("categoriesSubtitle")}
          </p>
        </div>
        
        {/* شبكة التصنيفات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {categories.map((cat) => {
            const Icon = iconMap[cat.id] || Wrench;
            return (
              <Link href={`/${locale}/spare-parts/${cat.slug}`} key={cat.id}>
                <Card className="group bg-white border-[#EAF5F5] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardContent className="p-6 flex items-center gap-5">
                    {/* اليمين: الأيقونة (في واجهة RTL) */}
                    <div className="w-16 h-16 rounded-2xl bg-[#EAF5F5] flex items-center justify-center shrink-0 group-hover:bg-[#086B70] transition-colors duration-300">
                      <Icon className="w-8 h-8 text-[#086B70] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                    
                    {/* الوسط: النص */}
                    <div className="flex-1 text-start">
                      <h3 className="font-bold text-[#075F64] text-lg mb-1 group-hover:text-[#086B70] transition-colors">
                        {t(`categories.${cat.id.replace('cat_', '')}.name`)}
                      </h3>
                      <p className="text-sm text-[#7B8587] line-clamp-1">
                        {t(`categories.${cat.id.replace('cat_', '')}.desc`)}
                      </p>
                    </div>
                    
                    {/* اليسار: السهم (في واجهة RTL) */}
                    <div className="text-[#086B70] opacity-40 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-300 shrink-0">
                      <ArrowIcon size={24} strokeWidth={2} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}