import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  image: { url: string };
  price: number;
  brand: string;
  slug: string;
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/wishlist`,
        {
          withCredentials: true,
        }
      );

      // استخرج المنتجات فقط من كل عنصر
      const products = data.map((item: { product: Product }) => item.product);
      setWishlist(products);
    } catch (err) {
      console.error("فشل تحميل المفضلة:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    console.log(productId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/wishlist/${productId}`,
        {
          withCredentials: true,
        }
      );
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("فشل الحذف من المفضلة:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <p className="p-6">جاري تحميل المفضلة...</p>;

  if (wishlist.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">💖 مفيش منتجات في المفضلة</h2>
        <Link to="/" className="text-blue-600 underline">
          ارجع للسوق واستعرض المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-right flex flex-col justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center">💖 المفضلة</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        dir="rtl"
      >
        {wishlist.map((item) => (
          <div
            key={item._id}
            className="border p-4 rounded shadow hover:shadow-md transition"
          >
            <Link to={`/product/${item.slug}`}>
              <img
                src={item.image?.url}
                alt={item.name}
                className="w-full h-40 object-contain rounded mb-2"
              />
              <h3 className="font-semibold text-lg" dir="rtl">
                {item.name}
              </h3>
              <p className="text-gray-600">
                {item.price?.toLocaleString("ar-EG")} جنيه
              </p>
            </Link>

            <button
              onClick={() => removeFromWishlist(item._id)}
              className="mt-3 text-red-500 flex items-center gap-1 hover:underline"
            >
              <FaTrash /> إزالة من المفضلة
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
