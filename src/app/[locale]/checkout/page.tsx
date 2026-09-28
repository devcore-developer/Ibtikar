"use client";

import { useCart } from "@/lib/cart/CartContext";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatPrice } from "@/lib/format";
import { DEFAULT_DELIVERY_FEES as DELIVERY_FEES } from "@/config/constants";
import { PaymentMethod, Order } from "@/types/order";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, CreditCard, Banknote, Wallet } from "lucide-react";

export default function CheckoutPage() {
  const { items, subtotal, total, clearCart, isInitialized } = useCart();
  const t = useTranslations("Checkout");
  const tCart = useTranslations("Cart");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "", phone: "", area: "INSIDE", address: "", notes: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH_ON_DELIVERY");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (isInitialized && items.length === 0) {
    router.push(`/${locale}/cart`);
    return null;
  }

  const deliveryFee = DELIVERY_FEES[formData.area as "INSIDE" | "OUTSIDE"];
  const finalTotal = subtotal + deliveryFee;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = t("errName");
    if (!formData.phone.match(/^(\+?965|0)?(5[0-9]|6[0-9]|9[0-9])\d{6}$/)) err.phone = t("errPhone");
    if (!formData.address.trim()) err.address = t("errAddress");
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    // Simulate Order Creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderId = `IK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
    
    const order: Order = {
      id: orderId,
      customerName: formData.name,
      phone: formData.phone,
      area: formData.area as "INSIDE" | "OUTSIDE",
      address: formData.address,
      notes: formData.notes,
      items: items.map(i => ({ ...i, total: i.price * i.quantity })),
      subtotal,
      deliveryFee,
      total: finalTotal,
      paymentMethod,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    // Store in temp local storage for success page
    localStorage.setItem("ik_last_order", JSON.stringify(order));
    clearCart();
    router.push(`/${locale}/order-success`);
  };

  const inputClass = "w-full h-11 px-4 bg-surface border rounded-md text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[{ name: tNav("home"), href: `/${locale}` }, { name: tCart("title"), href: `/${locale}/cart` }, { name: t("title") }]} />
      <h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="border border-border rounded-lg p-6 bg-surface">
            <h2 className="text-xl font-semibold mb-4">{t("customerInfo")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("name")}</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`${inputClass} ${errors.name ? "border-error" : "border-border"}`} />
                {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("phone")}</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`${inputClass} ${errors.phone ? "border-error" : "border-border"}`} />
                {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">{t("address")}</label>
              <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`${inputClass} ${errors.address ? "border-error" : "border-border"}`} />
              {errors.address && <p className="text-error text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">{t("notes")}</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} className={`${inputClass} py-2`}></textarea>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="border border-border rounded-lg p-6 bg-surface">
            <h2 className="text-xl font-semibold mb-4">{t("deliveryArea")}</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className={`flex items-center justify-between border p-4 rounded-md cursor-pointer transition-colors ${formData.area === "INSIDE" ? "border-primary bg-primary/5" : "border-border"}`}>
                <span className="font-medium">{t("insideJahra")}</span>
                <span className="text-sm font-bold text-primary">{formatPrice(DELIVERY_FEES.INSIDE, locale)}</span>
                <input type="radio" name="area" value="INSIDE" checked={formData.area === "INSIDE"} onChange={e => setFormData({...formData, area: e.target.value})} className="hidden" />
              </label>
              <label className={`flex items-center justify-between border p-4 rounded-md cursor-pointer transition-colors ${formData.area === "OUTSIDE" ? "border-primary bg-primary/5" : "border-border"}`}>
                <span className="font-medium">{t("outsideJahra")}</span>
                <span className="text-sm font-bold text-primary">{formatPrice(DELIVERY_FEES.OUTSIDE, locale)}</span>
                <input type="radio" name="area" value="OUTSIDE" checked={formData.area === "OUTSIDE"} onChange={e => setFormData({...formData, area: e.target.value})} className="hidden" />
              </label>
            </div>

            <h2 className="text-xl font-semibold mb-4">{t("paymentMethod")}</h2>
            <div className="space-y-3">
              {[
                { id: "CASH_ON_DELIVERY", icon: Banknote },
                { id: "WAMD", icon: Wallet },
                { id: "BANK_TRANSFER", icon: CreditCard }
              ].map(({ id, icon: Icon }) => (
                <label key={id} className={`flex items-center gap-3 border p-4 rounded-md cursor-pointer transition-colors ${paymentMethod === id ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === id ? "bg-primary text-white" : "bg-muted/10 text-muted"}`}>
                    <Icon size={20} />
                  </div>
                  <span className="font-medium flex-1">{t(`pay_${id}`)}</span>
                  <input type="radio" name="payment" checked={paymentMethod === id} onChange={() => setPaymentMethod(id as PaymentMethod)} className="hidden" />
                </label>
              ))}
              {paymentMethod === "BANK_TRANSFER" && (
                <div className="text-xs text-muted bg-muted/10 p-3 rounded-md mt-2">
                  {t("bankNote")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-6 bg-surface sticky top-20">
            <h2 className="text-xl font-semibold mb-4">{t("review")}</h2>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pe-2">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted">{locale === "ar" ? item.nameAr : item.nameEn} <span className="text-muted/50">({item.quantity})</span></span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity, locale)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">{tCart("subtotal")}</span>
                <span className="font-medium">{formatPrice(subtotal, locale)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{tCart("delivery")}</span>
                <span className="font-medium">{formatPrice(deliveryFee, locale)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border mt-2">
                <span>{tCart("total")}</span>
                <span className="text-primary">{formatPrice(finalTotal, locale)}</span>
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full mt-6" disabled={loading}>
              {loading ? t("loading") : t("placeOrder")}
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
}