"use client";

import { useState, useRef } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

// دالة لضغط الصورة قبل الرفع لتجنب قيود حجم الـ Body في Vercel
async function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Image load error"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

export function ImageUpload({ onImageChange, existingImage }: { onImageChange: (url: string) => void, existingImage?: string }) {
  const [preview, setPreview] = useState(existingImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      // 1. ضغط الصورة قبل الرفع
      const compressedFile = await compressImage(file);

      // 2. رفع الصورة للـ API Route الجديد
      const formData = new FormData();
      formData.append("file", compressedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Upload failed");
      }

      setPreview(result.url);
      onImageChange(result.url);
    } catch (err) {
      console.error("[CLIENT_UPLOAD_ERROR]", err);
      setError("تعذر رفع الصورة. يرجى المحاولة مرة أخرى.");
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