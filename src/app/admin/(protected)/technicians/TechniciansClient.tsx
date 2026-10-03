"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createTechnician } from "@/app/admin/actions";
import { AdminButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, X } from "lucide-react";

export default function TechniciansClient() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const closeModalPosition = isRTL ? "left-4" : "right-4"; // X button position

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.append("image", imageUrl);
    const result = await createTechnician(formData);
    if (result.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      setError(result.error || t("techniciansPage.error"));
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <AdminButton icon={Plus} onClick={() => setIsModalOpen(true)}>{t("techniciansPage.add_new")}</AdminButton>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className={`absolute top-4 ${closeModalPosition} text-[#68777D]`}>
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">{t("techniciansPage.add_new_title")}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">{t("techniciansPage.image")}</label>
                  <ImageUpload onImageChange={(url) => setImageUrl(url)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">{t("techniciansPage.name_ar")}</label>
                    <input name="nameAr" required className="w-full h-11 px-4 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{t("techniciansPage.name_en")}</label>
                    <input name="nameEn" required className="w-full h-11 px-4 border rounded-md" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">{t("techniciansPage.specialty_ar")}</label>
                    <input name="specialtyAr" required className="w-full h-11 px-4 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{t("techniciansPage.specialty_en")}</label>
                    <input name="specialtyEn" required className="w-full h-11 px-4 border rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">{t("techniciansPage.services")}</label>
                  <input name="serviceSlugs" required className="w-full h-11 px-4 border rounded-md" placeholder="refrigerator-repair, ac-repair" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">{t("techniciansPage.phone")}</label>
                    <input name="phone" className="w-full h-11 px-4 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{t("techniciansPage.experience")}</label>
                    <input name="experience" className="w-full h-11 px-4 border rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">{t("techniciansPage.bio_ar")}</label>
                  <textarea name="bioAr" rows={3} className="w-full p-2 border rounded-md"></textarea>
                </div>
                <div>
                  <label className="block text-sm mb-1">{t("techniciansPage.bio_en")}</label>
                  <textarea name="bioEn" rows={3} className="w-full p-2 border rounded-md"></textarea>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <AdminButton type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("techniciansPage.saving") : t("techniciansPage.save")}
                </AdminButton>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}