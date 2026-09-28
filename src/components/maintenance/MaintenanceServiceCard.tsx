import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/Card";
import { MaintenanceService } from "@/types/maintenance";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function MaintenanceServiceCard({ service }: { service: MaintenanceService }) {
  const locale = useLocale();
  const t = useTranslations("Maintenance");
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <Link href={`/${locale}/maintenance/${service.slug}`}>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            <service.icon size={28} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              {locale === "ar" ? service.nameAr : service.nameEn}
            </h3>
            <p className="text-sm text-muted line-clamp-2">
              {locale === "ar" ? service.shortDescriptionAr : service.shortDescriptionEn}
            </p>
          </div>
          <div className="text-muted group-hover:text-accent transition-colors shrink-0">
            <Arrow size={20} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}