"use client";

import { useState } from "react";
import { createTechnician } from "@/app/admin/actions";
import { AdminButton } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, X } from "lucide-react";

export default function TechniciansClient() {
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
      setError(result.error || "حدث خطأ.");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <AdminButton icon={Plus} onClick={() => setIsModalOpen(true)}>إضافة فني</AdminButton>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 left-4 text-[#68777D]">
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">إضافة فني جديد</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">صورة الفني</label>
                  <ImageUpload onImageChange={(url) => setImageUrl(url)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">الاسم بالعربية</label>
                    <input name="nameAr" required className="w-full h-11 px-4 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">الاسم بالإنجليزية</label>
                    <input name="nameEn" required className="w-full h-11 px-4 border rounded-md" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">التخصص (عربي)</label>
                    <input name="specialtyAr" required className="w-full h-11 px-4 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">التخصص (إنجليزي)</label>
                    <input name="specialtyEn" required className="w-full h-11 px-4 border rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">الخدمات (مفصولة بفاصلة)</label>
                  <input name="serviceSlugs" required className="w-full h-11 px-4 border rounded-md" placeholder="refrigerator-repair, ac-repair" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">رقم الهاتف</label>
                    <input name="phone" className="w-full h-11 px-4 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">سنوات الخبرة</label>
                    <input name="experience" className="w-full h-11 px-4 border rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">النبذة (عربي)</label>
                  <textarea name="bioAr" rows={3} className="w-full p-2 border rounded-md"></textarea>
                </div>
                <div>
                  <label className="block text-sm mb-1">النبذة (إنجليزي)</label>
                  <textarea name="bioEn" rows={3} className="w-full p-2 border rounded-md"></textarea>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <AdminButton type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الحفظ..." : "حفظ الفني"}
                </AdminButton>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}