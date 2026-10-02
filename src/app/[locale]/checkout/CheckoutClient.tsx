"use client";

import { useCart } from "@/lib/cart/CartContext";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatPrice } from "@/lib/format";
import { DEFAULT_DELIVERY_FEES as DELIVERY_FEES } from "@/config/constants";
import { PaymentMethod } from "@/types/order";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Banknote, Wallet, Copy, Check, Upload, Loader2 } from "lucide-react";
import { createOrder, uploadImageAction } from "@/app/admin/actions";

export default function CheckoutClient({ settings }: { settings: Record<string, string> }) {
  const { items, subtotal, clearCart, isInitialized } = useCart();
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
  const [serverError, setServerError] = useState("");

  // Payment Proof State
  const [proofUrl, setProofUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  useEffect(() => {
    if (isInitialized && items.length === 0) {
      router.push(`/${locale}/cart`);
    }
  }, [isInitialized, items.length, locale, router]);

  if (isInitialized && items.length === 0) {
    return null;
  }

  const deliveryFee = DELIVERY_FEES[formData.area as "INSIDE" | "OUTSIDE"];
  const finalTotal = subtotal + deliveryFee;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = t("errName");
    if (!formData.phone.match(/^(\+?965|0)?(5[0-9]|6[0-9]|9[0-9])\d{6}$/)) err.phone = t("errPhone");
    if (!formData.address.trim()) err.address = t("errAddress");
    
    // Validate proof for non-COD
    if (paymentMethod !== "CASH_ON_DELIVERY" && !proofUrl) {
      err.proof = locale === "ar" ? "يرجى رفع إثبات التحويل." : "Please upload payment proof.";
    }
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setServerError("");
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      const url = await uploadImageAction(formDataObj);
      setProofUrl(url);
    } catch (err) {
      setServerError(locale === "ar" ? "فشل رفع الصورة." : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setServerError("");
    
    const formDataObj = new FormData();
    formDataObj.append("customerName", formData.name);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("area", formData.area);
    formDataObj.append("address", formData.address);
    formDataObj.append("notes", formData.notes);
    formDataObj.append("paymentMethod", paymentMethod);
    formDataObj.append("paymentProofUrl", proofUrl);
    formDataObj.append("items", JSON.stringify(items));
    formDataObj.append("subtotal", subtotal.toString());
    formDataObj.append("deliveryFee", deliveryFee.toString());
    formDataObj.append("total", finalTotal.toString());

    const result = await createOrder(formDataObj);
    
    if (result.success) {
      clearCart();
      router.push(`/${locale}/order-success?orderId=${result.orderId}`);
    } else {
      setServerError(result.error || "فشل إنشاء الطلب، يرجى المحاولة مرة أخرى.");
      setLoading(false);
    }
  };

  const inputClass = "w-full h-11 px-4 bg-surface border rounded-md text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[{ name: tNav("home"), href: `/${locale}` }, { name: tCart("title"), href: `/${locale}/cart` }, { name: t("title") }]} />
      <h1 className="text-3xl font-bold text-foreground mb-8">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info & Delivery */}
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
            </div>
          </div>

          {/* Dynamic Payment Instructions */}
          {paymentMethod === "WAMD" && (
            <div className="border border-border rounded-lg p-6 bg-surface space-y-4">
              <h3 className="font-bold text-lg">{locale === "ar" ? "الدفع عبر وامض" : "Pay with WAMD"}</h3>
              <p className="text-sm text-muted">{locale === "ar" ? "قم بتحويل قيمة الطلب عبر خدمة وامض باستخدام رقم الموبايل التالي:" : "Transfer the order amount using WAMD to the following mobile number:"}</p>
              <div className="flex justify-between items-center bg-muted/10 p-3 rounded-md">
                <span className="font-mono font-bold" dir="ltr">{settings.WAMD_MOBILE || "+96565696342"}</span>
                <Button type="button" variant="secondary" size="sm" onClick={() => copyToClipboard(settings.WAMD_MOBILE, "wamd")}>
                  {copiedField === "wamd" ? <Check size={14} /> : <Copy size={14} />}
                </Button>
              </div>
            </div>
          )}

          {paymentMethod === "BANK_TRANSFER" && (
            <div className="border border-border rounded-lg p-6 bg-surface space-y-4">
              <h3 className="font-bold text-lg">{locale === "ar" ? "التحويل البنكي" : "Bank Transfer"}</h3>
              <p className="text-sm text-muted">{locale === "ar" ? "قم بالتحويل باستخدام تطبيق البنك الخاص بك:" : "Transfer the amount using your bank's mobile application:"}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>{locale === "ar" ? "البنك:" : "Bank:"}</span><span className="font-medium">{settings.BANK_NAME || "N/A"}</span></div>
                <div className="flex justify-between"><span>{locale === "ar" ? "اسم الحساب:" : "Account Holder:"}</span><span className="font-medium">{settings.BANK_HOLDER || "N/A"}</span></div>
                <div className="flex justify-between items-center bg-muted/10 p-3 rounded-md">
                  <span className="font-mono font-bold" dir="ltr">{settings.BANK_IBAN || "KWXXXX"}</span>
                  <Button type="button" variant="secondary" size="sm" onClick={() => copyToClipboard(settings.BANK_IBAN, "iban")}>
                    {copiedField === "iban" ? <Check size={14} /> : <Copy size={14} />}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Proof Upload (For WAMD & Bank) */}
          {paymentMethod !== "CASH_ON_DELIVERY" && (
            <div className="border border-border rounded-lg p-6 bg-surface">
              <h3 className="font-bold text-lg mb-4">{locale === "ar" ? "رفع إثبات التحويل" : "Upload Payment Proof"}</h3>
              <input type="file" accept="image/*" onChange={handleProofUpload} className="hidden" id="proofUpload" disabled={isUploading} />
              {proofUrl ? (
                <div className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden border">
                  <img src={proofUrl} alt="Proof" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setProofUrl("")} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs">X</button>
                </div>
              ) : (
                <label htmlFor="proofUpload" className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/5 text-muted">
                  {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
                  <span className="mt-2 text-sm">{locale === "ar" ? "رفع صورة الإثبات" : "Upload Screenshot"}</span>
                </label>
              )}
              {errors.proof && <p className="text-red-500 text-xs mt-2">{errors.proof}</p>}
            </div>
          )}
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
            
            {serverError && <p className="text-error text-sm mt-4 text-center">{serverError}</p>}
            
            <Button type="submit" size="lg" className="w-full mt-6" disabled={loading || isUploading}>
              {loading ? t("loading") : t("placeOrder")}
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
}