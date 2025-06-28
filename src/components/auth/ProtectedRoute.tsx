// components/ProtectedRoute.jsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // hook بيجيب user من السياق أو localStorage

type Props = {
  allowedRoles: string[];
};

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    console.log("⏳ جاري تحميل المستخدم...");
    return null; // أو Spinner مؤقت
  }

  // مش مسجل دخول أصلاً
  if (!user) return <Navigate to="/login" replace />;

  // لو حدّدنا صلاحيات (roles) و المستخدم مش ضمنها
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  console.log("✅ المستخدم:", user);

  // ✅ وصل للصفحة عادي
  return <Outlet />;
};

export default ProtectedRoute;
