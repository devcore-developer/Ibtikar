import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader } from "@/components/admin/ui";
import { deleteTechnician } from "@/app/admin/actions";
import TechniciansClient from "./TechniciansClient";
import Link from "next/link";

export default async function TechniciansPage() {
  const technicians = await prisma.technician.findMany();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">الفنيون</h1>
        <TechniciansClient />
      </div>

      <AdminCard>
        <AdminCardHeader title="قائمة الفنيين" />
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#F6F8F9] border-b border-[#E8ECEE]">
              <tr>
                <th className="p-4 font-semibold">الاسم</th>
                <th className="p-4 font-semibold">التخصص</th>
                <th className="p-4 font-semibold">الهاتف</th>
                <th className="p-4 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8ECEE]">
              {technicians.map((tech) => (
                <tr key={tech.id} className="hover:bg-[#F6F8F9]">
                  <td className="p-4 font-medium text-[#172126]">{tech.nameAr}</td>
                  <td className="p-4 text-[#68777D]">{tech.specialtyAr}</td>
                  <td className="p-4 text-[#68777D]" dir="ltr">{tech.phone || "-"}</td>
                  <td className="p-4 flex gap-3">
                    <Link href={`/admin/technicians/${tech.id}/edit`} className="text-blue-500 text-sm hover:underline font-medium">
                      تعديل
                    </Link>
                    <form action={deleteTechnician}>
                      <input type="hidden" name="id" value={tech.id} />
                      <button type="submit" className="text-red-500 text-sm hover:underline font-medium">
                        حذف
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {technicians.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#68777D]">
                    لا يوجد فنيون حالياً.
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