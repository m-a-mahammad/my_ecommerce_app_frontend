// pages/dashboard/Profile.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(
    `${import.meta.env.VITE_FRONTEND_API_URL}/avatars/luffy.png`
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user?.image?.url && !image) {
      setPreview(user.image.url);
    }
  }, [user, image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // ✅ يظهر فورًا
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);
    console.log("🖼️ ملف مرسل:", image);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/me`, formData, {
        withCredentials: true,
      });
      await updateProfile(formData);
      setImage(null);
      setLoading(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        alert(err.response.data.error); // أو toast
      } else {
        console.error("خطأ غير متوقع", err);
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      setDeleting(true);

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        withCredentials: true,
      });

      setImage(null);
      setPreview(`${import.meta.env.VITE_FRONTEND_API_URL}/avatars/luffy.png`);
    } catch (err) {
      console.error("فشل في حذف الصورة", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        👤 تعديل الملف الشخصي
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col ">
        <div>
          <label className="block mb-1 font-medium text-center">الاسم</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-center"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-center">
            الصورة الشخصية
          </label>
          {preview ? (
            <div className="mb-2 flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500">لا توجد صورة حالياً</p>
          )}
          <div className="flex align-middle justify-center items-start gap-2">
            <button
              type="button"
              onClick={handleImageDelete}
              className="flex px-4 py-2 bg-red-200 text-sm rounded hover:bg-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed !cursor-no-drop"
              disabled={
                preview ===
                  `${import.meta.env.VITE_FRONTEND_API_URL}/avatars/luffy.png`
              }
            >
              {deleting ? "جارٍ الحذف..." : "حذف الصورة"}
            </button>

            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <label
              htmlFor="profileImage"
              className="flex cursor-pointer px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 transition"
            >
              تعديل الصورة
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
      </form>

      {user?.role === "admin" && (
        <div className="mt-6 space-y-2">
          <Link
            to="/dashboard/admin/products"
            className="block text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            إدارة المنتجات
          </Link>
          <Link
            to="/dashboard/admin/users"
            className="block text-center bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            إدارة المستخدمين
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
