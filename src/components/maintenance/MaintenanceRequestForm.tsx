"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { MaintenanceRequest } from "@/types/maintenance";
import { maintenanceServices } from "@/data/maintenance-services";

export function MaintenanceRequestForm() {
  const t = useTranslations("Maintenance");
  const locale = useLocale();
  const [formData, setFormData] = useState({
    name: "", phone: "", area: "", address: "", applianceType: "", serviceId: "", 
    brand: "", model: "", problemDescription: "", preferredContactTime: "", notes: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState("");

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = t("errName");
    if (!formData.phone.match(/^(\+?965|0)?(5[0-9]|6[0-9]|9[0-9])\d{6}$/)) err.phone = t("errPhone");
    if (!formData.address.trim()) err.address = t("errAddress");
    if (!formData.applianceType.trim()) err.applianceType = t("errAppliance");
    if (!formData.serviceId) err.serviceId = t("errService");
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const id = `MR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
    setRequestId(id);
    
    const req: MaintenanceRequest = {
      id,
      customerName: formData.name,
      phone: formData.phone,
      area: formData.area || "N/A",
      address: formData.address,
      applianceType: formData.applianceType,
      serviceId: formData.serviceId,
      brand: formData.brand,
      model: formData.model,
      problemDescription: formData.problemDescription,
      preferredContactTime: formData.preferredContactTime,
      notes: formData.notes,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };
    console.log("Maintenance Request Saved:", req);
    
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="text-center py-10 bg-surface border border-border rounded-lg">
        <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{t("requestSuccessTitle")}</h3>
        <p className="text-muted mb-4">{t("requestSuccessSubtitle")}</p>
        <p className="text-primary font-bold text-lg mb-6">{t("requestNumber")}: {requestId}</p>
        <Button onClick={() => window.location.reload()} variant="outline">{t("newRequest")}</Button>
      </div>
    );
  }

  const inputClass = "w-full h-11 px-4 bg-surface border rounded-md text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("name")} *</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`${inputClass} ${errors.name ? "border-error" : "border-border"}`} />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("phone")} *</label>
          <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`${inputClass} ${errors.phone ? "border-error" : "border-border"}`} />
          {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">{t("address")} *</label>
        <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`${inputClass} ${errors.address ? "border-error" : "border-border"}`} />
        {errors.address && <p className="text-error text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("applianceType")} *</label>
          <input type="text" value={formData.applianceType} onChange={e => setFormData({...formData, applianceType: e.target.value})} className={`${inputClass} ${errors.applianceType ? "border-error" : "border-border"}`} />
          {errors.applianceType && <p className="text-error text-xs mt-1">{errors.applianceType}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("serviceRequired")} *</label>
          <select value={formData.serviceId} onChange={e => setFormData({...formData, serviceId: e.target.value})} className={`${inputClass} ${errors.serviceId ? "border-error" : "border-border"}`}>
            <option value="">{t("selectService")}</option>
            {maintenanceServices.map(s => (
              <option key={s.id} value={s.id}>{locale === "ar" ? s.nameAr : s.nameEn}</option>
            ))}
          </select>
          {errors.serviceId && <p className="text-error text-xs mt-1">{errors.serviceId}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("brand")}</label>
          <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className={`${inputClass} border-border`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("model")}</label>
          <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className={`${inputClass} border-border`} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("problemDescription")}</label>
        <textarea rows={4} value={formData.problemDescription} onChange={e => setFormData({...formData, problemDescription: e.target.value})} className={`${inputClass} h-auto py-2 border-border`}></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("preferredTime")}</label>
        <input type="text" value={formData.preferredContactTime} onChange={e => setFormData({...formData, preferredContactTime: e.target.value})} className={`${inputClass} border-border`} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("notes")}</label>
        <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className={`${inputClass} h-auto py-2 border-border`}></textarea>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? t("sending") : t("submitRequest")}
      </Button>
    </form>
  );
}