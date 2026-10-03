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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("techniciansPage.title")}</h1>
        <TechniciansClient />
      </div>

      <AdminCard>
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
                  <td className="p-4 font-medium text-[#172126] truncate">
                    {getLocalizedField(tech.nameAr, tech.nameEn, locale)}
                  </td>
                  <td className="p-4 text-[#68777D] truncate">
                    {getLocalizedField(tech.specialtyAr, tech.specialtyEn, locale)}
                  </td>
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
              {technicians.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#68777D]">
                    {t("techniciansPage.empty")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}