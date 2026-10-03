import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader } from "@/components/admin/ui";
import { deleteCategory, toggleCategoryStatus } from "@/app/admin/actions";
import CategoriesClient from "./CategoriesClient";
import { getTranslations, getLocale } from "next-intl/server";
import { Power, Trash2 } from "lucide-react";

export default async function CategoriesPage() {
  const t = await getTranslations("Admin");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const textAlign = isRTL ? "text-right" : "text-left";

  const categories = await prisma.category.findMany({ include: { products: true } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">{t("categoriesPage.title")}</h1>
        <CategoriesClient />
      </div>

      {/* Desktop Table (Hidden on mobile) */}
      <AdminCard className="hidden md:block">
        <AdminCardHeader title={t("categoriesPage.list_title")} />
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
                <th className="p-4 font-semibold">{t("table.nameAr")}</th>
                <th className="p-4 font-semibold">{t("table.nameEn")}</th>
                <th className="p-4 font-semibold">{t("productsPage.status")}</th>
                <th className="p-4 font-semibold">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECEE]">
              {categories.map((cat) => (
                <tr key={cat.id} className={`hover:bg-[#F6F8F9] ${textAlign}`}>
                  <td className="p-4 font-medium text-[#172126] truncate">{cat.nameAr}</td>
                  <td className="p-4 text-[#68777D] truncate">{cat.nameEn}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {cat.isActive ? t("productsPage.active") : t("productsPage.inactive")}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <form action={toggleCategoryStatus}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button type="submit" className="text-blue-500 text-sm hover:underline font-medium">
                        {cat.isActive ? t("productsPage.deactivate") : t("productsPage.activate")}
                      </button>
                    </form>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
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

      {/* Mobile Cards (Visible on mobile only) */}
      <div className="md:hidden space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-[#E8ECEE] rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-[#172126] truncate">
              {locale === "ar" ? cat.nameAr : cat.nameEn}
            </h3>
            <p className="text-sm text-[#68777D] truncate mt-1">
              {locale === "ar" ? cat.nameEn : cat.nameAr}
            </p>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#E8ECEE]">
              <span className={`px-2 py-1 rounded-full text-xs ${cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {cat.isActive ? t("productsPage.active") : t("productsPage.inactive")}
              </span>
              
              <div className="flex gap-2">
                <form action={toggleCategoryStatus}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button type="submit" className="p-2 rounded-md hover:bg-gray-100" title={cat.isActive ? t("productsPage.deactivate") : t("productsPage.activate")}>
                    <Power size={18} className="text-blue-500" />
                  </button>
                </form>
                <form action={deleteCategory}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button type="submit" className="p-2 rounded-md hover:bg-gray-100" title={t("table.delete")}>
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}