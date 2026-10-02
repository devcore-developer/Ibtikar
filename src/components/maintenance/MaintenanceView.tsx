"use client";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { MaintenanceServiceCard } from "@/components/maintenance/MaintenanceServiceCard";
import { TechnicianCard } from "@/components/technicians/TechnicianCard";
import { useTranslations } from "next-intl";
import { maintenanceServices } from "@/data/maintenance-services";

export function MaintenanceView({ technicians }: { technicians: any[] }) {
  const t = useTranslations("Maintenance");

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
          {technicians.map(tech => <TechnicianCard key={tech.id} technician={tech as any} />)}
        </div>
      </div>
    </Container>
  );
}