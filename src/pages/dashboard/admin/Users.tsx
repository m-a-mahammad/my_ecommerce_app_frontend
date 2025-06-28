import { useEffect, useState, useMemo } from "react";
import axios, { AxiosError } from "axios";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type ApiResponse = {
  data: User[];
};

type ApiError = {
  message: string;
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (a.role === "admin" && b.role !== "admin") return -1;
      if (a.role !== "admin" && b.role === "admin") return 1;
      return 0;
    });
  }, [users]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        { withCredentials: true }
      );

      if (!Array.isArray(data.data)) {
        throw new Error("Invalid data format");
      }

      setUsers(data.data);
      setError("");
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setError(error.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: "user" | "admin") => {
    try {
      setUpdatingId(userId);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`,
        { role: newRole },
        { withCredentials: true }
      );
      await fetchUsers(); // Refresh the list
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setError(error.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`,
        { withCredentials: true }
      );
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      setError(error.response?.data?.message || "فشل في حذف المستخدم");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4" dir="rtl">
      <h2 className="text-xl font-bold mb-4">إدارة المستخدمين</h2>

      {sortedUsers.length === 0 ? (
        <p className="text-gray-600">لا يوجد مستخدمون</p>
      ) : (
        <table className="w-full border text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">الاسم</th>
              <th className="p-2">البريد الإلكتروني</th>
              <th className="p-2">الدور</th>
              <th className="p-2">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr
                key={user._id}
                className={`border-t hover:bg-blue-50 ${
                  user.role === "admin" ? "bg-gray-50" : ""
                }`}
              >
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role === "admin" ? "مشرف" : "مستخدم"}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateUserRole(
                          user._id,
                          e.target.value as "user" | "admin"
                        )
                      }
                      disabled={updatingId === user._id}
                      className="border px-2 py-1 rounded disabled:opacity-50"
                    >
                      <option value="user">مستخدم</option>
                      <option value="admin">مشرف</option>
                    </select>

                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-600 text-white border px-2 py-1 rounded disabled:opacity-50 cursor-pointer"
                    >
                      🗑️ حذف
                    </button>

                    {updatingId === user._id && (
                      <span className="text-blue-500 text-sm">
                        ...جاري التحديث
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
