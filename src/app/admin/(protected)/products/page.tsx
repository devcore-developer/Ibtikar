import { prisma } from "@/lib/prisma";
import { deleteProduct, toggleProductStatus } from "@/app/admin/actions";
import { getTranslations, getLocale } from "next-intl/server";
import { getLocalizedField } from "@/lib/localization";
import Link from "next/link";

export default async function AdminProductsPage() {
  const t = await getTranslations("Admin");
  const locale = await getLocale();
  const isRTL = locale === "ar";
  const textAlign = isRTL ? "text-right" : "text-left";

  const products = await prisma.product.findMany({ include: { category: true } });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("productsPage.title")}</h1>
        <Link href="/admin/products/new" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
          {t("productsPage.add_new")}
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto w-full">
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
                  <td className="p-4 flex gap-2">
                    <form action={toggleProductStatus}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-blue-500 text-sm hover:underline">
                        {p.isActive ? t("productsPage.deactivate") : t("productsPage.activate")}
                      </button>
                    </form>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-red-500 text-sm hover:underline">
                        {t("table.delete")}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}