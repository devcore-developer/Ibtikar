"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";
import { createContactMessage } from "@/app/admin/actions";
export function ContactForm() {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = t("errName");
    
    // تم إزالة التحقق من صيغة رقم الهاتف الكويتي، نتحقق فقط إن كان الحقل فارغاً
    if (!formData.phone.trim()) {
      err.phone = "يرجى إدخال رقم الهاتف."; 
    }
    
    if (!formData.message.trim()) err.message = t("errMessage");
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    
    // إرسال البيانات للسيرفر لحفظها
    const formDataObj = new FormData(e.currentTarget as HTMLFormElement);
    await createContactMessage(formDataObj);
    
    setSuccess(true);
    setLoading(false);
  };

  const inputClass = "w-full h-12 px-4 bg-[#F6F8F9] border rounded-lg text-sm focus:outline-none focus:border-[#0B5C63] focus:bg-white transition-colors";

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <Mail size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-[#172126] mb-2">{t("successTitle")}</h2>
        <p className="text-[#68777D] mb-6">{t("successSubtitle")}</p>
        <Button onClick={() => setSuccess(false)} variant="outline">
          {t("send")}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* الصف الأول: الاسم ورقم الهاتف */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#172126]">{t("name")}</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            className={`${inputClass} ${errors.name ? "border-red-500" : "border-[#E8ECEE]"}`} 
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[#172126]">{t("phoneLabel")}</label>
          <input 
            type="tel" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
            className={`${inputClass} ${errors.phone ? "border-red-500" : "border-[#E8ECEE]"}`} 
            placeholder="+965 1234 5678" 
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* الصف الثاني: الإيميل والموضوع */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-[#172126]">{t("emailLabel")}</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            className={`${inputClass} border-[#E8ECEE]`} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-[#172126]">{t("subject")}</label>
          <input 
            type="text" 
            value={formData.subject} 
            onChange={e => setFormData({...formData, subject: e.target.value})} 
            className={`${inputClass} border-[#E8ECEE]`} 
          />
        </div>
      </div>

      {/* الرسالة (عرض كامل) */}
      <div>
        <label className="block text-sm font-medium mb-2 text-[#172126]">{t("message")}</label>
        <textarea 
          value={formData.message} 
          onChange={e => setFormData({...formData, message: e.target.value})} 
          rows={5} 
          className={`w-full p-4 bg-[#F6F8F9] border rounded-lg text-sm focus:outline-none focus:border-[#0B5C63] focus:bg-white transition-colors ${errors.message ? "border-red-500" : "border-[#E8ECEE]"}`}
        ></textarea>
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>
      
      {/* زر الإرسال (عرض كامل) */}
      <div className="flex justify-center">
        <Button type="submit" size="lg" className="w-full sm:w-auto px-10" disabled={loading}>
          {loading ? t("sending") : t("send")}
        </Button>
      </div>
    </form>
  );
}