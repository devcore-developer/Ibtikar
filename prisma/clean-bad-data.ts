import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // حذف أي منتج أو تصنيف يكون الـ slug الخاص به رابطاً (يبدأ بـ http)
  const deletedProducts = await prisma.product.deleteMany({ where: { slug: { startsWith: "http" } } });
  const deletedCategories = await prisma.category.deleteMany({ where: { slug: { startsWith: "http" } } });
  
  console.log(`تم حذف ${deletedProducts.count} منتج سيء، و ${deletedCategories.count} تصنيف سيء.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());