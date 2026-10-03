// src/lib/localization.ts

/**
 * Helper to get the correct localized string from bilingual database fields
 * Falls back to the other language if the requested one is missing
 */
export function getLocalizedField(ar: string | null | undefined, en: string | null | undefined, locale: string): string {
  if (locale === 'en') {
    return en || ar || '';
  }
  return ar || en || '';
}

/**
 * Centralized Order Status Translation
 */
export function getOrderStatusLabel(status: string, locale: string): string {
  const translations: Record<string, Record<string, string>> = {
    PENDING: { en: "Pending", ar: "قيد الانتظار" },
    CONFIRMED: { en: "Confirmed", ar: "مؤكد" },
    PROCESSING: { en: "Processing", ar: "قيد المعالجة" },
    OUT_FOR_DELIVERY: { en: "Out for Delivery", ar: "خارج للتوصيل" },
    COMPLETED: { en: "Completed", ar: "مكتمل" },
    CANCELLED: { en: "Cancelled", ar: "ملغي" },
  };
  return translations[status]?.[locale] || status;
}

/**
 * Centralized Maintenance Status Translation
 */
export function getMaintenanceStatusLabel(status: string, locale: string): string {
  const translations: Record<string, Record<string, string>> = {
    PENDING: { en: "Pending", ar: "قيد الانتظار" },
    CONTACTED: { en: "Contacted", ar: "تم التواصل" },
    SCHEDULED: { en: "Scheduled", ar: "تم الجدولة" },
    IN_PROGRESS: { en: "In Progress", ar: "قيد التنفيذ" },
    COMPLETED: { en: "Completed", ar: "مكتمل" },
    CANCELLED: { en: "Cancelled", ar: "ملغي" },
  };
  return translations[status]?.[locale] || status;
}