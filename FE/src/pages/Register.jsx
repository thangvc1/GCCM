import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm.jsx";
import { useAuth } from "../store/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async (formData) => {
    setError("");
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => {
        nav("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-mark" style={{ margin: "0 auto 12px" }}>
            CH
          </div>
          <h1>Đăng ký tài khoản</h1>
          <p>Tạo tài khoản nhân viên hoặc quản lý</p>
        </div>

        {error && <div className="alert-box danger">{error}</div>}
        {success && (
          <div className="alert-box success">
            Đăng ký thành công! Đang chuyển hướng sang Đăng nhập...
          </div>
        )}

        <RegisterForm
          onSubmit={handleRegister}
          onSwitchToLogin={() => nav("/login")}
        />
      </div>
    </div>
  );
}
