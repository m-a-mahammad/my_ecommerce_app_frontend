// pages/dashboard/Profile.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(user?.image?.url || "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    await updateProfile(formData);
    setLoading(false);
  };

  const handleImageDelete = async () => {
    try {
      setDeleting(true);

      await fetch("/api/me", {
        method: "DELETE",

        credentials: "include",
      });

      setImage(null);

      setPreview("");
    } catch (err) {
      console.error("فشل في حذف الصورة", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">👤 تعديل الملف الشخصي</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">الاسم</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">الصورة الشخصية</label>
          {preview ? (
            <div className="mb-2">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />

              <button
                type="button"
                onClick={handleImageDelete}
                className="text-sm text-red-600 underline disabled:text-gray-400"
                disabled={deleting}
              >
                {deleting ? "جارٍ الحذف..." : "حذف الصورة"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">لا توجد صورة حالياً</p>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
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
