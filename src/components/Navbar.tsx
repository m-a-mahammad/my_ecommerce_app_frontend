// Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiUserPlus,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiHeart,
  FiShoppingCart,
} from "react-icons/fi"; // أيقونات

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("user");
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("فشل في تسجيل الخروج:", err);
    }
  };

  return (
    <nav className="flex w-screen items-center justify-between p-4 bg-gray-100 border-b">
      <Link to="/" className="text-xl font-bold">
        المتجر
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to="/dashboard/profile"
              title="الملف الشخصي"
              className="hover:text-blue-600"
            >
              <FiUser size={22} />
            </Link>

            <Link to="/dashboard/wishlist" title="المفضلة">
              <FiHeart size={20} className="hover:text-yellow-500" />
            </Link>

            <Link to="/dashboard/cart" title="السلة">
              <FiShoppingCart size={20} className="hover:text-green-600" />
            </Link>

            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              className="hover:text-red-600"
            >
              <FiLogOut size={22} />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              title="إنشاء حساب جديد"
              className="hover:text-green-600"
            >
              <FiUserPlus size={22} />
            </Link>
            <Link
              to="/login"
              title="تسجيل الدخول"
              className="hover:text-blue-600"
            >
              <FiLogIn size={22} />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
