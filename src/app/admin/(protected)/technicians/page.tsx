import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader } from "@/components/admin/ui";
import { deleteTechnician } from "@/app/admin/actions";
import TechniciansClient from "./TechniciansClient";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { getLocalizedField } from "@/lib/localization";

export default async function TechniciansPage() {
  const t = await getTranslations("Admin");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const textAlign = isRTL ? "text-right" : "text-left";

  const technicians = await prisma.technician.findMany();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">{t("techniciansPage.title")}</h1>
        <TechniciansClient />
      </div>

      {/* Desktop Table */}
      <AdminCard className="hidden md:block">
        <AdminCardHeader title={t("techniciansPage.list_title")} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] table-fixed">
            <colgroup>
              <col className="w-2/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
              <col className="w-1/5" />
            </colgroup>
            <thead className={`bg-[#F6F8F9] border-b border-[#E8ECEE] ${textAlign}`}>
              <tr>
                <th className="p-4 font-semibold">{t("techniciansPage.name")}</th>
                <th className="p-4 font-semibold">{t("techniciansPage.specialty")}</th>
                <th className="p-4 font-semibold">{t("techniciansPage.phone")}</th>
                <th className="p-4 font-semibold">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECEE]">
              {technicians.map((tech) => (
                <tr key={tech.id} className={`hover:bg-[#F6F8F9] ${textAlign}`}>
                  <td className="p-4 font-medium text-[#172126] truncate">{getLocalizedField(tech.nameAr, tech.nameEn, locale)}</td>
                  <td className="p-4 text-[#68777D] truncate">{getLocalizedField(tech.specialtyAr, tech.specialtyEn, locale)}</td>
                  <td className="p-4 text-[#68777D]" dir="ltr">{tech.phone || "-"}</td>
                  <td className="p-4 flex gap-3">
                    <Link href={`/admin/technicians/${tech.id}/edit`} className="text-blue-500 text-sm hover:underline font-medium">
                      {t("table.edit")}
                    </Link>
                    <form action={deleteTechnician}>
                      <input type="hidden" name="id" value={tech.id} />
                      <button type="submit" className="text-red-500 text-sm hover:underline font-medium">
                        {t("table.delete")}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {technicians.map((tech) => (
          <div key={tech.id} className="bg-white border border-[#E8ECEE] rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-4">
              {tech.image ? (
                <img src={tech.image} alt={tech.nameEn} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 text-xs">N/A</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#172126] truncate">{getLocalizedField(tech.nameAr, tech.nameEn, locale)}</h3>
                <p className="text-sm text-[#68777D] truncate">{getLocalizedField(tech.specialtyAr, tech.specialtyEn, locale)}</p>
                <p className="text-sm text-[#68777D] mt-1" dir="ltr">{tech.phone || "-"}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t border-[#E8ECEE]">
              <Link href={`/admin/technicians/${tech.id}/edit`} className="text-blue-500 text-sm font-medium hover:underline">
                {t("table.edit")}
              </Link>
              <form action={deleteTechnician}>
                <input type="hidden" name="id" value={tech.id} />
                <button type="submit" className="text-red-500 text-sm font-medium hover:underline">
                  {t("table.delete")}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}