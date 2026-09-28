import { Wrench, Refrigerator, WashingMachine, Wind, Plug, Flame, Truck, ShieldCheck, Headphones, Tag } from "lucide-react";
import { Category, Product, Technician, Highlight } from "@/types";

export const highlights: Highlight[] = [
  { id: "parts", icon: Wrench },
  { id: "maintenance", icon: Headphones },
  { id: "delivery", icon: Truck },
  { id: "trusted", icon: ShieldCheck },
];

export const categories: Category[] = [
  { id: "fridge", icon: Refrigerator },
  { id: "washer", icon: WashingMachine },
  { id: "ac", icon: Wind },
  { id: "vacuum", icon: Plug },
  { id: "cooker", icon: Flame },
  { id: "other", icon: Wrench },
];

export const featuredProducts: Product[] = [
  { id: "1", nameAr: "ثرموستات ثلاجة", nameEn: "Refrigerator Thermostat", categoryAr: "ثلاجات", categoryEn: "Refrigerators", price: "5.000 د.ك" },
  { id: "2", nameAr: "خرطوم غسالة", nameEn: "Washing Machine Hose", categoryAr: "غسالات", categoryEn: "Washers", price: "2.500 د.ك" },
  { id: "3", nameAr: "فلتر مكيف", nameEn: "AC Filter", categoryAr: "مكيفات", categoryEn: "ACs", price: "1.750 د.ك" },
  { id: "4", nameAr: "شعلة غاز", nameEn: "Gas Burner", categoryAr: "طبّاخات", categoryEn: "Cookers", price: "8.000 د.ك" },
];

export const technicians: Technician[] = [
  { 
    id: "1", 
    nameAr: "أحمد علي", 
    nameEn: "Ahmed Ali", 
    specialtyAr: "فني أجهزة منزلية", 
    specialtyEn: "Home Appliance Technician",
    descAr: "متخصص في صيانة وإصلاح الأجهزة المنزلية المختلفة.",
    descEn: "Specialized in maintaining and repairing various home appliances."
  },
  { 
    id: "2", 
    nameAr: "محمد سالم", 
    nameEn: "Mohammed Salem", 
    specialtyAr: "فني تكييف", 
    specialtyEn: "AC Technician",
    descAr: "خبرة في تركيب وصيانة جميع أنواع المكيفات.",
    descEn: "Experienced in installing and maintaining all types of ACs."
  },
  { 
    id: "3", 
    nameAr: "خالد عبدالله", 
    nameEn: "Khaled Abdullah", 
    specialtyAr: "فني غسالات وثلاجات", 
    specialtyEn: "Washer & Fridge Technician",
    descAr: "إصلاح أعطال الغسالات والثلاجات بكفاءة عالية.",
    descEn: "Efficient repair of washing machines and refrigerators."
  }
];