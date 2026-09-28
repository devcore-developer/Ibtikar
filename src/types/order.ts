import { CartItem, DeliveryArea } from "./cart";

export type PaymentMethod = "WAMD" | "CASH_ON_DELIVERY" | "BANK_TRANSFER";

export type OrderItem = CartItem & {
  total: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  area: DeliveryArea;
  address: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: "PENDING";
  createdAt: string;
};