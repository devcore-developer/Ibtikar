import { LucideIcon } from "lucide-react";

export type Category = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: LucideIcon;
  isActive: boolean;
};

export type Product = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr: string;
  descriptionEn: string;
  shortDescriptionAr?: string;
  shortDescriptionEn?: string;
  price: number;
  categoryId: string;
  categorySlug: string;
  images: string[];
  isActive: boolean;
  partNumber?: string;
  brand?: string;
  compatibility?: string;
};