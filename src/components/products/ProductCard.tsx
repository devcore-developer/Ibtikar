"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";
import { formatCurrency } from "@/lib/format";
import { ShoppingCart, Package } from "lucide-react";

export function ProductCard({ product }: { product: any }) {
  const t = useTranslations("SpareParts");
  const locale = useLocale();
  const { addItem } = useCart(); // استخدام addItem بدلاً من addToCart

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // تمرير البيانات بالشكل الذي يتوقعه CartItem بناءً على ملف types/cart.ts
    addItem({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      image: product.image || "",
      quantity: 1
    });
  };

  return (
    <Link 
      href={`/${locale}/product/${product.slug}`} 
      className="flex flex-col group bg-white border border-[#E8ECEE]/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden rounded-lg"
    >
      <div className="relative aspect-[4/3] bg-[#F6F8F9] flex items-center justify-center p-6 overflow-hidden">
        {product.image ? (
          <Image 
            src={product.image} 
            alt={locale === "ar" ? product.nameAr : product.nameEn}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <Package className="w-20 h-20 text-muted/20" strokeWidth={1} />
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-[#F6A623] uppercase tracking-wider mb-1 block">
          {locale === "ar" ? product.category?.nameAr : product.category?.nameEn}
        </span>
        <h3 className="text-sm font-bold text-[#075F64] mb-3 line-clamp-2 flex-1">
          {locale === "ar" ? product.nameAr : product.nameEn}
        </h3>
        <p className="text-lg font-extrabold text-[#086B70] mb-4">
          {formatCurrency(product.price, locale)}
        </p>
      </div>

      <div className="p-4 pt-0">
        <button 
          onClick={handleAddToCart}
          className="w-full h-11 bg-[#086B70] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#075F64] transition-colors duration-300 shadow-sm"
        >
          <ShoppingCart size={18} strokeWidth={2} />
          {t("addToCart")}
        </button>
      </div>
    </Link>
  );
}