import { Container } from "@/components/ui/Container";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceHighlights } from "@/components/home/ServiceHighlights";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { TechniciansSection } from "@/components/home/TechniciansSection";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  // جلب جميع البيانات المطلوبة للصفحة الرئيسية هنا
  const categories = await prisma.category.findMany({ where: { isActive: true } });
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    take: 4
  });
  const technicians = await prisma.technician.findMany({
    where: { isActive: true },
    take: 4
  });

  return (
    <>
      {/* 1) القسم الرئيسي Hero — زي ما هو بالظبط من غير أي تغيير */}
      <HeroSection />

      {/* 2) المنتجات المميزة — تحت الـ Hero مباشرة */}
      <FeaturedProducts products={products} />

      {/* 3) تصفح قطع الغيار */}
      <CategoriesSection categories={categories} />

      {/* 4) فريق الفنيين */}
      <TechniciansSection technicians={technicians} />

      {/* 5) ميزات الموقع — آخر سيكشن في الصفحة */}
      <ServiceHighlights />
    </>
  );
}