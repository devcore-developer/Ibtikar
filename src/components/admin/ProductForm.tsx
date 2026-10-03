"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function ProductForm({ mode, product, categories }: { 
  mode: "create" | "edit"; 
  product?: any; 
  categories: any[];
}) {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState(product?.image || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("image", imageUrl);
    
    try {
      let result;
      if (mode === "create") {
        result = await createProduct(formData);
      } else {
        result = await updateProduct(formData);
      }

      if (result?.success) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setError(result?.error || "Failed to save product.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full h-11 px-4 border border-[#E8ECEE] rounded-md bg-[#F6F8F9] focus:outline-none focus:border-[#0B5C63] focus:bg-white transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {mode === "edit" && (
        <input type="hidden" name="id" value={product.id} />
      )}
      
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t("productsPage.name_ar")}</label>
          <input name="nameAr" defaultValue={product?.nameAr || ""} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t("productsPage.name_en")}</label>
          <input name="nameEn" defaultValue={product?.nameEn || ""} required className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t("productsPage.category")}</label>
        <select name="categoryId" defaultValue={product?.categoryId || ""} required className={inputClass}>
          <option value="" disabled>Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nameEn} - {cat.nameAr}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t("productsPage.price")}</label>
          <input name="price" type="number" step="0.001" defaultValue={product?.price || ""} required className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <input name="brand" defaultValue={product?.brand || ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image</label>
        <ImageUpload onImageChange={(url) => setImageUrl(url)} existingImage={imageUrl} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("techniciansPage.saving") : (mode === "edit" ? t("productsPage.save_changes") : t("productsPage.add_new"))}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}