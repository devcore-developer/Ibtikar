import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/spare-parts", "/maintenance", "/technicians", "/contact"].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const [categories, products, technicians] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true } }),
    prisma.product.findMany({ where: { isActive: true } }),
    prisma.technician.findMany({ where: { isActive: true } }),
  ]);

  const categoryRoutes = categories.map((c: any) => ({
    url: `${SITE_URL}/spare-parts/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productRoutes = products.map((p: any) => ({
    url: `${SITE_URL}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const techRoutes = technicians.map((t: any) => ({
    url: `${SITE_URL}/technicians/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...techRoutes];
}