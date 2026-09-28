import { HeroSection } from "@/components/home/HeroSection";
// import { ServiceHighlights } from "@/components/home/ServiceHighlights"; // قم بحذف هذا السطر إذا كان موجوداً
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { MaintenanceSection } from "@/components/home/MaintenanceSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { DeliveryPaymentSection } from "@/components/home/DeliveryPaymentSection";
import { TechniciansSection } from "@/components/home/TechniciansSection";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* <ServiceHighlights /> <- تمت إزالته لأنه موجود داخل الـ Hero */}
      <CategoriesSection />
      <FeaturedProducts />
      <MaintenanceSection />
      <WhyChooseUs />
      <DeliveryPaymentSection />
      <TechniciansSection />
      <ContactCTA />
    </>
  );
}