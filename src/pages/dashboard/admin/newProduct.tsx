import { useState } from "react";
import axios from "axios";

export const NewProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
    image: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("📦 البيانات اللي هتتبعت:", form);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products`,
        {
          name: form.name,
          description: form.description,
          price: Number(form.price),
          brand: form.brand,
          category: form.category,
          stock: Number(form.stock),
          image: { url: form.image },
        },
        { withCredentials: true }
      );
      setSuccess(true);
      setForm({
        name: "",
        description: "",
        price: "",
        brand: "",
        category: "",
        stock: "",
        image: "",
      });
    } catch (err) {
      console.error("❌ فشل في إضافة المنتج", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded mt-6 text-right">
      <h2 className="text-2xl font-bold mb-4">➕ إضافة منتج جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-3" dir="rtl">
        <input
          name="name"
          className="w-full border px-2 py-1 rounded"
          placeholder="اسم المنتج"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          dir="rtl"
          className="w-full border px-2 py-1 rounded resize-y"
          placeholder="وصف المنتج"
          value={form.description}
          onChange={handleChange}
          onFocus={(e) => e.target.select()}
          required
        />
        <input
          name="price"
          type="number"
          className="w-full border px-2 py-1 rounded"
          placeholder="السعر"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="brand"
          className="w-full border px-2 py-1 rounded"
          placeholder="العلامة التجارية"
          value={form.brand}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          className="w-full border px-2 py-1 rounded"
          placeholder="الفئة (مثل: إلكترونيات)"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          name="stock"
          type="number"
          className="w-full border px-2 py-1 rounded"
          placeholder="الكمية المتوفرة"
          value={form.stock}
          onChange={handleChange}
          required
        />
        <input
          name="image"
          type="text"
          className="w-full border px-2 py-1 rounded"
          placeholder="رابط الصورة"
          value={form.image}
          onChange={handleChange}
          onFocus={(e) => e.target.select()}
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          💾 إضافة المنتج
        </button>

        {success && (
          <p className="text-green-600 font-medium mt-2">
            ✅ تم إضافة المنتج بنجاح
          </p>
        )}
      </form>
    </div>
  );
};
