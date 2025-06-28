// pages/dashboard/Profile.jsx

import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

const Profile = () => {
  const { user, updateProfile } = useAuth(); // assume updateProfile يعمل PATCH أو PUT
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(user?.avatar?.url || "");
  const [loading, setLoading] = useState(false);

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
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
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
    </div>
  );
};

export default Profile;
