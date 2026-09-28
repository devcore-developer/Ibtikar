import { LucideIcon } from "lucide-react";

export type Category = {
  id: string;
  icon: LucideIcon;
};

export type Product = {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  price: string;
};

export type Technician = {
  id: string;
  nameAr: string;
  nameEn: string;
  specialtyAr: string;
  specialtyEn: string;
  descAr: string;
  descEn: string;
};

export type Highlight = {
  id: string;
  icon: LucideIcon;
};