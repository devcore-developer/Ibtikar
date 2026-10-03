import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader, EmptyState } from "@/components/admin/ui";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { getMaintenanceStatusLabel } from "@/lib/localization";

export default async function MaintenancePage() {
  const t = await getTranslations("Admin");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const textAlign = isRTL ? "text-right" : "text-left";

  const requests = await prisma.maintenanceRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("maintenancePage.title")}</h1>
      <AdminCard>
        <AdminCardHeader title={t("maintenancePage.list_title")} />
        {requests.length === 0 ? (
          <EmptyState title={t("maintenancePage.empty")} icon={ClipboardList} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] table-fixed">
              <colgroup>
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
                <col className="w-1/5" />
              </colgroup>
              <thead className={`bg-[#F6F8F9] border-b border-[#E8ECEE] ${textAlign}`}>
                <tr>
                  <th className="p-4 font-semibold">{t("maintenancePage.customer")}</th>
                  <th className="p-4 font-semibold">{t("maintenancePage.phone")}</th>
                  <th className="p-4 font-semibold">{t("maintenancePage.appliance")}</th>
                  <th className="p-4 font-semibold">{t("maintenancePage.status")}</th>
                  <th className="p-4 font-semibold">{t("maintenancePage.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8ECEE]">
                {requests.map((req) => (
                  <tr key={req.id} className={`hover:bg-[#F6F8F9] ${textAlign}`}>
                    <td className="p-4 font-medium truncate">{req.customerName}</td>
                    <td className="p-4 text-[#68777D]" dir="ltr">{req.phone}</td>
                    <td className="p-4 text-[#68777D] truncate">{req.applianceType}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs border ${
                        req.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" :
                        req.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {getMaintenanceStatusLabel(req.status, locale)}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/maintenance/${req.id}`} className="text-blue-500 text-sm hover:underline">
                        {t("maintenancePage.view_details")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}