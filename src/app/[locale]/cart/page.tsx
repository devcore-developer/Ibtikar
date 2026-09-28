"use client";

import { useCart } from "@/lib/cart/CartContext";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, deliveryFee, total, isInitialized } = useCart();
  const t = useTranslations("Cart");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();

  if (!isInitialized) return <div className="h-96"></div>;

  if (items.length === 0) {
    return (
      <Container className="py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-muted/10 flex items-center justify-center text-muted mb-6">
          <ShoppingBag size={40} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t("emptyTitle")}</h1>
        <p className="text-muted mb-8">{t("emptySubtitle")}</p>
        <Link href={`/${locale}/spare-parts`}>
          <Button size="lg">{t("browseParts")}</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[{ name: tNav("home"), href: `/${locale}` }, { name: t("title") }]} />
      <h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 border border-border rounded-lg p-4 bg-surface">
              <div className="w-20 h-20 bg-muted/5 rounded-md flex items-center justify-center text-muted/30 shrink-0">
                <ShoppingBag size={24} />
              </div>
              <div className="flex-1">
                <Link href={`/${locale}/product/${item.slug}`} className="font-medium text-foreground hover:text-primary block mb-1">
                  {locale === "ar" ? item.nameAr : item.nameEn}
                </Link>
                <p className="text-sm text-primary font-semibold mb-2">{formatPrice(item.price, locale)}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border rounded-md">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 text-muted hover:text-primary">
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 text-muted hover:text-primary">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-muted hover:text-error transition-colors flex items-center gap-1 text-sm">
                    <Trash2 size={14} /> {t("remove")}
                  </button>
                </div>
              </div>
              <div className="text-end font-bold text-foreground hidden sm:block">
                {formatPrice(item.price * item.quantity, locale)}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-6 bg-surface sticky top-20">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t("summary")}</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{t("subtotal")}</span>
                <span className="font-medium">{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{t("delivery")}</span>
                <span className="font-medium">{formatPrice(deliveryFee, locale)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                <span>{t("total")}</span>
                <span className="text-primary">{formatPrice(total, locale)}</span>
              </div>
            </div>
            <Link href={`/${locale}/checkout`}>
              <Button size="lg" className="w-full">{t("checkout")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}