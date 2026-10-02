"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { encrypt, getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { generateSlug } from "@/lib/utils";

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
export async function deleteCategory(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await prisma.category.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete category:", error);
    // إذا فشل الحذف (مثلاً لأن التصنيف يحتوي على منتجات)، سيتم تسجيل الخطأ هنا
  }
  // تحديث الصفحات ليعكس التغيير فوراً
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");
  revalidatePath("/[locale]/spare-parts", "page");
}

// ==========================================
// Technician Actions
// ==========================================
export async function createTechnician(formData: FormData) {
  try {
    const nameEn = formData.get("nameEn") as string;
    let slug = generateSlug(nameEn);
    
    // التأكد من عدم تكرار الـ Slug
    const existing = await prisma.technician.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const serviceSlugs = (formData.get("serviceSlugs") as string).split(",").map(s => s.trim()).filter(Boolean);
    
    await prisma.technician.create({
      data: {
        nameAr: formData.get("nameAr") as string,
        nameEn,
        slug, // يتم توليده تلقائياً هنا
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
export async function deleteTechnician(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await prisma.technician.delete({ where: { id } });
  } catch (error) {
    console.error("Failed to delete technician:", error);
  }
  revalidatePath("/admin/technicians");
  revalidatePath("/[locale]/technicians", "page");
}

export async function updateTechnicianAction(formData: FormData) {
  const id = formData.get("id") as string;
  const serviceSlugs = (formData.get("serviceSlugs") as string).split(",").map(s => s.trim()).filter(Boolean);
  
  await prisma.technician.update({
    where: { id },
    data: {
      nameAr: formData.get("nameAr") as string,
      nameEn: formData.get("nameEn") as string,
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
    const paymentMethod = formData.get("paymentMethod") as string;
    const paymentProofUrl = formData.get("paymentProofUrl") as string;

    // Server-side validation for payment proof
    if (paymentMethod !== "CASH_ON_DELIVERY" && !paymentProofUrl) {
      return { success: false, error: "Payment proof is required for WAMD or Bank Transfer." };
    }

    const paymentStatus = paymentMethod === "CASH_ON_DELIVERY" ? "UNPAID" : "PROOF_SUBMITTED";
    
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
        paymentMethod,
        paymentStatus,
        paymentProofUrl: paymentProofUrl || null,
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

export async function verifyPaymentAction(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("paymentStatus") as string; // VERIFIED or REJECTED
  
  await prisma.order.update({
    where: { id },
    data: { paymentStatus: status }
  });
  
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
export async function markMessageRead(formData: FormData) {
  const id = formData.get("id") as string;
  const isRead = formData.get("isRead") === "true";
  await prisma.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}

// ==========================================
// Settings Actions
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
  revalidatePath("/[locale]/checkout", "page");
  revalidatePath("/");
}

// ==========================================
// Public Form Actions (حفظ طلبات الصيانة والرسائل)
// ==========================================
export async function createMaintenanceRequest(formData: FormData) {
  await prisma.maintenanceRequest.create({
    data: {
      customerName: formData.get("name") as string,
      phone: formData.get("phone") as string,
      area: formData.get("area") as string || "N/A",
      address: formData.get("address") as string || "N/A",
      applianceType: formData.get("applianceType") as string,
      serviceId: formData.get("serviceRequired") as string,
      brand: formData.get("brand") as string || null,
      model: formData.get("model") as string || null,
      problemDescription: formData.get("problemDescription") as string || null,
      preferredContactTime: formData.get("preferredTime") as string || null,
      notes: formData.get("notes") as string || null,
      status: "PENDING",
    },
  });
  revalidatePath("/admin/maintenance");
  return { success: true };
}

export async function createContactMessage(formData: FormData) {
  await prisma.contactMessage.create({
    data: {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string || null,
      subject: formData.get("subject") as string || null,
      message: formData.get("message") as string,
      isRead: false,
    },
  });
  revalidatePath("/admin/messages");
  return { success: true };
}