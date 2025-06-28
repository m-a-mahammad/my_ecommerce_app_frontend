// pages/Dashboard/index.jsx

import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaHeart,
  FaShoppingCart,
  FaUsers,
  FaTools,
} from "react-icons/fa";

const DashboardHome = () => {
  const { user } = useAuth();

  if (!user) return <p>جارٍ التحميل...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">مرحبًا، {user.name} 👋</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ✅ صلاحيات المستخدم العادي */}
        {user.role === "user" && (
          <>
            <Link to="/dashboard/profile" className="card">
              <FaUserCircle /> الملف الشخصي
            </Link>
            <Link to="/dashboard/wishlist" className="card">
              <FaHeart /> المفضلة
            </Link>
            <Link to="/dashboard/cart" className="card">
              <FaShoppingCart /> السلة
            </Link>
          </>
        )}

        {/* 🔐 صلاحيات المشرف */}
        {user.role === "admin" && (
          <>
            <Link to="/dashboard/admin/users" className="card">
              <FaUsers /> إدارة المستخدمين
            </Link>
            <Link to="/dashboard/admin/products" className="card">
              <FaTools /> إدارة المنتجات
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
