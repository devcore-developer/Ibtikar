import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { MaintenanceServiceCard } from "@/components/maintenance/MaintenanceServiceCard";
import { TechnicianCard } from "@/components/technicians/TechnicianCard";
import { useTranslations, useLocale } from "next-intl";
import { maintenanceServices } from "@/data/maintenance-services";
import { prisma } from "@/lib/prisma";

export default async function MaintenancePage() {
  const t = useTranslations("Maintenance");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();
  
  const technicians = await prisma.technician.findMany({ where: { isActive: true }, take: 4 });

  return (
    <Container className="py-12 md:py-16">
      <div className="text-center mb-12">
        <Heading level={1} className="mb-2">{t("heroTitle")}</Heading>
        <p className="text-muted">{t("heroSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {maintenanceServices.map(s => <MaintenanceServiceCard key={s.id} service={s} />)}
      </div>

      <div>
        <Heading level={2} className="mb-6">{t("ourTeam")}</Heading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technicians.map(t => <TechnicianCard key={t.id} technician={t as any} />)}
        </div>
      </div>
    </Container>
  );
}