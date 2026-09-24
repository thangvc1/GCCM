import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import { useAuth } from "../store/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (formData) => {
    setError("");
    try {
      const response = await login(formData);
      const role = response?.role || response?.user?.role;
      nav(role === "ROLE_ADMIN" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-mark" style={{ margin: "0 auto 12px" }}>
            <img
              src="/dist/img/logo.jpg"
              alt="Thảm Bê Tông Việt Nam"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "inherit",
                display: "block",
              }}
            />
          </div>
          <h1>Đăng nhập hệ thống</h1>
          <p>Thảm Bê Tông Việt Nam</p>
        </div>

        {error && <div className="alert-box danger">{error}</div>}

        <LoginForm
          onSubmit={handleLogin}
          onSwitchToRegister={() => nav("/register")}
        />
      </div>
    </div>
  );
}
