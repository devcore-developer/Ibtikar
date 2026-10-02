import { prisma } from "@/lib/prisma";
import { MaintenanceView } from "@/components/maintenance/MaintenanceView";

export default async function MaintenancePage() {
  const technicians = await prisma.technician.findMany({ where: { isActive: true }, take: 4 });
  
  // تمرير البيانات إلى المكون العميل (Client Component) لتجنب خطأ React Suspense
  return <MaintenanceView technicians={technicians} />;
}