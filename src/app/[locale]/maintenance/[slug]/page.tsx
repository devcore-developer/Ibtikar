import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TechnicianCard } from "@/components/technicians/TechnicianCard";
import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { maintenanceServices, getServiceBySlug } from "@/data/maintenance-services";
import { prisma } from "@/lib/prisma";

export async function generateStaticParams() {
  return maintenanceServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  const isAr = locale === "ar";
  return { title: isAr ? `${service.nameAr} | ابتكار الخليج` : `${service.nameEn} | Ibtikar Al Khaleej` };
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const t = useTranslations("Maintenance");
  const tNav = useTranslations("Navbar");
  const service = getServiceBySlug(slug);
  
  if (!service) return notFound();
  
  const relatedTechs = await prisma.technician.findMany({
    where: { isActive: true, serviceSlugs: { has: slug } },
    take: 4
  });

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[
        { name: tNav("home"), href: `/${locale}` },
        { name: tNav("maintenance"), href: `/${locale}/maintenance` },
        { name: locale === "ar" ? service.nameAr : service.nameEn }
      ]} />

      <div className="grid md:grid-cols-2 gap-8 mb-16 border-b border-border pb-12">
        <div className="aspect-video bg-muted/5 border border-border rounded-xl flex items-center justify-center">
          <service.icon size={96} className="text-primary/30" strokeWidth={1} />
        </div>
        <div>
          <Heading level={1} className="mb-4">{locale === "ar" ? service.nameAr : service.nameEn}</Heading>
          <p className="text-muted leading-relaxed mb-6">{locale === "ar" ? service.descriptionAr : service.descriptionEn}</p>
          <Link href={`/${locale}/maintenance/request`}>
            <Button size="lg">{t("requestService")}</Button>
          </Link>
        </div>
      </div>

      {relatedTechs.length > 0 && (
        <div>
          <Heading level={2} className="mb-6">{t("relatedTechs")}</Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTechs.map(t => <TechnicianCard key={t.id} technician={t as any} />)}
          </div>
        </div>
      )}
    </Container>
  );
}