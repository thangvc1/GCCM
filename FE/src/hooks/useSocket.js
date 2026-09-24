import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { storeApi } from "../api.js";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:8080/ws";

const normalizeNotification = (data) => {
  const payload = data?.payload ?? data?.notification ?? data;
  const createdAt =
    payload?.createdAt ||
    payload?.created_at ||
    data?.createdAt ||
    data?.created_at ||
    new Date().toISOString();

  return {
    ...payload,
    ...data,
    id:
      payload?.id ??
      data?.id ??
      payload?.notificationId ??
      data?.notificationId,
    title:
      payload?.title ??
      data?.title ??
      payload?.subject ??
      data?.subject ??
      "Thông báo mới",
    message:
      payload?.message ??
      data?.message ??
      payload?.content ??
      data?.content ??
      "Bạn có thông báo mới từ hệ thống.",
    type: payload?.type ?? data?.type ?? "info",
    isRead: Boolean(
      payload?.isRead ?? data?.isRead ?? payload?.read ?? data?.read,
    ),
    time:
      payload?.time ??
      data?.time ??
      new Date(createdAt).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
  };
};

export function useSocket(onNotification) {
  const stompClientRef = useRef(null);
  const onNotificationRef = useRef(onNotification);
  const [isConnected, setIsConnected] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await storeApi.getNotifications({ page: 1, size: 100 });
      const items = Array.isArray(response)
        ? response
        : response?.items || response?.results || [];
      const nextNotifications = items.map(normalizeNotification);
      setNotifications((prev) => {
        const prevMap = new Map(prev.map((n) => [String(n.id), n]));
        const nextMap = new Map(
          nextNotifications.map((n) => [String(n.id), n]),
        );
        const merged = new Map([...prevMap, ...nextMap]);
        return [...merged.values()].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
      });
      return nextNotifications;
    } catch {
      setNotifications([]);
      return [];
    }
  }, []);

  const addNotification = useCallback(
    async (data) => {
      const item = normalizeNotification(data);
      setNotifications((prev) => {
        const map = new Map(prev.map((n) => [String(n.id), n]));
        map.set(String(item.id), item);
        return [...map.values()].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
      });

      onNotificationRef.current?.(item);

      // Chỉ refetch sau 500-800ms để tránh race-condition với backend vừa lưu xong.
      window.setTimeout(() => {
        loadNotifications();
      }, 800);
    },
    [loadNotifications],
  );

  useEffect(() => {
    loadNotifications();

    const token = localStorage.getItem("access_token");
    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        setIsConnected(true);
        setIsFallback(false);
        loadNotifications();

        const subscriptions = [
          "/topic/admin/notifications",
          "/user/queue/notifications",
        ];

        subscriptions.forEach((destination) => {
          try {
            client.subscribe(destination, (frame) => {
              try {
                const message = JSON.parse(frame.body);
                addNotification(message);
              } catch {
                addNotification({
                  id: Date.now(),
                  title: "Thông báo mới",
                  message: frame.body,
                  type: "info",
                  isRead: false,
                  createdAt: new Date().toISOString(),
                });
              }
            });
          } catch {
            // no-op
          }
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: () => {
        setIsConnected(false);
        setIsFallback(true);
      },
      onWebSocketError: () => {
        setIsConnected(false);
        setIsFallback(true);
      },
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [loadNotifications, addNotification]);

  const markAsRead = useCallback(async (id) => {
    if (!id) return;
    try {
      await storeApi.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true, read: true } : item,
        ),
      );
    } catch {
      // no-op
    }
  }, []);

  const clearAll = () => setNotifications([]);

  return {
    isConnected,
    isFallback,
    notifications,
    loadNotifications,
    markAsRead,
    clearAll,
  };
}
