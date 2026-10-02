"use client";

import Link from "next/link";
import { UserCircle, Phone } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function TechnicianCard({ technician }: { technician: any }) {
  const t = useTranslations("Technicians");
  const locale = useLocale();

  // دالة لفتح رقم الهاتف برمجياً لتجنب وضع <a> داخل <a>
  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (technician.phone) {
      window.location.href = `tel:${technician.phone}`;
    }
  };

  return (
    <Link href={`/${locale}/technicians/${technician.slug}`} className="block h-full hover:-translate-y-1 transition-transform duration-300">
      <Card className="text-center group h-full flex flex-col overflow-hidden">
        <CardContent className="p-6 flex flex-col items-center flex-1">
          {/* إظهار الصورة أو الأيقونة الافتراضية */}
          {technician.image ? (
            <img 
              src={technician.image} 
              alt={locale === "ar" ? technician.nameAr : technician.nameEn}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted/10 flex items-center justify-center text-muted/40 mb-4">
              <UserCircle size={80} strokeWidth={1} />
            </div>
          )}
          
          <h3 className="font-semibold text-foreground text-lg">
            {locale === "ar" ? technician.nameAr : technician.nameEn}
          </h3>
          <span className="text-accent text-sm font-medium mb-2">
            {locale === "ar" ? technician.specialtyAr : technician.specialtyEn}
          </span>
          
          {technician.experience && (
            <p className="text-muted text-sm">{technician.experience} {t("experience")}</p>
          )}
        </CardContent>
        
        {/* زر الاتصال - تم تغييره إلى Button لتجنب أخطاء HTML Nesting */}
        <div className="p-4 pt-0 flex justify-center w-full">
          {technician.phone ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2" 
              onClick={handleCall}
              type="button"
            >
              <Phone size={14} />
              {t("techCall")}
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full gap-2" disabled>
              <Phone size={14} />
              {t("techCall")}
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
}