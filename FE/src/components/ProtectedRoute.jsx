import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import NotFound from "../pages/NotFound.jsx";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, token, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <div className="empty">Đang tải dữ liệu...</div>;
  }

  // Chưa đăng nhập -> Chuyển về /login và lưu lại trang đang truy cập
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <NotFound />;
  }

  return <Outlet />;
}
