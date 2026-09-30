import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { technicians, getTechnicianBySlug } from "@/data/technicians";
import { notFound } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { UserCircle, Phone, Wrench, Briefcase } from "lucide-react";
import Link from "next/link";

export function generateStaticParams() {
  return technicians.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const tech = getTechnicianBySlug(slug);
  if (!tech) return {};
  const isAr = locale === "ar";
  return {
    title: isAr ? `${tech.nameAr} | ابتكار الخليج` : `${tech.nameEn} | Ibtikar Al Khaleej`,
  };
}

export default async function TechnicianProfilePage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const t = useTranslations("Technicians");
  const tNav = useTranslations("Navbar");
  const tech = getTechnicianBySlug(slug);
  
  if (!tech) return notFound();

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[
        { name: tNav("home"), href: `/${locale}` },
        { name: tNav("technicians"), href: `/${locale}/technicians` },
        { name: locale === "ar" ? tech.nameAr : tech.nameEn }
      ]} />

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="text-center">
          <div className="w-32 h-32 mx-auto rounded-full bg-muted/10 flex items-center justify-center text-muted/40 mb-4">
            <UserCircle size={100} strokeWidth={1} />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{locale === "ar" ? tech.nameAr : tech.nameEn}</h1>
          <p className="text-accent font-medium mb-4">{locale === "ar" ? tech.specialtyAr : tech.specialtyEn}</p>
          
          {tech.experience && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted mb-2">
              <Briefcase size={16} /> {tech.experience} {t("experience")}
            </div>
          )}
          
          {tech.phone && (
            <a href={`tel:${tech.phone}`} className="flex items-center justify-center gap-2 text-sm text-primary hover:underline mb-6">
              <Phone size={16} /> <span dir="ltr">{tech.phone}</span>
            </a>
          )}

          <Link href={`/${locale}/maintenance/request`}>
            <Button className="w-full gap-2"><Wrench size={18} /> {t("requestFromTech")}</Button>
          </Link>
        </div>

        {/* Bio & Services */}
        <div className="md:col-span-2">
          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-3">{t("about")}</h2>
            <p className="text-muted leading-relaxed">{locale === "ar" ? tech.bioAr : tech.bioEn}</p>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{t("specialties")}</h2>
            <div className="flex flex-wrap gap-2">
              {tech.serviceSlugs.map(slug => (
                <Link key={slug} href={`/${locale}/maintenance/${slug}`}>
                  <span className="px-4 py-2 bg-primary/10 text-primary text-sm rounded-md hover:bg-primary/20 transition-colors cursor-pointer">
                    {t(`services.${slug}`)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}