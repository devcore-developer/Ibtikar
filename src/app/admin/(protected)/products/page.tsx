import { prisma } from "@/lib/prisma";
import { deleteProduct, toggleProductStatus } from "@/app/admin/actions";
import { getTranslations, getLocale } from "next-intl/server";
import { getLocalizedField } from "@/lib/localization";
import Link from "next/link";
import { Pencil, Power, Trash2 } from "lucide-react";

export default async function AdminProductsPage() {
  const t = await getTranslations("Admin");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const textAlign = isRTL ? "text-right" : "text-left";

  const products = await prisma.product.findMany({ include: { category: true } });

  return (
    <div>
      {/* Header - Stacked on mobile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("productsPage.title")}</h1>
        <Link href="/admin/products/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 w-full md:w-auto text-center">
          {t("productsPage.add_new")}
        </Link>
      </div>

      {/* Desktop Table (Hidden on mobile) */}
      <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full min-w-[600px] table-fixed">
          <colgroup>
            <col className="w-2/5" />
            <col className="w-1/5" />
            <col className="w-1/6" />
            <col className="w-1/6" />
            <col className="w-1/6" />
          </colgroup>
          <thead className="bg-muted/5 border-b border-border">
            <tr className={`${textAlign}`}>
              <th className="p-4 font-semibold">{t("productsPage.product")}</th>
              <th className="p-4 font-semibold">{t("productsPage.category")}</th>
              <th className="p-4 font-semibold">{t("productsPage.price")}</th>
              <th className="p-4 font-semibold">{t("productsPage.status")}</th>
              <th className="p-4 font-semibold">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={`border-b border-border ${textAlign}`}>
                <td className="p-4 truncate">{getLocalizedField(p.nameAr, p.nameEn, locale)}</td>
                <td className="p-4 truncate">{getLocalizedField(p.category?.nameAr, p.category?.nameEn, locale) || "-"}</td>
                <td className="p-4">{p.price.toFixed(3)} {t("productsPage.currency")}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.isActive ? t("productsPage.active") : t("productsPage.inactive")}
                  </span>
                </td>
                <td className="p-4 flex gap-2 items-center">
                  <Link href={`/admin/products/${p.id}/edit`} className="p-2 rounded-md hover:bg-gray-100 text-[#68777D]" title={t("table.edit")}>
                    <Pencil size={16} />
                  </Link>
                  <form action={toggleProductStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="p-2 rounded-md hover:bg-gray-100 text-[#68777D]" title={p.isActive ? t("productsPage.deactivate") : t("productsPage.activate")}>
                      <Power size={16} />
                    </button>
                  </form>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="p-2 rounded-md hover:bg-red-50 text-red-400" title={t("table.delete")}>
                      <Trash2 size={16} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards (Visible on mobile only) */}
      <div className="md:hidden space-y-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-[#E8ECEE] rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-4">
              {p.image ? (
                <img src={p.image} alt="Product" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 text-xs">N/A</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#172126] truncate">{getLocalizedField(p.nameAr, p.nameEn, locale)}</h3>
                <p className="text-sm text-[#68777D] truncate">{getLocalizedField(p.category?.nameAr, p.category?.nameEn, locale) || "-"}</p>
                <p className="text-sm font-medium text-[#172126] mt-1">{p.price.toFixed(3)} {t("productsPage.currency")}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#E8ECEE]">
              <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {p.isActive ? t("productsPage.active") : t("productsPage.inactive")}
              </span>
              <div className="flex gap-2">
                <Link href={`/admin/products/${p.id}/edit`} className="p-2 rounded-md hover:bg-gray-100" title={t("table.edit")}>
                  <Pencil size={18} className="text-[#68777D]" />
                </Link>
                <form action={toggleProductStatus}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="p-2 rounded-md hover:bg-gray-100" title={p.isActive ? t("productsPage.deactivate") : t("productsPage.activate")}>
                    <Power size={18} className="text-[#68777D]" />
                  </button>
                </form>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="p-2 rounded-md hover:bg-red-50" title={t("table.delete")}>
                    <Trash2 size={18} className="text-red-400" />
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