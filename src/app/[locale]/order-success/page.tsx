"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { Order } from "@/types/order";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

export default function OrderSuccessPage() {
  const t = useTranslations("Success");
  const tCart = useTranslations("Cart");
  const locale = useLocale();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("ik_last_order");
    if (stored) {
      setOrder(JSON.parse(stored));
      localStorage.removeItem("ik_last_order");
    }
  }, []);

  if (!order) return null;

  return (
    <Container className="py-16 md:py-24 text-center max-w-2xl">
      <div className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center text-success mb-6">
        <CheckCircle size={48} />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">{t("title")}</h1>
      <p className="text-muted mb-2">{t("subtitle")}</p>
      <p className="text-primary font-bold text-xl mb-8">{order.id}</p>

      <div className="border border-border rounded-lg p-6 bg-surface text-start mb-8">
        <div className="flex justify-between mb-4 pb-4 border-b border-border">
          <span className="text-muted">{tCart("total")}</span>
          <span className="font-bold text-primary">{formatPrice(order.total, locale)}</span>
        </div>
        <div className="flex justify-between mb-4 pb-4 border-b border-border">
          <span className="text-muted">{t("paymentMethod")}</span>
          <span className="font-medium">{t(`pay_${order.paymentMethod}`)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">{t("phone")}</span>
          <span className="font-medium" dir="ltr">{order.phone}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href={`/${locale}/spare-parts`}>
          <Button size="lg" variant="outline" className="gap-2">
            <ShoppingBag size={18} /> {t("continueShopping")}
          </Button>
        </Link>
        <Link href={`/${locale}`}>
          <Button size="lg" className="gap-2">
            <Home size={18} /> {t("backHome")}
          </Button>
        </Link>
      </div>
    </Container>
  );
}