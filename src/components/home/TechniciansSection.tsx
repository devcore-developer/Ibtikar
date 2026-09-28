import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { technicians } from "@/data/home";
import { UserCircle, Phone } from "lucide-react";
import Link from "next/link";

export function TechniciansSection() {
  const t = useTranslations("Home");
  const locale = useLocale();

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <Heading level={2} className="mb-2">{t("techTitle")}</Heading>
            <p className="text-muted">{t("techSubtitle")}</p>
          </div>
          <Button variant="ghost" className="text-primary border border-border">
            {t("viewAllTechs")}
          </Button>
        </div>
        
        {/* تم تصحيح التجاوب هنا: عمود على الجوال، عمودين على التابلت، 4 على الديسكتوب */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {technicians.map((tech) => (
            <Card key={tech.id} className="text-center group h-full flex flex-col">
              <CardContent className="p-6 flex flex-col items-center flex-1">
                <div className="w-24 h-24 rounded-full bg-muted/10 flex items-center justify-center text-muted/40 mb-4 group-hover:bg-primary/10 group-hover:text-primary/50 transition-colors">
                  <UserCircle size={80} strokeWidth={1} />
                </div>
                <h3 className="font-semibold text-foreground text-lg">
                  {locale === "ar" ? tech.nameAr : tech.nameEn}
                </h3>
                <span className="text-accent text-sm font-medium mb-2">
                  {locale === "ar" ? tech.specialtyAr : tech.specialtyEn}
                </span>
                <p className="text-muted text-sm leading-relaxed line-clamp-3">
                  {locale === "ar" ? tech.descAr : tech.descEn}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-center">
                <Button variant="outline" size="sm" className="gap-2" disabled>
                  <Phone size={14} />
                  {t("techCall")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}