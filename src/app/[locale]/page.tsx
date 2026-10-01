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
      <HeroSection />
      <ServiceHighlights />
      
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={products} />
      <TechniciansSection technicians={technicians} />
      
      {/* باقي مكونات الصفحة إذا وجدت */}
    </>
  );
}