import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Wrench, Headphones, Truck, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Wrench, Headphones, Truck, MousePointerClick];

export function WhyChooseUs() {
  const t = useTranslations("Home");
  const keys = ["experience", "service", "delivery", "ease"];

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="text-center mb-12">
          <Heading level={2} className="mb-2">{t("whyUsTitle")}</Heading>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {keys.map((key, idx) => {
            const Icon = icons[idx];
            return (
              <div key={key} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  {t(`whyUs.${key}.title`)}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {t(`whyUs.${key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}