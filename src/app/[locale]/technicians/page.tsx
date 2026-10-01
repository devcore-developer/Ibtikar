import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TechnicianCard } from "@/components/technicians/TechnicianCard";
import { useTranslations, useLocale } from "next-intl";

export const metadata = {
  title: "فريق الصيانة | ابتكار الخليج",
};

export default async function TechniciansPage() {
  const t = useTranslations("Technicians");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();

  const techsRaw = await prisma.technician.findMany({ where: { isActive: true } });

  // تنظيف البيانات لمنع null
  const technicians = techsRaw.map(t => ({
    ...t,
    bioAr: t.bioAr || "",
    bioEn: t.bioEn || "",
    phone: t.phone || "",
    experience: t.experience || ""
  }));

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[{ name: tNav("home"), href: `/${locale}` }, { name: tNav("technicians") }]} />
      
      <div className="text-center mb-12">
        <Heading level={1} className="mb-2">{t("title")}</Heading>
        <p className="text-muted max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {technicians.map((tech) => <TechnicianCard key={tech.id} technician={tech} />)}
      </div>
    </Container>
  );
}