"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadImageAction } from "@/app/admin/actions";

export function ImageUpload({ onImageChange, existingImage }: { onImageChange: (url: string) => void, existingImage?: string }) {
  const [preview, setPreview] = useState(existingImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { setError("File size must be less than 5MB"); return; }
    if (!file.type.startsWith("image/")) { setError("Only image files are allowed"); return; }

    setError("");
    setIsUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadImageAction(formData);
      setPreview(url);
      onImageChange(url);
    } catch (err) {
      setError("Upload failed.");
      setPreview(existingImage || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onImageChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading} />
      {preview ? (
        <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden border border-border bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={handleRemove} className="absolute top-2 end-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors" disabled={isUploading}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full max-w-xs aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg bg-surface hover:bg-muted/5 transition-colors p-4" disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="animate-spin text-primary mb-2" size={32} />
              <span className="text-sm text-muted">جاري الرفع...</span>
            </>
          ) : (
            <>
              <UploadCloud className="text-primary mb-2" size={32} strokeWidth={1.5} />
              <span className="text-sm font-medium text-foreground">رفع صورة</span>
              <span className="text-xs text-muted mt-1">Upload Photo</span>
            </>
          )}
        </button>
      )}
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}