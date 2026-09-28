import { Refrigerator, WashingMachine, Wind, Plug, Flame, Wrench } from "lucide-react";
import { MaintenanceService } from "@/types/maintenance";

export const maintenanceServices: MaintenanceService[] = [
  {
    id: "srv_fridge", nameAr: "صيانة الثلاجات", nameEn: "Refrigerator Repair", slug: "refrigerator-repair",
    descriptionAr: "إصلاح وصيانة جميع أعطال الثلاجات الفريزر والنوفروست.", descriptionEn: "Repair and maintenance of all freezer and no-frost refrigerator faults.",
    shortDescriptionAr: "إصلاح أعطال التبريد والتجميد", shortDescriptionEn: "Cooling and freezing fault repair",
    icon: Refrigerator, isActive: true,
  },
  {
    id: "srv_washer", nameAr: "صيانة الغسالات", nameEn: "Washing Machine Repair", slug: "washing-machine-repair",
    descriptionAr: "صيانة الغسالات الأوتوماتيكية والعادية وحل مشاكل التشغيل والسحب.", descriptionEn: "Maintenance of automatic and regular washing machines, solving operation and drainage issues.",
    shortDescriptionAr: "إصلاح مشاكل التشغيل والسحب", shortDescriptionEn: "Operation and drainage issues repair",
    icon: WashingMachine, isActive: true,
  },
  {
    id: "srv_ac", nameAr: "صيانة المكيفات", nameEn: "Air Conditioner Repair", slug: "air-conditioner-repair",
    descriptionAr: "تنظيف وصيانة المكيفات السبليت والشباك وتعبئة الفريون.", descriptionEn: "Cleaning and maintaining split and window ACs, and refrigerant refilling.",
    shortDescriptionAr: "تنظيف وتعبئة فريون", shortDescriptionEn: "Cleaning and gas refilling",
    icon: Wind, isActive: true,
  },
  {
    id: "srv_vacuum", nameAr: "صيانة المكانس", nameEn: "Vacuum Cleaner Repair", slug: "vacuum-cleaner-repair",
    descriptionAr: "إصلاح أعطال المكانس الكهربائية ومحركات الشفط.", descriptionEn: "Repairing vacuum cleaner faults and suction motors.",
    shortDescriptionAr: "إصلاح محركات الشفط", shortDescriptionEn: "Suction motor repair",
    icon: Plug, isActive: true,
  },
  {
    id: "srv_cooker", nameAr: "صيانة الطباخات", nameEn: "Cooker Repair", slug: "cooker-repair",
    descriptionAr: "صيانة وإصلاح الطباخات الغاز والكهربائية وتبديل الشعلات.", descriptionEn: "Maintenance and repair of gas and electric cookers, and burner replacement.",
    shortDescriptionAr: "تبديل الشعلات والإشعال", shortDescriptionEn: "Burners and ignition replacement",
    icon: Flame, isActive: true,
  },
  {
    id: "srv_general", nameAr: "صيانة الأجهزة الكهربائية والإلكترونية", nameEn: "Electrical & Electronic Appliance Repair", slug: "general-electrical-repair",
    descriptionAr: "خدمات صيانة عامة للأجهزة الكهربائية والإلكترونية المنزلية.", descriptionEn: "General maintenance services for household electrical and electronic appliances.",
    shortDescriptionAr: "صيانة عامة للأعطال الكهربائية", shortDescriptionEn: "General electrical fault maintenance",
    icon: Wrench, isActive: true,
  }
];

export const getServiceBySlug = (slug: string) => 
  maintenanceServices.find(s => s.slug === slug && s.isActive);