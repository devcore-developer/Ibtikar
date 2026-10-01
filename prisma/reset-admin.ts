import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@ebtekar.com";
  const password = "Admin@123";
  
  const hash = await bcrypt.hash(password, 10);
  
  await prisma.adminUser.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash },
  });
  
  console.log("تم تعيين كلمة المرور بنجاح: Admin@123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());