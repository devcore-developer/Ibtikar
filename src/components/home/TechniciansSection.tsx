import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { TechnicianCard } from "@/components/technicians/TechnicianCard";
import Link from "next/link";

export function TechniciansSection({ technicians }: { technicians: any[] }) {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <Heading level={2} className="mb-2">{t("techTitle")}</Heading>
            <p className="text-muted">{t("techSubtitle")}</p>
          </div>
          <Link href={`/${locale}/technicians`}>
            <span className="text-primary border border-border px-4 py-2 rounded-lg hover:bg-muted/5 text-sm font-medium">
              {t("viewAllTechs")}
            </span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technicians.map((tech) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      </Container>
    </section>
  );
}