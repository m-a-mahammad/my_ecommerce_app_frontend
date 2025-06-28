import { useEffect, useState } from "react";
import { CartContext, type CartItem } from "./CartContext";
import axios from "axios";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 📦 تحميل السلة من الباك إند
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cart`,
          { withCredentials: true }
        );

        interface ServerCartItem {
          product: {
            _id: string;
            name: string;
            price: number;
            slug: string;
            image?: { url: string };
          };
          quantity: number;
        }

        const formatted = data.items.map((item: ServerCartItem) => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          slug: item.product.slug,
          image: item.product.image,
          quantity: item.quantity,
        }));

        setCartItems(formatted);
      } catch (err) {
        console.error("فشل تحميل السلة:", err);
      }
    };

    fetchCart();
  }, []);

  // ➕ إضافة للسلة (وتحديث لو موجود)
  const addToCart = async (item: CartItem) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { productId: item._id, quantity: item.quantity },
        { withCredentials: true }
      );

      setCartItems((prev) => {
        const exists = prev.find((p) => p._id === item._id);
        if (exists) {
          return prev.map((p) =>
            p._id === item._id
              ? { ...p, quantity: p.quantity + item.quantity }
              : p
          );
        }
        return [...prev, item];
      });
    } catch (err) {
      console.error("فشل في الإضافة للسلة:", err);
    }
  };

  // 🔄 تحديث الكمية
  const updateQty = async (id: string, qty: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { productId: id, quantity: qty },
        { withCredentials: true }
      );

      setCartItems((prev) => {
        const updated = prev.map((item) =>
          item._id === id ? { ...item, quantity: qty } : item
        );
        return [...updated]; // تغيير المرجع لضمان تحديث useEffect
      });
    } catch (err) {
      console.error("فشل في تحديث الكمية:", err);
    }
  };

  // ❌ حذف من السلة
  const removeFromCart = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${id}`, {
        withCredentials: true,
      });

      setCartItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("فشل في حذف العنصر من السلة:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQty, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
