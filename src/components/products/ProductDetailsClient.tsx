"use client";

import { Product, Category } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { useTranslations, useLocale } from "next-intl";
import { Minus, Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import Link from "next/link";

interface Props {
  product: Product;
  category?: Category;
}

export function ProductDetailsClient({ product, category }: Props) {
  const t = useTranslations("SpareParts");
  const locale = useLocale();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      quantity: quantity,
    });
    alert(locale === "ar" ? "تمت إضافة المنتج إلى السلة" : "Product added to cart");
  };

  return (
    <div>
      {category && (
        <Link href={`/${locale}/spare-parts/${category.slug}`} className="text-sm text-accent font-medium hover:underline mb-2 block">
          {locale === "ar" ? category.nameAr : category.nameEn}
        </Link>
      )}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
        {locale === "ar" ? product.nameAr : product.nameEn}
      </h1>
      
      <p className="text-3xl font-bold text-primary mb-6">
        {formatPrice(product.price, locale)}
      </p>

      <p className="text-muted leading-relaxed mb-6">
        {locale === "ar" ? product.descriptionAr : product.descriptionEn}
      </p>

      {/* Extra Data */}
      <div className="border-t border-b border-border py-4 mb-6 space-y-2">
        {product.partNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-muted">{t("partNumber")}</span>
            <span className="font-medium text-foreground">{product.partNumber}</span>
          </div>
        )}
        {product.brand && (
          <div className="flex justify-between text-sm">
            <span className="text-muted">{t("brand")}</span>
            <span className="font-medium text-foreground">{product.brand}</span>
          </div>
        )}
      </div>

      {/* Add to cart area */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center border border-border rounded-md">
          <button 
            className="p-3 text-muted hover:text-primary disabled:opacity-50" 
            disabled={quantity === 1}
            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button 
            className="p-3 text-muted hover:text-primary"
            onClick={() => setQuantity(prev => prev + 1)}
          >
            <Plus size={16} />
          </button>
        </div>
        <Button size="lg" className="flex-1" onClick={handleAddToCart}>
          {t("addToCart")}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-success">
        <Check size={16} />
        <span>{t("availability")}</span>
      </div>
    </div>
  );
}