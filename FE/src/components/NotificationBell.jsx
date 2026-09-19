import { useState, useRef, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const { isConnected, notifications, markAsRead } = useSocket();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="notif-container" ref={popoverRef}>
      <button
        type="button"
        className={`btn-icon-bell ${unreadCount > 0 ? "has-new" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Thông báo hệ thống"
        aria-label="Thông báo"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        <span
          className={`socket-dot ${isConnected ? "online" : "offline"}`}
          title={
            isConnected
              ? "WebSocket: đã kết nối"
              : "WebSocket: đang chờ kết nối"
          }
        />
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <div className="notif-title-wrap">
              <strong>Thông báo</strong>
              <span
                className={`status-pill ${isConnected ? "online" : "offline"}`}
              >
                {isConnected ? "● Online" : "● Offline"}
              </span>
            </div>
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">Chưa có thông báo mới</div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`notif-item ${n.isRead ? "read" : "unread"}`}
                  onClick={() => {
                    if (!n.isRead) markAsRead(n.id);
                  }}
                  aria-label={`Xem thông báo ${n.title}`}
                >
                  <div className="notif-item-top">
                    <span className="notif-item-title">{n.title}</span>
                    <span className="notif-item-time">{n.time}</span>
                  </div>
                  <div className="notif-item-msg">{n.message}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
