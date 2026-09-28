import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";

export function ContactCTA() {
  const t = useTranslations("Home");

  return (
    <section className="py-16 md:py-24 bg-background border-t border-border">
      <Container>
        <div className="bg-primary text-white rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("ctaTitle")}</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">{t("ctaSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg">{t("ctaContact")}</Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 gap-2">
              <MessageCircle size={18} />
              {t("ctaWhatsapp")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}