"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { ContactMessage } from "@/types/contact";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = t("errName");
    if (!formData.phone.match(/^(\+?965|0)?(5[0-9]|6[0-9]|9[0-9])\d{6}$/)) err.phone = t("errPhone");
    if (!formData.message.trim()) err.message = t("errMessage");
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const msg: ContactMessage = {
      id: `CM-${Date.now().toString(36)}`,
      ...formData,
      status: "NEW",
      createdAt: new Date().toISOString()
    };
    console.log("Contact Message Saved:", msg);
    
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center py-10 bg-surface border border-border rounded-lg">
        <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{t("successTitle")}</h3>
        <p className="text-muted">{t("successSubtitle")}</p>
      </div>
    );
  }

  const inputClass = "w-full h-11 px-4 bg-surface border rounded-md text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("email")}</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`${inputClass} border-border`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("subject")}</label>
          <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className={`${inputClass} border-border`} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t("message")}</label>
        <textarea rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className={`${inputClass} h-auto py-2 ${errors.message ? "border-error" : "border-border"}`}></textarea>
        {errors.message && <p className="text-error text-xs mt-1">{errors.message}</p>}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? t("sending") : t("send")}
      </Button>
    </form>
  );
}