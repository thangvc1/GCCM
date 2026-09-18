import { useState, useRef, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const popoverRef = useRef(null);

  const {
    isConnected,
    isFallback,
    notifications,
    sendTestNotification,
    clearAll,
  } = useSocket(() => {
    setHasNew(true);
  });

  // Đóng khi click ngoài
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

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasNew(false);
  };

  return (
    <div className="notif-container" ref={popoverRef}>
      <button
        type="button"
        className={`btn-icon-bell ${hasNew ? "has-new" : ""}`}
        onClick={toggleOpen}
        title="Thông báo hệ thống (WebSocket)"
        aria-label="Thông báo"
      >
        <span className="bell-icon">🔔</span>
        {notifications.length > 0 && (
          <span className="notif-badge">{notifications.length}</span>
        )}
        <span
          className={`socket-dot ${isConnected ? "online" : isFallback ? "demo" : "offline"}`}
          title={
            isConnected
              ? "WebSocket: Đã kết nối Server (Port 5000)"
              : "WebSocket: Đang ở chế độ Test nội bộ"
          }
        />
      </button>

      {isOpen && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <div className="notif-title-wrap">
              <strong>Thông báo Realtime</strong>
              <span
                className={`status-pill ${isConnected ? "online" : "demo"}`}
              >
                {isConnected ? "● Socket Online" : "● Test Mode"}
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                type="button"
                className="link-btn text-muted"
                onClick={clearAll}
              >
                Xóa tất cả
              </button>
            )}
          </div>

          <div className="notif-actions">
            <button
              type="button"
              className="btn-trigger-test"
              onClick={() => sendTestNotification()}
            >
              + Bắn thông báo thử (Test Notification)
            </button>
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">Chưa có thông báo mới nào</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="notif-item">
                  <div className="notif-item-top">
                    <span className="notif-item-title">{n.title}</span>
                    <span className="notif-item-time">{n.time}</span>
                  </div>
                  <div className="notif-item-msg">{n.message}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
