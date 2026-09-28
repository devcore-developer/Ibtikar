import { prisma } from "@/lib/prisma";
import { DEFAULT_DELIVERY_FEES } from "./constants";

export async function getDeliveryFees() {
  try {
    const settings = await prisma.setting.findMany();
    const inside = settings.find((s: any) => s.id === "delivery_inside");
    const outside = settings.find((s: any) => s.id === "delivery_outside");
    
    return {
      INSIDE: inside ? parseFloat(inside.value) : DEFAULT_DELIVERY_FEES.INSIDE,
      OUTSIDE: outside ? parseFloat(outside.value) : DEFAULT_DELIVERY_FEES.OUTSIDE,
    };
  } catch (error) {
    return DEFAULT_DELIVERY_FEES;
  }
}