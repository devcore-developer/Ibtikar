"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { encrypt, getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { generateSlug } from "@/lib/utils"; // تم إضافة الاستيراد

// ==========================================
// Auth Actions
// ==========================================
export async function loginAction(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) return false;
  
  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) return false;

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ email: admin.email, expires });
  const cookieStore = await cookies();
  cookieStore.set("session", session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production"
  });
  return true;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}

// ==========================================
// Upload Action (ImgBB)
// ==========================================
export async function uploadImageAction(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Image = buffer.toString("base64");

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      image: base64Image,
    }),
  });

  if (!response.ok) {
    console.error("ImgBB upload error:", await response.text());
    throw new Error("Failed to upload image to ImgBB");
  }

  const data = await response.json();
  return data.data.url; 
}

// ==========================================
// Product Actions
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
      image: formData.get("image") as string || null,
    },
  });
  revalidatePath("/admin/products");
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/spare-parts", "page");
}

export async function toggleProductStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const product = await prisma.product.findUnique({ where: { id } });
  if (product) {
    await prisma.product.update({ where: { id }, data: { isActive: !product.isActive } });
  }
  revalidatePath("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

// ==========================================
// Category Actions
// ==========================================
export async function createCategory(formData: FormData) {
  try {
    const nameEn = formData.get("nameEn") as string;
    let slug = generateSlug(nameEn);
    
    // التأكد من عدم تكرار الـ Slug
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }
    
    await prisma.category.create({
      data: {
        nameAr: formData.get("nameAr") as string,
        nameEn,
        slug,
        descriptionAr: formData.get("descriptionAr") as string || null,
        descriptionEn: formData.get("descriptionEn") as string || null,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");
    revalidatePath("/[locale]/spare-parts", "page");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create category." };
  }
}

// ==========================================
// Technician Actions
// ==========================================
export async function createTechnician(formData: FormData) {
  try {
    const serviceSlugs = (formData.get("serviceSlugs") as string).split(",").map(s => s.trim()).filter(Boolean);
    await prisma.technician.create({
      data: {
        nameAr: formData.get("nameAr") as string,
        nameEn: formData.get("nameEn") as string,
        slug: formData.get("slug") as string,
        specialtyAr: formData.get("specialtyAr") as string,
        specialtyEn: formData.get("specialtyEn") as string,
        experience: formData.get("experience") as string || null,
        phone: formData.get("phone") as string || null,
        bioAr: formData.get("bioAr") as string || null,
        bioEn: formData.get("bioEn") as string || null,
        serviceSlugs,
        image: formData.get("image") as string || null,
      },
    });
    revalidatePath("/admin/technicians");
    revalidatePath("/[locale]/technicians", "page");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create technician." };
  }
}

// ==========================================
// Order Actions
// ==========================================
export async function createOrder(formData: FormData) {
  try {
    const itemsJson = formData.get("items") as string;
    const items = JSON.parse(itemsJson);
    
    const subtotal = parseFloat(formData.get("subtotal") as string);
    const deliveryFee = parseFloat(formData.get("deliveryFee") as string);
    const total = parseFloat(formData.get("total") as string);
    
    const order = await prisma.order.create({
      data: {
        customerName: formData.get("customerName") as string,
        phone: formData.get("phone") as string,
        area: formData.get("area") as string,
        address: formData.get("address") as string,
        notes: formData.get("notes") as string || null,
        subtotal,
        deliveryFee,
        total,
        paymentMethod: formData.get("paymentMethod") as string,
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.nameAr || item.nameEn,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        },
      },
    });
    
    // تحديث صفحة الأدمن لتظهر الطلبات الجديدة فوراً
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${order.id}`);
    
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

// ==========================================
// Maintenance Actions
// ==========================================
export async function updateMaintenanceStatus(id: string, status: string) {
  await prisma.maintenanceRequest.update({ where: { id }, data: { status } });
  revalidatePath("/admin/maintenance");
}

// ==========================================
// Messages Actions
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
// Settings Actions (تغيير الإيميل وكلمة المرور)
// ==========================================
export async function changeEmail(formData: FormData) {
  const session = await getSession();
  if (!session?.email) throw new Error("Not authenticated");

  const sessionEmail = session.email as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newEmail = formData.get("newEmail") as string;

  const admin = await prisma.adminUser.findUnique({ where: { email: sessionEmail } });
  if (!admin) throw new Error("Admin not found");

  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) throw new Error("Current password is incorrect");

  const existing = await prisma.adminUser.findUnique({ where: { email: newEmail } });
  if (existing) throw new Error("Email already in use");

  await prisma.adminUser.update({ where: { id: admin.id }, data: { email: newEmail } });
  
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
  
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const session = await getSession();
  if (!session?.email) throw new Error("Not authenticated");

  const sessionEmail = session.email as string;
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const admin = await prisma.adminUser.findUnique({ where: { email: sessionEmail } });
  if (!admin) throw new Error("Admin not found");

  const isValid = await bcrypt.compare(currentPassword, admin.password);
  if (!isValid) throw new Error("Current password is incorrect");

  const newHash = await bcrypt.hash(newPassword, 10);
  await prisma.adminUser.update({ where: { id: admin.id }, data: { password: newHash } });

  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
  
  return { success: true };
}

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
  revalidatePath("/");
}