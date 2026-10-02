"use client";

import { useState } from "react";
import { createCategory } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddClick = () => {
    setError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const result = await createCategory(formData);
    
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
        <h1 className="text-2xl font-bold">التصنيفات</h1>
        <Button onClick={handleAddClick}>إضافة تصنيف</Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg bg-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">إضافة تصنيف جديد</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم بالعربية</label>
                  <input name="nameAr" required className="w-full h-11 px-4 border border-border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">الاسم بالإنجليزية</label>
                  <input name="nameEn" required className="w-full h-11 px-4 border border-border rounded-md" />
                </div>
                {/* Slug field is hidden and generated server-side */}
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "جاري الحفظ..." : "حفظ التصنيف"}
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