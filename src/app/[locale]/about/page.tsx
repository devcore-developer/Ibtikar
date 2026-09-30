import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl"; // <--- أضف useLocale هنا
import Link from "next/link";
import { Package, Wrench, Headphones, MapPin } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "من نحن | ابتكار الخليج" : "About Us | Ibtikar Al Khaleej",
  };
}

export default function AboutPage() {
  const t = useTranslations("About");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();

  const services = [
    { icon: Package, title: t("services.parts"), desc: t("services.partsDesc") },
    { icon: Wrench, title: t("services.repair"), desc: t("services.repairDesc") },
    { icon: Headphones, title: t("services.support"), desc: t("services.supportDesc") },
    { icon: MapPin, title: t("services.local"), desc: t("services.localDesc") },
  ];

  return (
    <Container className="py-16 md:py-24">
      {/* Hero */}
      <div className="text-center mb-16">
        <Heading level={1} className="text-4xl mb-4">{t("title")}</Heading>
        <p className="text-muted max-w-2xl mx-auto">{t("intro")}</p>
      </div>

      {/* What we provide */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {services.map((s, i) => (
          <div key={i} className="text-center p-6 border border-border rounded-lg bg-surface">
            <s.icon className="mx-auto mb-4 text-primary" size={32} strokeWidth={1.5} />
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-muted">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href={`/${locale}/contact`}>
          <Button size="lg">{tNav("contact")}</Button>
        </Link>
        <Link href={`/${locale}/spare-parts`}>
          <Button variant="outline" size="lg">{tNav("parts")}</Button>
        </Link>
      </div>
    </Container>
  );
}