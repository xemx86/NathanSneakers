"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  size?: string;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, size?: string) => void;
  setQuantity: (productId: string, quantity: number, size?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "kickrush-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((current) => {
      const index = current.findIndex(
        (entry) => entry.productId === item.productId && entry.size === item.size
      );

      if (index >= 0) {
        const copy = [...current];
        copy[index] = {
          ...copy[index],
          quantity: copy[index].quantity + quantity
        };
        return copy;
      }

      return [...current, { ...item, quantity }];
    });
  }

  function removeItem(productId: string, size?: string) {
    setItems((current) =>
      current.filter((entry) => !(entry.productId === productId && entry.size === size))
    );
  }

  function setQuantity(productId: string, quantity: number, size?: string) {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems((current) =>
      current.map((entry) =>
        entry.productId === productId && entry.size === size
          ? { ...entry, quantity }
          : entry
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      clearCart
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
