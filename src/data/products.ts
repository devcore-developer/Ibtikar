import { Product } from "@/types/product";

export const products: Product[] = [
  // Refrigerators
  {
    id: "prod_1", nameAr: "ثرموستات ثلاجة سامسونج", nameEn: "Samsung Fridge Thermostat",
    slug: "samsung-fridge-thermostat", descriptionAr: "ثرموستات أصلي لثلاجات سامسونج، ينظم درجة الحرارة بدقة.", descriptionEn: "Original thermostat for Samsung fridges, regulates temperature accurately.",
    shortDescriptionAr: "ينظم درجة الحرارة", shortDescriptionEn: "Regulates temperature",
    price: 5.500, categoryId: "cat_fridge", categorySlug: "refrigerator-parts", images: [], isActive: true, partNumber: "THS-123", brand: "Samsung"
  },
  {
    id: "prod_2", nameAr: "كمبروسر ثلاجة عام", nameEn: "Generic Fridge Compressor",
    slug: "generic-fridge-compressor", descriptionAr: "كمبروسر قوي ومتوافق مع معظم الثلاجات العادية.", descriptionEn: "Powerful compressor compatible with most regular fridges.",
    shortDescriptionAr: "قوة تبريد عالية", shortDescriptionEn: "High cooling power",
    price: 25.000, categoryId: "cat_fridge", categorySlug: "refrigerator-parts", images: [], isActive: true, partNumber: "CMP-456", brand: "Generic"
  },
  // Washers
  {
    id: "prod_3", nameAr: "حزام غسالة LG", nameEn: "LG Washer Belt",
    slug: "lg-washer-belt", descriptionAr: "حزام محرك أصلي لغسالات LG ملابم.", descriptionEn: "Original motor belt for LG washing machines.",
    shortDescriptionAr: "متين ومرن", shortDescriptionEn: "Durable and flexible",
    price: 3.000, categoryId: "cat_washer", categorySlug: "washing-machine-parts", images: [], isActive: true, partNumber: "BLT-789", brand: "LG"
  },
  {
    id: "prod_4", nameAr: "مضخة سحب غسالة", nameEn: "Washer Drain Pump",
    slug: "washer-drain-pump", descriptionAr: "مضخة سحب مياه قوية لجميع أنواع الغسالات.", descriptionEn: "Strong water drain pump for all types of washers.",
    shortDescriptionAr: "سحب سريع للمياه", shortDescriptionEn: "Fast water drainage",
    price: 8.750, categoryId: "cat_washer", categorySlug: "washing-machine-parts", images: [], isActive: true, partNumber: "PMP-012", brand: "Generic"
  },
  // ACs
  {
    id: "prod_5", nameAr: "فلتر مكيف سبليت", nameEn: "Split AC Filter",
    slug: "split-ac-filter", descriptionAr: "فلتر هواء قابل للغسيل لمكيفات السبليت.", descriptionEn: "Washable air filter for split ACs.",
    shortDescriptionAr: "نظافة هواء أعلى", shortDescriptionEn: "Better air quality",
    price: 2.500, categoryId: "cat_ac", categorySlug: "air-conditioner-parts", images: [], isActive: true, partNumber: "FLT-345"
  },
  {
    id: "prod_6", nameAr: "موتور مروحة مكيف", nameEn: "AC Fan Motor",
    slug: "ac-fan-motor", descriptionAr: "موتور مروحة داخلي للمكيفات، هادئ وفعال.", descriptionEn: "Indoor AC fan motor, quiet and efficient.",
    price: 15.000, categoryId: "cat_ac", categorySlug: "air-conditioner-parts", images: [], isActive: true, partNumber: "MTR-678"
  },
  // Vacuums
  {
    id: "prod_7", nameAr: "كيس غبار مكنسة", nameEn: "Vacuum Dust Bag",
    slug: "vacuum-dust-bag", descriptionAr: "أكياس غبار ورقية قابلة للتبديل.", descriptionEn: "Disposable paper dust bags.",
    price: 1.500, categoryId: "cat_vacuum", categorySlug: "vacuum-cleaner-parts", images: [], isActive: true, partNumber: "BAG-901"
  },
  // Cookers
  {
    id: "prod_8", nameAr: "شعلة غاز طباخ عادية", nameEn: "Standard Cooker Gas Burner",
    slug: "standard-cooker-gas-burner", descriptionAr: "شعلة غاز نحاسية عالية الجودة.", descriptionEn: "High-quality brass gas burner.",
    price: 4.000, categoryId: "cat_cooker", categorySlug: "cooker-parts", images: [], isActive: true, partNumber: "BRN-234"
  },
  // Other
  {
    id: "prod_9", nameAr: "فيشة كهرباء 3 بن", nameEn: "3-Pin Power Plug",
    slug: "3-pin-power-plug", descriptionAr: "فيشة كهرباء آمنة 3 بن.", descriptionEn: "Safe 3-pin power plug.",
    price: 0.750, categoryId: "cat_other", categorySlug: "other-parts", images: [], isActive: true, partNumber: "PLG-567"
  }
];

// Helper functions to mimic future database queries
export const getProductsByCategory = (categorySlug: string) => 
  products.filter(p => p.categorySlug === categorySlug && p.isActive);

export const getProductBySlug = (slug: string) => 
  products.find(p => p.slug === slug && p.isActive);

export const getRelatedProducts = (productId: string, categorySlug: string, limit: number = 4) => 
  products.filter(p => p.categorySlug === categorySlug && p.id !== productId && p.isActive).slice(0, limit);