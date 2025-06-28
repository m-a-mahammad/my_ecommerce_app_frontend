import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Product = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
  description: string;
  image: {
    url: string;
  };
};

type ApiResponse = {
  data: Product[];
};

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [pendingDeletes, setPendingDeletes] = useState<{
    [id: string]: number;
  }>({});

  useEffect(() => {
    axios
      .get<ApiResponse>(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        withCredentials: true,
      })
      .then((res) => {
        setProducts(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ فشل في جلب المنتجات", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (
    id: string,
    field: keyof Product | "image.url",
    value: string | number
  ) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product._id !== id) return product;

        if (field === "image.url") {
          return {
            ...product,
            image: {
              ...product.image,
              url: value as string,
            },
          };
        }

        return {
          ...product,
          [field]: value,
        };
      })
    );
  };

  const handleSave = async (id: string) => {
    const updated = products.find((p) => p._id === id);
    if (!updated) return;

    setSavingId(id);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/products/${id}`,
        updated,
        { withCredentials: true }
      );
      setSaveStatus(id);
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("❌ فشل في الحفظ", err);
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p>⏳ جاري تحميل المنتجات...</p>;

  const initiateDelete = (id: string) => {
    // ابدأ العد التنازلي
    setPendingDeletes((prev) => ({ ...prev, [id]: 10 }));

    const interval = setInterval(() => {
      setPendingDeletes((prev) => {
        if (!prev[id]) {
          clearInterval(interval);
          return prev;
        }

        if (prev[id] === 1) {
          clearInterval(interval);
          confirmDelete(id);
          const updated = { ...prev };
          delete updated[id];
          return updated;
        }

        return { ...prev, [id]: prev[id] - 1 };
      });
    }, 1000);
  };

  const cancelDelete = (id: string) => {
    setPendingDeletes((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const confirmDelete = async (id: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/products/${id}`,
        { withCredentials: true }
      );
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ فشل في حذف المنتج", err);
    }
  };

  return (
    <div className="text-right">
      <h1 className="text-xl font-bold mb-4">📦 إدارة المنتجات</h1>
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product._id}
            className="border p-4 rounded shadow-sm flex justify-between gap-4 items-start"
          >
            {/* preview الصورة */}
            <div className="w-60 h-60">
              {product.image.url ? (
                <img
                  src={product.image.url}
                  alt="Preview"
                  className="object-cover w-full h-full rounded border"
                />
              ) : (
                <div className="bg-gray-100 text-sm text-gray-500 flex items-center justify-center w-full h-full rounded border">
                  لا توجد صورة
                </div>
              )}
            </div>

            {/* البيانات القابلة للتعديل */}
            <div className="flex-1 space-y-2 text-right">
              <div>
                <input
                  className="border rounded px-2 py-1 mr-1"
                  dir="rtl"
                  value={product.name}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    handleChange(product._id, "name", e.target.value)
                  }
                />
                <label className="font-semibold mr-2">:الاسم</label>
              </div>

              <div>
                <input
                  type="number"
                  className="border rounded px-2 py-1 mr-1"
                  value={product.price}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    handleChange(product._id, "price", Number(e.target.value))
                  }
                />
                <label className="font-semibold mr-2">:السعر</label>
              </div>

              <div>
                <input
                  type="number"
                  className="border rounded px-2 py-1 mr-1"
                  value={product.stock}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    handleChange(product._id, "stock", Number(e.target.value))
                  }
                />
                <label className="font-semibold mr-2">:المخزون</label>
              </div>

              <div>
                <input
                  type="text"
                  className="border rounded px-2 py-1 mr-1"
                  value={product.brand}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    handleChange(product._id, "brand", e.target.value)
                  }
                />
                <label className="font-semibold mr-2">:الماركة</label>
              </div>

              <div>
                <input
                  type="text"
                  className="border rounded px-2 py-1 mr-1"
                  value={product.category}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    handleChange(product._id, "category", e.target.value)
                  }
                />
                <label className="font-semibold mr-2">:الفئة</label>
              </div>

              <div>
                <input
                  type="text"
                  className="border rounded px-2 py-1 mr-1"
                  value={product.image.url}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    handleChange(product._id, "image.url", e.target.value)
                  }
                />
                <label className="font-semibold mr-2">:رابط الصورة</label>
              </div>

              <div className="flex align-super justify-end">
                <textarea
                  className="border rounded px-2 py-1 w-100 resize-y mr-1"
                  dir="rtl"
                  rows={6}
                  value={product.description}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    handleChange(product._id, "description", e.target.value)
                  }
                />
                <label className="font-semibold mr-2 mt-1">:الوصف</label>
              </div>

              <div className="flex justify-end mt-2 items-center gap-2">
                {pendingDeletes[product._id] ? (
                  <button
                    onClick={() => cancelDelete(product._id)}
                    className="bg-red-600 text-white px-4 py-1 ml-1 mt-1 rounded cursor-pointer"
                  >
                    ❌ إلغاء ({pendingDeletes[product._id]})
                  </button>
                ) : (
                  <button
                    onClick={() => initiateDelete(product._id)}
                    className="bg-red-600 text-white px-4 py-1 ml-1 mt-1 rounded cursor-pointer"
                  >
                    🗑️ حذف
                  </button>
                )}

                {saveStatus === product._id && (
                  <span className="text-green-600 font-medium">
                    ✅ تم الحفظ
                  </span>
                )}

                <button
                  onClick={() => handleSave(product._id)}
                  className="bg-blue-600 text-white px-4 py-1 ml-1 mt-1 rounded cursor-pointer"
                  disabled={savingId === product._id}
                >
                  💾 حفظ
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to="/dashboard/admin/add-product"
        className="block text-center bg-blue-700 text-white px-4 py-2 my-4 rounded"
      >
        ➕ إضافة منتج
      </Link>
    </div>
  );
};
