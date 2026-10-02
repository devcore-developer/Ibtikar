"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { companyInfo, getWhatsAppLink } from "@/config/company";

export default function ContactClient() {
  const t = useTranslations("Contact");
  const tNav = useTranslations("Navbar");
  const locale = useLocale();

  const [formData, setFormData] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = t("errName");
    // تم إزالة التحقق من صيغة رقم الهاتف الكويتي، نتحقق فقط إن كان الحقل فارغاً
    if (!formData.phone.trim()) err.phone = locale === "ar" ? "يرجى إدخال رقم الهاتف." : "Please enter your phone number.";
    if (!formData.message.trim()) err.message = t("errMessage");
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    // محاكاة إرسال البيانات للسيرفر
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSuccess(true);
    setLoading(false);
  };

  const inputClass = "w-full h-11 px-4 bg-[#F6F8F9] border rounded-lg text-sm focus:outline-none focus:border-[#0B5C63] focus:bg-white transition-colors";

  const contactCards = [
    { icon: Phone, label: t("phoneLabel"), value: companyInfo.phone, href: `tel:${companyInfo.phone}` },
    { icon: MessageCircle, label: t("whatsappLabel"), value: companyInfo.phone, href: getWhatsAppLink() },
    { icon: Mail, label: t("emailLabel"), value: companyInfo.email, href: `mailto:${companyInfo.email}` },
    { icon: MapPin, label: t("location"), value: locale === "ar" ? companyInfo.addressAr : companyInfo.addressEn, href: companyInfo.mapsUrl || "#" },
  ];

  return (
    <Container className="py-12 md:py-16">
      <Breadcrumb items={[{ name: tNav("home"), href: `/${locale}` }, { name: t("title") }]} />
      
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#086B70] mb-3">{t("title")}</h1>
        <p className="text-[#68777D] max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      {/* تخطيط متوازن: معلومات التواصل + النموذج */}
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        
        {/* بطاقات التواصل (شبكة 2×2) */}
        <div className="grid grid-cols-2 gap-4">
          {contactCards.map((card, i) => (
            <a 
              key={i} 
              href={card.href} 
              target={card.icon === MessageCircle || card.icon === MapPin ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bg-white border border-[#E8ECEE] rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow h-full"
            >
              <div className="w-12 h-12 rounded-full bg-[#EAF5F5] flex items-center justify-center text-[#086B70] mb-4">
                <card.icon size={24} />
              </div>
              <h3 className="font-semibold text-[#172126] mb-1">{card.label}</h3>
              <p className="text-sm text-[#68777D]" dir="ltr">{card.value}</p>
            </a>
          ))}
        </div>

        {/* نموذج التواصل */}
        <div className="bg-white border border-[#E8ECEE] rounded-lg p-6 md:p-8 shadow-sm">
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-[#172126] mb-2">{t("successTitle")}</h2>
              <p className="text-[#68777D] mb-6">{t("successSubtitle")}</p>
              <Button onClick={() => setSuccess(false)} variant="outline">
                {locale === "ar" ? "إرسال رسالة أخرى" : "Send another message"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#172126]">{t("name")}</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`${inputClass} ${errors.name ? "border-red-500" : "border-[#E8ECEE]"}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#172126]">{t("phoneLabel")}</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`${inputClass} ${errors.phone ? "border-red-500" : "border-[#E8ECEE]"}`} placeholder="+965 1234 5678" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#172126]">{t("emailLabel")}</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`${inputClass} border-[#E8ECEE]`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#172126]">{t("subject")}</label>
                <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className={`${inputClass} border-[#E8ECEE]`} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-[#172126]">{t("message")}</label>
                <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={4} className={`w-full p-4 bg-[#F6F8F9] border rounded-lg text-sm focus:outline-none focus:border-[#0B5C63] focus:bg-white transition-colors ${errors.message ? "border-red-500" : "border-[#E8ECEE]"}`}></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? t("sending") : t("send")}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Container>
  );
}