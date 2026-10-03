import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader } from "@/components/admin/ui";
import { deleteCategory } from "@/app/admin/actions";
import CategoriesClient from "./CategoriesClient";
import { getTranslations } from "next-intl/server";

export default async function CategoriesPage() {
  const t = await getTranslations("Admin");
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("categories")}</h1>
        <CategoriesClient />
      </div>

      <AdminCard>
        <AdminCardHeader title={t("categoriesList")} />
        <div className="overflow-x-auto w-full">
          <table className="w-full text-right min-w-[600px]">
            <thead className="bg-[#F6F8F9] border-b border-[#E8ECEE]">
              <tr>
                <th className="p-4 font-medium">{t("table.nameAr")}</th>
                <th className="p-4 font-medium">{t("table.nameEn")}</th>
                <th className="p-4 font-medium">{t("table.productCount")}</th>
                <th className="p-4 font-medium">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECEE]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#F6F8F9]">
                  <td className="p-4 font-medium text-[#172126]">{cat.nameAr}</td>
                  <td className="p-4 text-[#68777D]">{cat.nameEn}</td>
                  <td className="p-4 text-[#68777D]">{cat._count.products}</td>
                  <td className="p-4">
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button type="submit" className="text-red-500 text-sm hover:underline font-medium">
                        {t("table.delete")}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#68777D]">
                    {t("noOrders")}
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