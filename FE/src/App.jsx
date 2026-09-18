import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import POS from "./pages/POPS/POS.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/Orders.jsx";
import Customers from "./pages/Customers.jsx";
import Stock from "./pages/Stock.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./store/AuthContext.jsx";
import NotFound from "./pages/NotFound.jsx";

function HomeRedirect() {
  const { user } = useAuth();

  // 1. Đã đăng nhập và là ADMIN -> Chuyển hướng đến Dashboard
  if (user?.role === "ROLE_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // 2. Chưa đăng nhập HOẶC là CUSTOMER -> Hiển thị trang POS
  return <POS />;
}

function CatchAll() {
  const { token, user } = useAuth();
  return token && user ? <NotFound /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Trang công khai */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Route gốc: Công khai truy cập, điều hướng dựa trên role của user */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Trang bảo vệ: Chỉ dành cho ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/san-pham" element={<Products />} />
          <Route path="/don-hang" element={<Orders />} />
          <Route path="/khach-hang" element={<Customers />} />
          <Route path="/ton-kho" element={<Stock />} />
          <Route path="/bao-cao" element={<Reports />} />
          <Route path="/cai-dat" element={<Settings />} />
        </Route>
      </Route>

      {/* Catch-all cho các route không tồn tại */}
      <Route path="*" element={<CatchAll />} />
    </Routes>
  );
}
