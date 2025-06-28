// src/pages/Home.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  _id: string;
  name: string;
  image: { url: string };
  price: number;
  brand: string;
  slug: string;
}

interface WishlistItem {
  product: {
    _id: string;
    // ممكن تضيف خصائص تانية حسب الحاجة
  };
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);

  const isInWishlist = (id: string) => wishlist.includes(id.toString());

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          withCredentials: true,
        }
      );
      setWishlist(data.map((item: WishlistItem) => item.product._id));
    } catch (err) {
      console.error("فشل تحميل المفضلة:", err);
    }
  };

  const toggleWishlist = async (product: Product) => {
    try {
      const exists = isInWishlist(product._id);

      if (exists) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/wishlist/${product._id}`,
          {
            withCredentials: true,
          }
        );
        setWishlist((prev) => prev.filter((id) => id !== product._id));
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/wishlist`,
          { productId: product._id },
          { withCredentials: true }
        );
        setWishlist((prev) => [...prev, product._id]);
      }
    } catch (err) {
      console.error("فشل التبديل في المفضلة:", err);
    }
  };

  const isInCart = (id: string) => cartItems.some((item) => item._id === id);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          withCredentials: true,
        }
      );
      setProducts(data);
    } catch (err) {
      console.error("فشل تحميل المنتجات:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 text-right">
      <h1 className="text-3xl font-bold mb-6 text-center">المنتجات المميزة</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))
          : products.map((product) => (
              <Card
                key={product._id}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.image?.url}
                    alt={product.name}
                    className="h-48 w-full object-contain rounded-t"
                  />
                  <CardHeader>
                    <CardTitle className="text-lg text-center" dir="rtl">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                </Link>

                <CardContent>
                  <p className="text-sm text-gray-700 font-semibold" dir="rtl">
                    الماركة: {product.brand}
                  </p>
                  <p className="text-green-600 font-semibold mt-1" dir="rtl">
                    السعر: {product.price.toLocaleString("ar-EG")} جنيه
                  </p>

                  <div className="flex justify-between items-center mt-4 gap-2">
                    <button
                      onClick={() =>
                        isInCart(product._id)
                          ? removeFromCart(product._id)
                          : addToCart({ ...product, quantity: 1 })
                      }
                      className={`flex-1 text-sm py-1.5 px-2 rounded transition ${
                        isInCart(product._id)
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {isInCart(product._id)
                        ? "❌ إزالة من السلة"
                        : "🛒 أضف للسلة"}
                    </button>

                    <button
                      onClick={() => toggleWishlist(product)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-red-500 hover:bg-red-50 transition"
                      title={
                        isInWishlist(product._id)
                          ? "إزالة من المفضلة"
                          : "أضف إلى المفضلة"
                      }
                    >
                      {isInWishlist(product._id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Home;
