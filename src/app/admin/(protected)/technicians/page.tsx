"use client";

import { useState } from "react";
import { createTechnician } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function TechniciansPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleAddClick = () => {
    setError("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    // Append the image URL from state
    formData.append("image", imageUrl);
    
    const result = await createTechnician(formData);
    
    if (result.success) {
      setIsModalOpen(false);
      window.location.reload(); 
    } else {
      setError(result.error || "حدث خطأ أثناء الحفظ.");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الفنيون</h1>
        <Button onClick={handleAddClick}>إضافة فني</Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-white my-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">إضافة فني جديد</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">صورة الفني</label>
                  <ImageUpload onImageChange={(url) => setImageUrl(url)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">الاسم بالعربية</label>
                    <input name="nameAr" required className="w-full h-11 px-4 border border-border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">الاسم بالإنجليزية</label>
                    <input name="nameEn" required className="w-full h-11 px-4 border border-border rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الرابط (Slug)</label>
                  <input name="slug" required className="w-full h-11 px-4 border border-border rounded-md" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">التخصص (عربي)</label>
                    <input name="specialtyAr" required className="w-full h-11 px-4 border border-border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">التخصص (إنجليزي)</label>
                    <input name="specialtyEn" required className="w-full h-11 px-4 border border-border rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الخدمات (مفصولة بفاصلة)</label>
                  <input name="serviceSlugs" required className="w-full h-11 px-4 border border-border rounded-md" placeholder="refrigerator-repair, ac-repair" />
                </div>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "جاري الحفظ..." : "حفظ الفني"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}