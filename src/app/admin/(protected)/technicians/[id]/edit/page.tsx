import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditTechnicianClient from "./EditTechnicianClient";

export default async function EditTechnicianPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tech = await prisma.technician.findUnique({ where: { id } });

  if (!tech) return notFound();

  // تمرير البيانات للكلاينت كومبوننت
  return <EditTechnicianClient tech={JSON.parse(JSON.stringify(tech))} />;
}