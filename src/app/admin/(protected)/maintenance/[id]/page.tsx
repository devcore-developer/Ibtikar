export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";
import { getMaintenanceStatusLabel } from "@/lib/localization";
import { AdminCard, AdminCardHeader } from "@/components/admin/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("Admin.maintenancePage");
  const { id } = await params;
  const req = await prisma.maintenanceRequest.findUnique({ where: { id } });
  if (!req) return {};
  return { title: `${t("title")} #${req.id.slice(-6)}` };
}

export default async function MaintenanceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const t = await getTranslations("Admin.maintenancePage");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const textAlign = isRTL ? "text-right" : "text-left";

  const { id } = await params;
  const req = await prisma.maintenanceRequest.findUnique({ where: { id } });

  if (!req) return notFound();

  const detailRow = "flex justify-between items-center py-3 border-b border-[#E8ECEE] gap-4";
  const detailLabel = "text-sm text-[#68777D]";
  const detailValue = "text-sm font-medium text-[#172126]";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold">{t("title")} #{req.id.slice(-6).toUpperCase()}</h1>
        <Link href="/admin/maintenance" className="text-sm text-[#0B5C63] hover:underline">
          ← {t("back")}
        </Link>
      </div>

      <AdminCard>
        <AdminCardHeader title={t("customer_info")} />
        <div className={`p-6 ${textAlign}`}>
          <div className={detailRow}>
            <span className={detailLabel}>{t("name")}</span>
            <span className={detailValue}>{req.customerName}</span>
          </div>
          <div className={detailRow}>
            <span className={detailLabel}>{t("phone")}</span>
            <span className={detailValue} dir="ltr">{req.phone}</span>
          </div>
          <div className={detailRow}>
            <span className={detailLabel}>{t("area")}</span>
            <span className={detailValue}>{req.area || "N/A"}</span>
          </div>
          <div className={detailRow}>
            <span className={detailLabel}>{t("address")}</span>
            <span className={detailValue}>{req.address || "N/A"}</span>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminCardHeader title={t("service_info")} />
        <div className={`p-6 ${textAlign}`}>
          <div className={detailRow}>
            <span className={detailLabel}>{t("appliance_type")}</span>
            <span className={detailValue}>{req.applianceType}</span>
          </div>
          <div className={detailRow}>
            <span className={detailLabel}>{t("service_id")}</span>
            <span className={detailValue}>{req.serviceId}</span>
          </div>
          <div className={detailRow}>
            <span className={detailLabel}>{t("brand")}</span>
            <span className={detailValue}>{req.brand || "N/A"}</span>
          </div>
          <div className={detailRow}>
            <span className={detailLabel}>{t("model")}</span>
            <span className={detailValue}>{req.model || "N/A"}</span>
          </div>
          <div className={detailRow}>
            <span className={detailLabel}>{t("problem")}</span>
            <span className={`${detailValue} max-w-[70%] ${isRTL ? "text-left" : "text-right"}`}>{req.problemDescription || "N/A"}</span>
          </div>
        </div>
      </AdminCard>

      <AdminCard>
        <AdminCardHeader title={t("status_notes")} />
        <div className={`p-6 ${textAlign}`}>
          <div className={detailRow}>
            <span className={detailLabel}>{t("preferred_time")}</span>
            <span className={detailValue}>{req.preferredContactTime || "N/A"}</span>
          </div>
          <div className={detailRow}>
            <span className={detailLabel}>{t("notes")}</span>
            <span className={detailValue}>{req.notes || "N/A"}</span>
          </div>
          <div className={detailRow}>
            <span className={detailLabel}>{t("created_at")}</span>
            <span className={detailValue}>{new Date(req.createdAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}</span>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className={detailLabel}>{t("current_status")}</span>
            <span className={`px-3 py-1 rounded-full text-xs border ${
              req.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" :
              req.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" :
              "bg-amber-50 text-amber-700 border-amber-200"
            }`}>
              {getMaintenanceStatusLabel(req.status, locale)}
            </span>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}