import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ebtekar.com";
  const adminPass = process.env.ADMIN_PASSWORD || "Admin@123";
  
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashedPass = await bcrypt.hash(adminPass, 10);
    await prisma.adminUser.create({
      data: { email: adminEmail, password: hashedPass }
    });
    console.log("Admin user created");
  }

  // 2. Seed Default Categories
  const categories = [
    { nameAr: "قطع غيار ثلاجات", nameEn: "Refrigerator Parts", slug: "refrigerators" },
    { nameAr: "قطع غيار غسالات", nameEn: "Washing Machine Parts", slug: "washing-machines" },
    { nameAr: "قطع غيار مكيفات", nameEn: "Air Conditioner Parts", slug: "air-conditioners" },
    { nameAr: "قطع غيار مكانس", nameEn: "Vacuum Cleaner Parts", slug: "vacuum-cleaners" },
    { nameAr: "قطع غيار طبخ", nameEn: "Cooker Parts", slug: "cookers" },
    { nameAr: "قطع غيار أخرى", nameEn: "Other Parts", slug: "other-parts" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Default categories ensured");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());