"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useCart } from "@/lib/cart/CartContext";
import { formatCurrency } from "@/lib/format";
import { ShoppingCart, Package, Check } from "lucide-react";

export function ProductCard({ product }: { product: any }) {
  const t = useTranslations("SpareParts");
  const locale = useLocale();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      image: product.image || "",
      quantity: 1
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    // تمت إضافة كلاس product-card
    <Link 
      href={`/${locale}/product/${product.slug}`} 
      className="product-card relative flex flex-col group bg-white border border-[#E8ECEE]/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden rounded-lg"
    >
      {isAdded && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-20 transition-all duration-300 animate-bounce">
          <Check size={16} strokeWidth={3} />
          <span className="text-sm font-semibold">تمت الإضافة بنجاح</span>
        </div>
      )}

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
          type="button" 
          onClick={handleAddToCart}
          className={`w-full h-11 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm ${
            isAdded ? "bg-green-500 text-white" : "bg-[#086B70] text-white hover:bg-[#075F64]"
          }`}
        >
          {isAdded ? (
            <><Check size={18} strokeWidth={2} /> تمت الإضافة</>
          ) : (
            <><ShoppingCart size={18} strokeWidth={2} /> {t("addToCart")}</>
          )}
        </button>
      </div>
    </Link>
  );
}