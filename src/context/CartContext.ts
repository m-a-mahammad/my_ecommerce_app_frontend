// src/context/CartContext.ts

import { createContext } from "react";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: { url: string };
  slug: string; // ✅ أضف ده
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
};

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {
    throw new Error("CartContext not provided");
  },
  updateQty: () => {
    throw new Error("CartContext not provided");
  },
  removeFromCart: () => {
    throw new Error("CartContext not provided");
  },
});
