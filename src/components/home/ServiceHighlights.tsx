import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Package, Wrench, Truck, ShieldCheck } from "lucide-react";

// تعريف محلي للعناصر
const highlights = [
  { id: "parts", icon: Package },
  { id: "maintenance", icon: Wrench },
  { id: "delivery", icon: Truck },
  { id: "trusted", icon: ShieldCheck }
];

export function ServiceHighlights() {
  const t = useTranslations("Home");

  return (
    <section className="py-10 bg-background border-b border-border">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item) => (
            <Card key={item.id} className="border-none shadow-sm bg-surface flex flex-col items-center text-center p-4 h-full">
              <CardContent className="p-0 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                  <item.icon size={20} />
                </div>
                <h3 className="font-semibold text-foreground text-sm md:text-base">
                  {t(`highlights.${item.id}.title`)}
                </h3>
                <p className="text-xs md:text-sm text-muted leading-tight">
                  {t(`highlights.${item.id}.desc`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}