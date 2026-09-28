import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

export function MaintenanceSection() {
  const t = useTranslations("Home");
  const services = t.raw("maintenanceList") as string[];

  return (
    <section className="py-16 md:py-24 bg-secondary text-white">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Heading level={2} className="text-white mb-4">{t("maintenanceTitle")}</Heading>
            <p className="text-white/70 mb-8 text-lg">{t("maintenanceSubtitle")}</p>
            <Button variant="accent" size="lg">{t("requestMaintenance")}</Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Check size={16} />
                </div>
                <span className="font-medium text-sm md:text-base">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}