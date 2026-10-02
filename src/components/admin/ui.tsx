import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LucideIcon, Inbox, Loader2 } from "lucide-react";
import React from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==========================================
// Button Component
// ==========================================
const buttonVariants = {
  primary: "bg-[#0B5C63] text-white hover:bg-[#094D53] disabled:bg-[#0B5C63]/50",
  secondary: "bg-white border border-[#E8ECEE] text-[#172126] hover:bg-[#F6F8F9]",
  danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100",
  ghost: "text-[#68777D] hover:bg-[#F6F8F9] hover:text-[#172126]",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  loading?: boolean;
  icon?: LucideIcon;
}

export function AdminButton({ children, variant = "primary", loading, icon: Icon, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "h-10 px-4 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0B5C63]/50 focus:ring-offset-2 disabled:cursor-not-allowed",
        buttonVariants[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

// ==========================================
// Card Component
// ==========================================
export function AdminCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl border border-[#E8ECEE] shadow-sm", className)}>
      {children}
    </div>
  );
}

// ==========================================
// Card Header (تم إضافة خاصية icon هنا)
// ==========================================
export function AdminCardHeader({ title, action, icon: Icon }: { title: string; action?: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="p-5 border-b border-[#E8ECEE] flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className="text-[#0B5C63]" />}
        <h3 className="font-bold text-[#172126]">{title}</h3>
      </div>
      {action}
    </div>
  );
}

// ==========================================
// Input Component
// ==========================================
export function AdminInput({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-[#172126]">{label}</label>}
      <input
        className={cn(
          "w-full h-11 px-4 bg-[#F6F8F9] border rounded-lg text-sm focus:outline-none focus:border-[#0B5C63] focus:bg-white transition-colors",
          error ? "border-red-500" : "border-[#E8ECEE]"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ==========================================
// Status Badge
// ==========================================
const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-teal-50 text-teal-700 border-teal-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  OUT_FOR_DELIVERY: "bg-indigo-50 text-indigo-700 border-indigo-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  NEW: "bg-blue-50 text-blue-700 border-blue-200",
  READ: "bg-gray-50 text-gray-600 border-gray-200",
  UNPAID: "bg-amber-50 text-amber-700 border-amber-200",
  PROOF_SUBMITTED: "bg-amber-50 text-amber-700 border-amber-200",
  VERIFIED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const statusTranslations: Record<string, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "تم التأكيد",
  PROCESSING: "قيد التجهيز",
  OUT_FOR_DELIVERY: "خرج للتوصيل",
  COMPLETED: "مكتمل",
  CANCELLED: "ملغي",
  NEW: "جديد",
  READ: "مقروء",
  UNPAID: "غير مدفوع",
  PROOF_SUBMITTED: "إثبات الدفع مرفوع",
  VERIFIED: "تم التحقق",
  REJECTED: "مرفوض",
};

export function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-gray-50 text-gray-600 border-gray-200";
  const label = statusTranslations[status] || status;
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", style)}>
      {label}
    </span>
  );
}

// ==========================================
// Empty State
// ==========================================
export function EmptyState({ title, description, icon: Icon = Inbox }: { title: string; description?: string; icon?: LucideIcon }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[#F6F8F9] flex items-center justify-center mb-4">
        <Icon className="text-[#68777D]" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-[#172126] mb-1">{title}</h3>
      {description && <p className="text-sm text-[#68777D]">{description}</p>}
    </div>
  );
}