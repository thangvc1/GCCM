import { useState, useRef, useEffect } from "react";
import { Button, message } from "antd";
import { useSocket } from "../hooks/useSocket";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const { isConnected, notifications, markAsRead, markAllAsRead } = useSocket();
  const [readingIds, setReadingIds] = useState([]);
  const [isReadingAll, setIsReadingAll] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    setReadingIds((ids) => [...ids, id]);
    try {
      await markAsRead(id);
    } catch (error) {
      message.error(error?.message || "Không thể đánh dấu đã đọc");
    } finally {
      setReadingIds((ids) => ids.filter((readingId) => readingId !== id));
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsReadingAll(true);
    try {
      await markAllAsRead();
      message.success("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch (error) {
      message.error(error?.message || "Không thể đánh dấu tất cả đã đọc");
    } finally {
      setIsReadingAll(false);
    }
  };

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
            <Button
              type="link"
              size="small"
              disabled={unreadCount === 0 || isReadingAll}
              loading={isReadingAll}
              onClick={handleMarkAllAsRead}
            >
              Đánh dấu đã đọc tất cả
            </Button>
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
                    if (!n.isRead && !readingIds.includes(n.id)) {
                      handleMarkAsRead(n.id);
                    }
                  }}
                  disabled={readingIds.includes(n.id)}
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
