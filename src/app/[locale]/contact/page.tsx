import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ContactForm } from "@/components/contact/ContactForm";
import { useTranslations, useLocale } from "next-intl";
import { companyInfo, getWhatsAppLink } from "@/config/company";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "تواصل معنا | ابتكار الخليج" : "Contact Us | Ibtikar Al Khaleej",
  };
}

export default function ContactPage() {
  const t = useTranslations("Contact");
  const locale = useLocale();

  const contactCards = [
    { icon: Phone, label: t("phone"), value: companyInfo.phone, href: `tel:${companyInfo.phone}` },
    { icon: MessageCircle, label: t("whatsapp"), value: companyInfo.phone, href: getWhatsAppLink() },
    { icon: Mail, label: t("email"), value: companyInfo.email, href: `mailto:${companyInfo.email}` },
    { icon: MapPin, label: t("address"), value: locale === "ar" ? companyInfo.addressAr : companyInfo.addressEn, href: companyInfo.mapsUrl || "#" },
  ];

  return (
    <Container className="py-12 md:py-16">
      <div className="text-center mb-12">
        <Heading level={1} className="mb-3">{t("title")}</Heading>
        <p className="text-muted">{t("subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          {contactCards.map((c, i) => (
            <a 
              key={i} 
              href={c.href} 
              target={c.icon === MessageCircle || c.icon === MapPin ? "_blank" : undefined}
              className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <c.icon size={20} />
              </div>
              <div>
                <p className="text-xs text-muted">{c.label}</p>
                <p className="font-medium" dir="ltr">{c.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-surface border border-border rounded-lg p-6">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}