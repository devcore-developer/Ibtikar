"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";

// ==========================================
// Authentication Actions (تسجيل الدخول والخروج)
// ==========================================

export async function loginAction(email: string, password: string) {
  if (email !== process.env.ADMIN_EMAIL) return false;
  
  // تم وضع الـ Hash مباشرة هنا لتجاوز مشكلة قراءة $ من ملف .env
  const tempHash = "$2b$10$DRs9hOJnjOzf9FB8vlEXmOyh81SnJOxwyFlS6e1XddGwcS8mcfH72";
  const isValid = await bcrypt.compare(password, tempHash);
  
  if (!isValid) return false;

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ email, expires });
  
  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true });
  return true;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}

// ==========================================
// Product Actions (إدارة المنتجات)
// ==========================================

export async function createProduct(formData: FormData) {
  await prisma.product.create({
    data: {
      nameAr: formData.get("nameAr") as string,
      nameEn: formData.get("nameEn") as string,
      slug: formData.get("slug") as string,
      descriptionAr: formData.get("descriptionAr") as string,
      descriptionEn: formData.get("descriptionEn") as string,
      price: parseFloat(formData.get("price") as string),
      categoryId: formData.get("categoryId") as string,
      partNumber: formData.get("partNumber") as string || null,
      brand: formData.get("brand") as string || null,
    },
  });
  revalidatePath("/admin/products");
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  await prisma.product.update({ where: { id }, data: { isActive: !isActive } });
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

// ==========================================
// Order Actions (إدارة الطلبات)
// ==========================================

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

// ==========================================
// Maintenance Actions (إدارة طلبات الصيانة)
// ==========================================

export async function updateMaintenanceStatus(id: string, status: string) {
  await prisma.maintenanceRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/maintenance");
}

// ==========================================
// Messages Actions (إدارة الرسائل)
// ==========================================

export async function markMessageRead(id: string, isRead: boolean) {
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}

// ==========================================
// Settings Actions (إدارة الإعدادات)
// ==========================================

export async function updateSettings(formData: FormData) {
  const entries = Array.from(formData.entries());
  for (const [key, value] of entries) {
    await prisma.setting.upsert({
      where: { id: key },
      update: { value: value as string },
      create: { id: key, value: value as string },
    });
  }
  revalidatePath("/admin/settings");
  revalidatePath("/"); // Refresh public site
}