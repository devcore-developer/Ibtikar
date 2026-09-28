import { Technician } from "@/types/technician";

export const technicians: Technician[] = [
  {
    id: "tech_1", nameAr: "أحمد العلي", nameEn: "Ahmed Al Ali", slug: "ahmed-al-ali",
    specialtyAr: "فني ثلاجات ومكيفات", specialtyEn: "Fridge & AC Technician",
    bioAr: "فني محترف في صيانة أنظمة التبريد والتكييف مع خبرة واسعة في أعطال الكمبروسر.", bioEn: "Professional technician in cooling and AC systems maintenance with wide experience in compressor faults.",
    experience: "8 سنوات", serviceSlugs: ["refrigerator-repair", "air-conditioner-repair"], isActive: true
  },
  {
    id: "tech_2", nameAr: "سالم المطيري", nameEn: "Salem Al Mutairi", slug: "salem-al-mutairi",
    specialtyAr: "فني غسالات", specialtyEn: "Washing Machine Technician",
    bioAr: "متخصص في إصلاح الغسالات الأوتوماتيكية وحل مشاكل العطل المائي والكهربائي.", bioEn: "Specialized in automatic washing machine repair and solving water and electrical faults.",
    experience: "5 سنوات", serviceSlugs: ["washing-machine-repair"], isActive: true
  },
  {
    id: "tech_3", nameAr: "محمد الرشيدي", nameEn: "Mohammed Al Rashidi", slug: "mohammed-al-rashidi",
    specialtyAr: "فني طباخات وغاز", specialtyEn: "Cooker & Gas Technician",
    bioAr: "خبرة في تركيب وصيانة الطباخات وتسريب الغاز وأنظمة الإشعال.", bioEn: "Experience in installing and maintaining cookers, gas leaks, and ignition systems.",
    experience: "6 سنوات", serviceSlugs: ["cooker-repair"], isActive: true
  },
  {
    id: "tech_4", nameAr: "عبدالله الفضلي", nameEn: "Abdullah Al Fadhli", slug: "abdullah-al-fadhli",
    specialtyAr: "فني صيانة عامة", specialtyEn: "General Maintenance Technician",
    bioAr: "فني صيانة شامل للأجهزة المنزلية الصغيرة والمكانس والأعطال الكهربائية.", bioEn: "Comprehensive maintenance technician for small home appliances, vacuums, and electrical faults.",
    experience: "4 سنوات", serviceSlugs: ["vacuum-cleaner-repair", "general-electrical-repair"], isActive: true
  }
];

export const getTechnicianBySlug = (slug: string) => 
  technicians.find(t => t.slug === slug && t.isActive);

export const getTechniciansByService = (serviceSlug: string) => 
  technicians.filter(t => t.serviceSlugs.includes(serviceSlug) && t.isActive);