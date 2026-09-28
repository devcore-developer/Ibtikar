"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, DeliveryArea } from "@/types/cart";
import { DEFAULT_DELIVERY_FEES as DELIVERY_FEES } from "@/config/constants";

interface CartContextType {
  items: CartItem[];
  deliveryArea: DeliveryArea;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryArea: (area: DeliveryArea) => void;
  subtotal: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea>("INSIDE");
  const [isInitialized, setIsInitialized] = useState(false);

  // Hydration: Load from localStorage
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("ik_cart_items");
      const storedArea = localStorage.getItem("ik_cart_area") as DeliveryArea;
      if (storedItems) setItems(JSON.parse(storedItems));
      if (storedArea) setDeliveryArea(storedArea);
    } catch (error) {
      console.error("Failed to load cart", error);
    }
    setIsInitialized(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("ik_cart_items", JSON.stringify(items));
      localStorage.setItem("ik_cart_area", deliveryArea);
    }
  }, [items, deliveryArea, isInitialized]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => prev.map(i => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = DELIVERY_FEES[deliveryArea];
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        deliveryArea,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setDeliveryArea,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        isInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}