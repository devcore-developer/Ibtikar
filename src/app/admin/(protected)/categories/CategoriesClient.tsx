"use client";

import { useState } from "react";
import { createCategory } from "@/app/admin/actions";
import { AdminButton } from "@/components/admin/ui";
import { Plus, X } from "lucide-react";

export default function CategoriesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      setError(result.error || "حدث خطأ.");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <AdminButton icon={Plus} onClick={() => setIsModalOpen(true)}>
        إضافة تصنيف
      </AdminButton>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 left-4 text-[#68777D]">
              <X size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">إضافة تصنيف جديد</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">الاسم بالعربية</label>
                  <input name="nameAr" required className="w-full h-11 px-4 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm mb-1">الاسم بالإنجليزية</label>
                  <input name="nameEn" required className="w-full h-11 px-4 border rounded-md" />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <AdminButton type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "جاري الحفظ..." : "حفظ"}
                </AdminButton>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}