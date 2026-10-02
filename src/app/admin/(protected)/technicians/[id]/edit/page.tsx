import { prisma } from "@/lib/prisma";
import { AdminCard, AdminCardHeader, AdminButton } from "@/components/admin/ui";
import { updateTechnicianAction } from "@/app/admin/actions";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { notFound } from "next/navigation";

export default async function EditTechnicianPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tech = await prisma.technician.findUnique({ where: { id } });

  if (!tech) return notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">تعديل الفني: {tech.nameAr}</h1>
      
      <AdminCard>
        <AdminCardHeader title="بيانات الفني" />
        <form action={updateTechnicianAction} className="p-6 space-y-4">
          <input type="hidden" name="id" value={tech.id} />
          
          <div>
            <label className="block text-sm mb-2">صورة الفني (للتغيير ارفع صورة جديدة)</label>
            <ImageUpload onImageChange={() => {}} existingImage={tech.image || undefined} />
            <input type="hidden" name="image" defaultValue={tech.image || ""} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">الاسم بالعربية</label>
              <input name="nameAr" defaultValue={tech.nameAr} required className="w-full h-11 px-4 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">الاسم بالإنجليزية</label>
              <input name="nameEn" defaultValue={tech.nameEn} required className="w-full h-11 px-4 border rounded-md" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">التخصص (عربي)</label>
              <input name="specialtyAr" defaultValue={tech.specialtyAr} required className="w-full h-11 px-4 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">التخصص (إنجليزي)</label>
              <input name="specialtyEn" defaultValue={tech.specialtyEn} required className="w-full h-11 px-4 border rounded-md" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">رقم الهاتف</label>
              <input name="phone" defaultValue={tech.phone || ""} className="w-full h-11 px-4 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm mb-1">سنوات الخبرة</label>
              <input name="experience" defaultValue={tech.experience || ""} className="w-full h-11 px-4 border rounded-md" />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">الخدمات (مفصولة بفاصلة)</label>
            <input name="serviceSlugs" defaultValue={tech.serviceSlugs.join(", ")} required className="w-full h-11 px-4 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm mb-1">النبذة (عربي)</label>
            <textarea name="bioAr" defaultValue={tech.bioAr || ""} rows={3} className="w-full p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label className="block text-sm mb-1">النبذة (إنجليزي)</label>
            <textarea name="bioEn" defaultValue={tech.bioEn || ""} rows={3} className="w-full p-2 border rounded-md"></textarea>
          </div>

          <div className="flex gap-3">
            <AdminButton type="submit">حفظ التعديلات</AdminButton>
            <a href="/admin/technicians" className="h-10 px-4 rounded-lg text-sm font-semibold inline-flex items-center justify-center border border-[#E8ECEE] text-[#172126] hover:bg-[#F6F8F9]">
              إلغاء
            </a>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}