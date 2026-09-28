import Link from "next/link";
import { useLocale } from "next-intl";
import { Card, CardContent } from "@/components/ui/Card";
import { Category } from "@/types/product";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function CategoryCard({ category, count }: { category: Category; count?: number }) {
  const locale = useLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <Link href={`/${locale}/spare-parts/${category.slug}`}>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            <category.icon size={28} strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">
              {locale === "ar" ? category.nameAr : category.nameEn}
            </h3>
            <p className="text-sm text-muted line-clamp-2">
              {locale === "ar" ? category.descriptionAr : category.descriptionEn}
            </p>
            {count !== undefined && (
              <span className="text-xs text-muted/80 block mt-2">{count} {locale === "ar" ? "منتجات" : "items"}</span>
            )}
          </div>
          <div className="text-muted group-hover:text-accent transition-colors shrink-0">
            <Arrow size={20} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}