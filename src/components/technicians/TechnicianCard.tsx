import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Technician } from "@/types/technician";
import { UserCircle } from "lucide-react";

export function TechnicianCard({ technician }: { technician: Technician }) {
  const locale = useLocale();
  const t = useTranslations("Technicians");

  return (
    <Card className="text-center group h-full flex flex-col">
      <CardContent className="p-6 flex flex-col items-center flex-1">
        <div className="w-24 h-24 rounded-full bg-muted/10 flex items-center justify-center text-muted/40 mb-4 group-hover:bg-primary/10 group-hover:text-primary/50 transition-colors">
          <UserCircle size={80} strokeWidth={1} />
        </div>
        <h3 className="font-semibold text-foreground text-lg">
          {locale === "ar" ? technician.nameAr : technician.nameEn}
        </h3>
        <span className="text-accent text-sm font-medium mb-2">
          {locale === "ar" ? technician.specialtyAr : technician.specialtyEn}
        </span>
        <p className="text-muted text-sm leading-relaxed line-clamp-3">
          {locale === "ar" ? technician.bioAr : technician.bioEn}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-center">
        <Link href={`/${locale}/technicians/${technician.slug}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">{t("viewProfile")}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}