import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { MaintenanceServiceCard } from "@/components/maintenance/MaintenanceServiceCard";
import { TechnicianCard } from "@/components/technicians/TechnicianCard";
import { maintenanceServices } from "@/data/maintenance-services";
import { technicians } from "@/data/technicians";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ClipboardList, PhoneCall, UserCheck, Wrench } from "lucide-react";

export const metadata = {
  title: "خدمات الصيانة | ابتكار الخليج",
};

export default function MaintenancePage() {
  const t = useTranslations("Maintenance");
  const locale = useLocale();

  const steps = [
    { icon: ClipboardList, title: t("step1Title"), desc: t("step1Desc") },
    { icon: PhoneCall, title: t("step2Title"), desc: t("step2Desc") },
    { icon: Wrench, title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-secondary text-white py-16 md:py-24">
        <Container className="text-center">
          <Heading level={1} className="text-white text-3xl md:text-4xl mb-4">{t("heroTitle")}</Heading>
          <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8">{t("heroSubtitle")}</p>
          <Link href={`/${locale}/maintenance/request`}>
            <Button variant="accent" size="lg">{t("requestService")}</Button>
          </Link>
        </Container>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} className="mb-2">{t("ourServices")}</Heading>
            <p className="text-muted">{t("servicesSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {maintenanceServices.map(s => <MaintenanceServiceCard key={s.id} service={s} />)}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-background border-y border-border">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2}>{t("howItWorks")}</Heading>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <step.icon size={24} />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg flex items-center justify-center gap-2">
                  <span className="text-accent">{idx+1}.</span> {step.title}
                </h3>
                <p className="text-muted text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Technicians Preview */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="flex justify-between items-end mb-12">
            <div>
              <Heading level={2} className="mb-2">{t("ourTeam")}</Heading>
              <p className="text-muted">{t("teamSubtitle")}</p>
            </div>
            <Link href={`/${locale}/technicians`} className="hidden md:block">
              <Button variant="ghost" className="text-primary border border-border">{t("viewAll")}</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicians.slice(0, 4).map(t => <TechnicianCard key={t.id} technician={t} />)}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link href={`/${locale}/technicians`}>
              <Button variant="outline">{t("viewAll")}</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="bg-primary text-white rounded-2xl p-10 md:p-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("ctaTitle")}</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">{t("ctaSubtitle")}</p>
            <Link href={`/${locale}/maintenance/request`}>
              <Button size="lg" variant="accent">{t("requestService")}</Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}