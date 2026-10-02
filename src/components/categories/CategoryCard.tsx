import { Card, CardContent } from "@/components/ui/Card";
import { Wrench } from "lucide-react"; // أيقونة افتراضية
import Link from "next/link";
import { useLocale } from "next-intl";

export function CategoryCard({ category, count }: { category: any, count?: number }) {
  const locale = useLocale();
  const Icon = category.icon || Wrench; // استخدام أيقونة افتراضية إذا لم توجد

  return (
    <Link href={`/${locale}/spare-parts/${category.slug}`}>
      <Card className="group hover:shadow-lg transition-shadow h-full">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            <Icon size={28} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              {locale === "ar" ? category.nameAr : category.nameEn}
            </h3>
            <p className="text-sm text-muted">
              {count || 0} {locale === "ar" ? "منتج" : "items"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}