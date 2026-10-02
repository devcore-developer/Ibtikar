"use client";

import { CheckCircle, Circle, XCircle } from "lucide-react";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "OUT_FOR_DELIVERY", "COMPLETED"];

const statusTranslations: Record<string, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "تم التأكيد",
  PROCESSING: "قيد التجهيز",
  OUT_FOR_DELIVERY: "خرج للتوصيل",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
};

export function OrderStatusTimeline({ currentStatus }: { currentStatus: string }) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg border border-red-100">
        <XCircle size={24} />
        <div>
          <p className="font-bold">تم إلغاء هذا الطلب</p>
          <p className="text-sm text-red-500">هذا الطلب لن تتم معالجته.</p>
        </div>
      </div>
    );
  }

  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 py-4">
      {statuses.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={status} className="flex items-center flex-1 w-full md:w-auto">
            <div className="flex flex-col items-center text-center">
              {isCompleted && <CheckCircle size={28} className="text-[#0B5C63] mb-1" />}
              {isCurrent && <Circle size={28} className="text-[#0B5C63] fill-[#0B5C63] text-white mb-1" />}
              {isFuture && <Circle size={28} className="text-gray-300 mb-1" />}
              <span className={`text-xs font-medium ${isFuture ? "text-gray-400" : "text-[#172126]"}`}>
                {statusTranslations[status]}
              </span>
            </div>
            {index < statuses.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded-full ${isCompleted ? "bg-[#0B5C63]" : "bg-gray-200"} mb-6`} />
            )}
          </div>
        );
      })}
    </div>
  );
}