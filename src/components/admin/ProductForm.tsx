"use client";

import { useState } from "react";
import { createProduct } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { generateSlug } from "@/lib/utils";

export function ProductForm({ categories }: { categories: any[] }) {
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameEn, setNameEn] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("image", imageUrl);
    formData.append("slug", generateSlug(nameEn)); // Auto-generate slug

    try {
      await createProduct(formData);
      window.location.href = "/admin/products";
    } catch (error) {
      console.error("Failed to create product", error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-6 border border-border rounded-lg max-w-2xl space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">الاسم بالعربية</label>
          <input name="nameAr" required className="w-full h-11 px-4 border border-border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">الاسم بالإنجليزية</label>
          <input 
            name="nameEn" 
            required 
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full h-11 px-4 border border-border rounded-md" 
          />
        </div>
      </div>
      
      {/* Slug field is hidden and auto-generated */}
      <input type="hidden" name="slug" value={generateSlug(nameEn)} />

      <div>
        <label className="block text-sm font-medium mb-2">صورة المنتج</label>
        <ImageUpload onImageChange={(url) => setImageUrl(url)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">السعر (د.ك)</label>
          <input name="price" type="number" step="0.001" required className="w-full h-11 px-4 border border-border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">التصنيف</label>
          <select name="categoryId" required defaultValue="" className="w-full h-11 px-4 border border-border rounded-md bg-white">
            <option value="" disabled>اختر التصنيف...</option>
            {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameAr} - {c.nameEn}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">الوصف بالعربية</label>
        <textarea name="descriptionAr" rows={3} className="w-full p-2 border border-border rounded-md"></textarea>
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="h-11 px-6 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? "جاري الحفظ..." : "حفظ المنتج"}
      </button>
    </form>
  );
}