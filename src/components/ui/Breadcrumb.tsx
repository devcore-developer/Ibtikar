import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface Crumb {
  name: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const locale = useLocale();
  const Chevron = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <nav className="flex items-center gap-2 text-sm text-muted mb-8">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.name}</span>
          )}
          {idx < items.length - 1 && <Chevron size={14} className="text-muted/50" />}
        </div>
      ))}
    </nav>
  );
}