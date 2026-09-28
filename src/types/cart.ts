export type CartItem = {
  productId: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  price: number;
  image?: string;
  quantity: number;
};

export type DeliveryArea = "INSIDE" | "OUTSIDE";