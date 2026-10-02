import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { ContactForm } from "@/components/contact/ContactForm";
import { useTranslations, useLocale } from "next-intl";
import { companyInfo, getWhatsAppLink } from "@/config/company";
import { Phone, MessageCircle, Mail, MapPin, ArrowLeft } from "lucide-react";

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
    { icon: Phone, label: t("phoneLabel"), value: companyInfo.phone, href: `tel:${companyInfo.phone}` },
    { icon: MessageCircle, label: t("whatsappLabel"), value: companyInfo.phone, href: getWhatsAppLink() },
    { icon: Mail, label: t("emailLabel"), value: companyInfo.email, href: `mailto:${companyInfo.email}` },
    { icon: MapPin, label: t("location"), value: locale === "ar" ? companyInfo.addressAr : companyInfo.addressEn, href: companyInfo.mapsUrl || "#" },
  ];

  return (
    <Container className="py-12 md:py-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <Heading level={1} className="text-3xl md:text-4xl mb-3 text-[#086B70]">{t("title")}</Heading>
        <p className="text-[#68777D] max-w-xl mx-auto mb-4">{t("subtitle")}</p>
        <div className="w-20 h-1 bg-[#086B70] mx-auto rounded-full"></div>
      </div>

      {/* Contact Form - Full Width */}
      <div className="max-w-4xl mx-auto bg-white border border-[#E8ECEE] rounded-xl shadow-sm p-6 md:p-10 mb-20">
        <ContactForm />
      </div>

      {/* Contact Methods Section */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#086B70] mb-2">
          {locale === "ar" ? "وسائل التواصل" : "Contact Methods"}
        </h2>
        <p className="text-[#68777D]">
          {locale === "ar" ? "يمكنك التواصل معنا من خلال القنوات التالية" : "You can reach us through the following channels"}
        </p>
      </div>

      {/* Contact Cards 2x2 Grid */}
      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {contactCards.map((c, i) => (
          <a 
            key={i} 
            href={c.href} 
            target={c.icon === MessageCircle || c.icon === MapPin ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-white border border-[#E8ECEE] rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            {/* Icon (Right side in RTL) */}
            <div className="w-14 h-14 rounded-full bg-[#EAF5F5] flex items-center justify-center text-[#086B70] shrink-0">
              <c.icon size={24} />
            </div>
            {/* Text */}
            <div className="flex-1">
              <h3 className="font-semibold text-[#172126] mb-1">{c.label}</h3>
              <p className="text-sm text-[#68777D]" dir="ltr">{c.value}</p>
            </div>
            {/* Arrow (Left side in RTL) */}
            <ArrowLeft className="text-[#086B70] opacity-30" size={20} />
          </a>
        ))}
      </div>
    </Container>
  );
}