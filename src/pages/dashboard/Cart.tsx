import { useEffect, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { Link } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const { cartItems, updateQty, removeFromCart } = useCart();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🧮 دالة حساب الإجمالي من الباك إند
  const fetchTotal = async () => {
    try {
      const items = cartItems.map(({ _id, quantity }) => ({ _id, quantity }));
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/total`,
        { items },
        { withCredentials: true }
      );
      setTotal(data.total);
    } catch (err) {
      console.error("فشل في حساب الإجمالي:", err);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 حساب المجموع عند كل تعديل للسلة
  useEffect(() => {
    if (cartItems.length > 0) {
      fetchTotal();
    } else {
      setTotal(0);
      setLoading(false);
    }
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">🛒 سلتك فاضية حاليًا</h2>
        <Link to="/" className="text-blue-600 underline">
          استكمل التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto" dir="rtl">
      <h2 className="text-2xl font-bold mb-4">🛒 سلة التسوق</h2>

      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between border-b py-2"
        >
          <div className="flex gap-4 items-center">
            <img
              src={item.image?.url}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <Link
                to={`/product/${item.slug}`}
                className="font-semibold text-gray-800 hover:underline"
              >
                {item.name}
              </Link>
              <p className="text-sm text-gray-500">
                السعر للوحدة: {item.price.toLocaleString("ar-EG")} جنيه
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={async (e) => {
                const newQty = +e.target.value;
                updateQty(item._id, newQty);
                fetchTotal(); // 🔁 حدث المجموع فورًا
              }}
              className="w-14 border px-1 py-0.5 rounded text-center"
            />
            <button onClick={() => removeFromCart(item._id)} className="cursor-pointer">
              ❌ إزالة من السلة
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 text-right">
        <h3 className="text-lg font-bold">
          الإجمالي:{" "}
          {loading ? "جاري الحساب" : `${total.toLocaleString("ar-EG")} جنيه`}
        </h3>
        <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
          <Link to={`/checkout/payment`}>
          إتمام الطلب
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Cart;
