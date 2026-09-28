import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function EmptyState() {
  const t = useTranslations("SpareParts");

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/10 flex items-center justify-center text-muted mb-4">
        <PackageX size={32} />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{t("emptyTitle")}</h3>
      <p className="text-muted mb-6 max-w-sm">{t("emptySubtitle")}</p>
      <Link href="/spare-parts">
        <Button variant="outline">{t("emptyButton")}</Button>
      </Link>
    </div>
  );
}