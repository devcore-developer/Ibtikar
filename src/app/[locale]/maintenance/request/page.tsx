import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MaintenanceRequestForm } from "@/components/maintenance/MaintenanceRequestForm";
import { useTranslations, useLocale } from "next-intl";

export default function MaintenanceRequestPage() {
  const t = useTranslations("Maintenance");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();

  return (
    <Container className="py-12 md:py-16 max-w-3xl">
      <Breadcrumb items={[
        { name: tNav("home"), href: `/${locale}` },
        { name: tNav("maintenance"), href: `/${locale}/maintenance` },
        { name: t("requestService") }
      ]} />
      <div className="text-center mb-10">
        <Heading level={1} className="mb-2">{t("formTitle")}</Heading>
        <p className="text-muted">{t("formSubtitle")}</p>
      </div>
      <div className="bg-surface p-6 md:p-8 border border-border rounded-lg shadow-sm">
        <MaintenanceRequestForm />
      </div>
    </Container>
  );
}