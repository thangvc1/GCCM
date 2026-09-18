import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useStore } from "../store/StoreContext.jsx";
import { useAuth } from "../store/AuthContext.jsx";
import { fmtDay } from "../lib/format.js";
import NotificationBell from "./NotificationBell.jsx";

const links = [
  { to: "/dashboard", label: "Tổng quan", ico: "▦" },
  { to: "/san-pham", label: "Sản phẩm", ico: "▣" },
  { to: "/don-hang", label: "Đơn hàng", ico: "▤" },
  { to: "/khach-hang", label: "Khách hàng", ico: "☺" },
  { to: "/ton-kho", label: "Tồn kho", ico: "▦" },
  { to: "/bao-cao", label: "Báo cáo", ico: "↗" },
  { to: "/cai-dat", label: "Cài đặt", ico: "⚙" },
];

export default function Layout() {
  const { settings, products, toasts } = useStore();
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const low = products.filter((p) => p.stock <= p.minStock).length;

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  const searchGo = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    nav(`/san-pham?q=${encodeURIComponent(query)}`);
    setQ("");
  };

  const today = useMemo(() => fmtDay(new Date()), []);

  return (
    <div className="app">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">CH</div>
          <div>
            <div className="brand-name">{settings.shopName}</div>
            <div className="brand-sub">Quản lý bán lẻ</div>
          </div>
        </div>
        <nav className="nav" onClick={() => setOpen(false)}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="nav-ico">{l.ico}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="user-profile-box">
            <div className="user-profile-info">
              <div className="user-avatar">
                {(user?.fullName ||
                  user?.name ||
                  user?.username ||
                  "A")[0].toUpperCase()}
              </div>
              <div className="user-details">
                <div className="user-name">
                  {user?.fullName ||
                    user?.name ||
                    user?.username ||
                    "Tài khoản"}
                </div>
                <div className="user-role-badge">
                  {user?.role === "admin"
                    ? "Quản trị viên"
                    : user?.role === "inventory"
                      ? "Thủ kho"
                      : "Thu ngân"}
                </div>
              </div>
            </div>
            <button
              className="btn-logout"
              onClick={handleLogout}
              title="Đăng xuất khỏi hệ thống"
            >
              <span>Đăng xuất</span>
              <span className="logout-ico">⎋</span>
            </button>
          </div>
          <div className="today-chip">
            Hôm nay: <strong>{today}</strong>
          </div>
        </div>
      </aside>
      <div
        className={`overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />
      <div className="main">
        <header className="topbar">
          <button
            className="menu-btn"
            onClick={() => setOpen(true)}
            aria-label="Menu"
          >
            ☰
          </button>
          <form className="search-wrap" onSubmit={searchGo}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm sản phẩm rồi Enter…"
            />
          </form>
          <div className="top-actions">
            <NotificationBell />
            <span className={`pill ${low ? "" : "ok"}`}>
              {low ? `${low} SP sắp hết` : "Kho ổn định"}
            </span>

            <button
              className="btn btn-outline-danger btn-logout-top"
              onClick={handleLogout}
              title="Đăng xuất"
            >
              Đăng xuất ⎋
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
