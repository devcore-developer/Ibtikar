import { Container } from "@/components/ui/Container";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceHighlights } from "@/components/home/ServiceHighlights";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TechniciansSection } from "@/components/home/TechniciansSection";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  // جلب البيانات — المنتجات المميزة تُختار فقط من المنتجات التي لديها صورة
  const categories = await prisma.category.findMany({ where: { isActive: true } });
  const productsRaw = await prisma.product.findMany({
    where: { isActive: true, NOT: { image: null } },
    include: { category: true },
    take: 24
  });
  // استبعاد أي روابط فارغة نظرياً ثم اختيار 4 فقط
  const products = productsRaw.filter((p) => p.image && p.image.trim() !== "").slice(0, 4);
  const technicians = await prisma.technician.findMany({
    where: { isActive: true },
    take: 4
  });

  return (
    <>
      {/* 1) القسم الرئيسي Hero — زي ما هو */}
      <HeroSection />

      {/* 2) المنتجات المميزة — كلها هتكون ليها صور */}
      <FeaturedProducts products={products} />

      {/* 3) تصفح قطع الغيار */}
      <CategoriesSection categories={categories} />

      {/* 4) فريق الفنيين */}
      <TechniciansSection technicians={technicians} />

      {/* 5) ميزات الموقع — آخر سيكشن */}
      <ServiceHighlights />
    </>
  );
}