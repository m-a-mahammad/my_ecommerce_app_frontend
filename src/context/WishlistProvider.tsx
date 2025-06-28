// src/context/CartWishlistProvider.tsx
import { useState, useEffect } from "react";
import { WishlistContext } from "./WishlistContext";

interface Product {
  _id: string;
  name: string;
  image: { url: string };
  price: number;
  brand: string;
  slug: string;
}

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedFav = localStorage.getItem("wishlist");
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedFav) setWishlist(JSON.parse(storedFav));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product) => {
    setCart((prev) =>
      prev.find((p) => p._id === product._id) ? prev : [...prev, product]
    );
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.find((p) => p._id === product._id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p._id !== product._id));
    } else {
      setWishlist((prev) => [...prev, product]);
    }
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((p) => p._id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
