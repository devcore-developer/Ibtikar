import { Refrigerator, WashingMachine, Wind, Plug, Flame, Wrench } from "lucide-react";

export const maintenanceServices = [
  { id: "refrigerator-repair", slug: "refrigerator-repair", nameAr: "صيانة الثلاجات", nameEn: "Refrigerator Repair", descriptionAr: "إصلاح وصيانة جميع أنواع الثلاجات", descriptionEn: "Repair and maintenance of all refrigerators", icon: Refrigerator, isActive: true },
  { id: "washing-machine-repair", slug: "washing-machine-repair", nameAr: "صيانة الغسالات", nameEn: "Washing Machine Repair", descriptionAr: "إصلاح وصيانة الغسالات", descriptionEn: "Repair and maintenance of washing machines", icon: WashingMachine, isActive: true },
  { id: "air-conditioner-repair", slug: "air-conditioner-repair", nameAr: "صيانة المكيفات", nameEn: "AC Repair", descriptionAr: "صيانة وتنظيف المكيفات", descriptionEn: "AC maintenance and cleaning", icon: Wind, isActive: true },
  { id: "vacuum-cleaner-repair", slug: "vacuum-cleaner-repair", nameAr: "صيانة المكانس", nameEn: "Vacuum Repair", descriptionAr: "إصلاح المكانس الكهربائية", descriptionEn: "Vacuum cleaner repair", icon: Plug, isActive: true },
  { id: "cooker-repair", slug: "cooker-repair", nameAr: "صيانة الأفران", nameEn: "Cooker Repair", descriptionAr: "صيانة الأفران والطباخات", descriptionEn: "Cooker and oven repair", icon: Flame, isActive: true },
  { id: "general-electrical-repair", slug: "general-electrical-repair", nameAr: "صيانة أجهزة كهربائية", nameEn: "General Electrical Repair", descriptionAr: "خدمات إصلاح أخرى", descriptionEn: "Other repair services", icon: Wrench, isActive: true },
];

export const getServiceBySlug = (slug: string) => maintenanceServices.find(s => s.slug === slug);