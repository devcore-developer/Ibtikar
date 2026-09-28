"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { useLocale, useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations("SpareParts");
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      quantity: 1,
    });
    alert(locale === "ar" ? "تمت إضافة المنتج إلى السلة" : "Product added to cart");
  };

  return (
    <Card className="flex flex-col group h-full">
      <Link href={`/${locale}/product/${product.slug}`} className="block">
        <div className="aspect-square bg-muted/5 flex items-center justify-center border-b border-border p-6 overflow-hidden">
          <Package size={64} className="text-muted/30 group-hover:text-primary/50 transition-colors" strokeWidth={1} />
        </div>
      </Link>
      <CardContent className="p-4 flex-1 flex flex-col">
        <span className="text-xs font-medium text-accent uppercase tracking-wider mb-1 block">
          {locale === "ar" ? product.shortDescriptionAr : product.shortDescriptionEn}
        </span>
        <Link href={`/${locale}/product/${product.slug}`}>
          <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-2 mb-2 hover:text-primary transition-colors">
            {locale === "ar" ? product.nameAr : product.nameEn}
          </h3>
        </Link>
        <p className="text-lg font-bold text-primary mt-auto mb-4">
          {formatPrice(product.price, locale)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="primary" size="sm" className="w-full" onClick={handleAddToCart}>
          {t("addToCart")}
        </Button>
      </CardFooter>
    </Card>
  );
}