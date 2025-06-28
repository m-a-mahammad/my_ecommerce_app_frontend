// src/context/CartWishlistContext.ts
import { createContext, useContext } from "react";

interface Product {
  _id: string;
  name: string;
  image: { url: string };
  price: number;
  brand: string;
  slug: string;
}

interface WishlistContextType {
  cart: Product[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | null>(null);

export const useCartWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error(
      "useCartWishlist must be used within a CartWishlistProvider"
    );
  return context;
};
