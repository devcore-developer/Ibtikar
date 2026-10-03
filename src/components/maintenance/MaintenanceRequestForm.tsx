"use client";

import { useState, useEffect, useActionState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { maintenanceServices } from "@/data/maintenance-services";
import { createMaintenanceRequest } from "@/app/admin/actions";

export function MaintenanceRequestForm() {
  const t = useTranslations("Maintenance");
  const locale = useLocale();
  
  // useActionState handles the server action and pending state
  const [state, formAction, pending] = useActionState(createMaintenanceRequest, { success: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // Watch for successful server response
  useEffect(() => {
    if (state?.success) {
      setSuccess(true);
    }
  }, [state]);

  const validate = (formData: FormData) => {
    const err: Record<string, string> = {};
    if (!String(formData.get("name") || "").trim()) err.name = t("errName");
    if (!String(formData.get("phone") || "").trim()) err.phone = "يرجى إدخال رقم الهاتف.";
    if (!String(formData.get("address") || "").trim()) err.address = t("errAddress");
    if (!String(formData.get("applianceType") || "").trim()) err.applianceType = t("errAppliance");
    if (!String(formData.get("serviceId") || "").trim()) err.serviceId = t("errService");
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    if (!validate(formData)) {
      e.preventDefault(); // Stop submission if validation fails
    }
  };

  if (success) {
    return (
      <div className="text-center py-10 bg-surface border border-border rounded-lg">
        <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
          <CheckCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">{t("requestSuccessTitle")}</h3>
        <p className="text-muted mb-4">{t("requestSuccessSubtitle")}</p>
        <Button onClick={() => window.location.reload()} variant="outline">{t("newRequest")}</Button>
      </div>
    );
  }

  const inputClass = "w-full h-11 px-4 bg-surface border rounded-md text-sm focus:outline-none focus:border-primary transition-colors";

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("name")} *</label>
          <input name="name" type="text" className={`${inputClass} ${errors.name ? "border-error" : "border-border"}`} />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("phone")} *</label>
          <input name="phone" type="tel" className={`${inputClass} ${errors.phone ? "border-error" : "border-border"}`} />
          {errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">{t("address")} *</label>
        <input name="address" type="text" className={`${inputClass} ${errors.address ? "border-error" : "border-border"}`} />
        {errors.address && <p className="text-error text-xs mt-1">{errors.address}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("applianceType")} *</label>
          <input name="applianceType" type="text" className={`${inputClass} ${errors.applianceType ? "border-error" : "border-border"}`} />
          {errors.applianceType && <p className="text-error text-xs mt-1">{errors.applianceType}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("serviceRequired")} *</label>
          <select name="serviceId" className={`${inputClass} ${errors.serviceId ? "border-error" : "border-border"}`}>
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
          <input name="brand" type="text" className={`${inputClass} border-border`} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t("model")}</label>
          <input name="model" type="text" className={`${inputClass} border-border`} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("problemDescription")}</label>
        <textarea name="problemDescription" rows={4} className={`${inputClass} h-auto py-2 border-border`}></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("preferredTime")}</label>
        <input name="preferredTime" type="text" className={`${inputClass} border-border`} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t("notes")}</label>
        <textarea name="notes" rows={2} className={`${inputClass} h-auto py-2 border-border`}></textarea>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? t("sending") : t("submitRequest")}
      </Button>
    </form>
  );
}