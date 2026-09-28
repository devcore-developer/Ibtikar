import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactForm } from "@/components/contact/ContactForm";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { COMPANY_INFO } from "@/config/company";

export const metadata = {
  title: "تواصل معنا | ابتكار الخليج",
};

export default function ContactPage() {
  const t = useTranslations("Contact");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();

  const info = [
    { icon: MapPin, label: t("location"), value: locale === "ar" ? COMPANY_INFO.locationAr : COMPANY_INFO.locationEn },
    { icon: Phone, label: t("phoneLabel"), value: COMPANY_INFO.phone || t("notAvailable") },
    { icon: MessageCircle, label: "WhatsApp", value: COMPANY_INFO.whatsapp || t("notAvailable") },
    { icon: Mail, label: t("emailLabel"), value: COMPANY_INFO.email || t("notAvailable") },
  ];

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[{ name: tNav("home"), href: `/${locale}` }, { name: tNav("contact") }]} />
      
      <div className="text-center mb-12">
        <Heading level={1} className="mb-2">{t("title")}</Heading>
        <p className="text-muted max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Info Side */}
        <div className="space-y-4">
          {info.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-surface border border-border p-4 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">{item.label}</h3>
                <p className="text-muted text-sm mt-1" dir="auto">{item.value}</p>
              </div>
            </div>
          ))}
          
          {/* Map Placeholder */}
          <div className="aspect-video bg-muted/5 border border-border rounded-lg flex items-center justify-center text-muted text-sm">
            {t("mapPlaceholder")}
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:col-span-2 bg-surface p-6 md:p-8 border border-border rounded-lg shadow-sm">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}