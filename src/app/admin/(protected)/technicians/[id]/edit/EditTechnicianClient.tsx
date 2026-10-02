"use client";

import { useState } from "react";
import { AdminCard, AdminCardHeader, AdminButton } from "@/components/admin/ui";
import { updateTechnicianAction } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { CheckCircle } from "lucide-react";

export default function EditTechnicianClient({ tech }: { tech: any }) {
  const [imageUrl, setImageUrl] = useState(tech.image || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    formData.append("image", imageUrl);
    
    await updateTechnicianAction(formData);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">تعديل الفني: {tech.nameAr}</h1>
      
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 flex items-center gap-2">
          <CheckCircle size={20} />
          <span className="font-medium">تم الحفظ بنجاح!</span>
        </div>
      )}

      <AdminCard>
        <AdminCardHeader title="بيانات الفني" />
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input type="hidden" name="id" value={tech.id} />
          
          <div>
            <label className="block text-sm mb-2">صورة الفني</label>
            <ImageUpload onImageChange={(url) => setImageUrl(url)} existingImage={tech.image || undefined} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">الاسم بالعربية</label>
              <input name="nameAr" defaultValue={tech.nameAr} required className="w-full h-11 px-4 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">الاسم بالإنجليزية</label>
              <input name="nameEn" defaultValue={tech.nameEn} required className="w-full h-11 px-4 border rounded-md" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">التخصص (عربي)</label>
              <input name="specialtyAr" defaultValue={tech.specialtyAr} required className="w-full h-11 px-4 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">التخصص (إنجليزي)</label>
              <input name="specialtyEn" defaultValue={tech.specialtyEn} required className="w-full h-11 px-4 border rounded-md" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">رقم الهاتف</label>
              <input name="phone" defaultValue={tech.phone || ""} className="w-full h-11 px-4 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">سنوات الخبرة</label>
              <input name="experience" defaultValue={tech.experience || ""} className="w-full h-11 px-4 border rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">الخدمات (مفصولة بفاصلة)</label>
            <input name="serviceSlugs" defaultValue={tech.serviceSlugs.join(", ")} required className="w-full h-11 px-4 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm mb-1">النبذة (عربي)</label>
            <textarea name="bioAr" defaultValue={tech.bioAr || ""} rows={3} className="w-full p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label className="block text-sm mb-1">النبذة (إنجليزي)</label>
            <textarea name="bioEn" defaultValue={tech.bioEn || ""} rows={3} className="w-full p-2 border rounded-md"></textarea>
          </div>

          <div className="flex gap-3 items-center">
            <AdminButton type="submit" disabled={isSaving}>
              {isSaving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </AdminButton>
            <a href="/admin/technicians" className="h-10 px-4 rounded-lg text-sm font-semibold inline-flex items-center justify-center border border-[#E8ECEE] text-[#172126] hover:bg-[#F6F8F9]">
              إلغاء
            </a>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}