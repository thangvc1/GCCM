import { useEffect, useRef, useState, useCallback } from "react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Kênh broadcast nội bộ để test realtime giữa các tab/cửa sổ khi chưa chạy server
const localChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("ch_notifications")
    : null;

export function useSocket(onNotification) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "init-1",
      title: "Hệ thống sẵn sàng",
      message: "WebSocket client đã được khởi tạo để nhận thông báo realtime.",
      time: "Vừa xong",
      type: "info",
    },
  ]);

  const addNotification = useCallback(
    (data) => {
      const item = {
        id: data.id || Date.now(),
        title: data.title || "Thông báo mới",
        message: data.message || "Bạn có thông báo mới từ hệ thống",
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        type: data.type || "order",
      };
      setNotifications((prev) => [item, ...prev]);
      onNotification?.(item);
    },
    [onNotification],
  );

  useEffect(() => {
    let socket = null;
    let isMounted = true;

    // Lắng nghe kênh nội bộ fallback
    const handleBroadcast = (e) => {
      if (e.data && isMounted) {
        addNotification(e.data);
      }
    };
    localChannel?.addEventListener("message", handleBroadcast);

    // Thử load socket.io-client dynamically (không làm crash app nếu chưa npm install)
    async function initSocket() {
      try {
        const socketModule = await import(
          /* @vite-ignore */ "socket.io-client"
        );
        const io = socketModule.io || socketModule.default;
        if (!io || !isMounted) return;

        const token = localStorage.getItem("access_token");
        socket = io(SOCKET_URL, {
          auth: { token },
          transports: ["websocket", "polling"],
          reconnectionAttempts: 3,
          timeout: 4000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          if (isMounted) setIsConnected(true);
        });

        socket.on("disconnect", () => {
          if (isMounted) setIsConnected(false);
        });

        socket.on("notification", (data) => {
          if (isMounted) addNotification(data);
        });

        socket.on("connect_error", () => {
          if (isMounted) {
            setIsConnected(false);
            setIsFallback(true);
          }
        });
      } catch {
        // Chưa cài socket.io-client hoặc không load được -> chuyển sang Demo/Fallback mode
        if (isMounted) {
          setIsFallback(true);
          setIsConnected(false);
        }
      }
    }

    initSocket();

    return () => {
      isMounted = false;
      if (socket) socket.disconnect();
      localChannel?.removeEventListener("message", handleBroadcast);
    };
  }, [addNotification]);

  // Hàm bắn thông báo giả lập hoặc gửi qua server
  const sendTestNotification = (customData = {}) => {
    const payload = {
      id: Date.now(),
      title:
        customData.title ||
        "Đơn hàng mới #DH" + Math.floor(1000 + Math.random() * 9000),
      message:
        customData.message || "Khách vừa thanh toán hóa đơn trị giá 150.000đ",
      type: customData.type || "success",
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit("send_message", payload);
    } else {
      // Bắn trực tiếp qua broadcast/state nội bộ
      addNotification(payload);
      localChannel?.postMessage(payload);
    }
  };

  const clearAll = () => setNotifications([]);

  return {
    isConnected,
    isFallback,
    notifications,
    sendTestNotification,
    clearAll,
  };
}
