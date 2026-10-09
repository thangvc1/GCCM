import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { pageResult, storeApi } from "../api.js";

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) return new URL("/ws", window.location.origin).toString();

  const apiUrl = new URL(apiBaseUrl, window.location.origin);
  apiUrl.pathname = apiUrl.pathname.replace(/\/api\/v\d+\/?$/, "/ws");
  apiUrl.search = "";
  apiUrl.hash = "";
  return apiUrl.toString().replace(/\/$/, "");
};

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
      const { items } = pageResult(response);
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
    } catch (error) {
      console.error("Không thể tải thông báo từ máy chủ:", error);
      return [];
    }
  }, []);

  const addNotification = useCallback(
    (data) => {
      const item = normalizeNotification(data);
      setNotifications((prev) => {
        const map = new Map(prev.map((n) => [String(n.id), n]));
        map.set(String(item.id), item);
        return [...map.values()].sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
      });

      onNotificationRef.current?.(item);
    },
    [],
  );

  useEffect(() => {
    loadNotifications();
    let hasConnected = false;
    const token = localStorage.getItem("access_token");
    const client = new Client({
      webSocketFactory: () => new SockJS(getSocketUrl()),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      debug: () => {},
      onConnect: () => {
        setIsConnected(true);
        setIsFallback(false);
        if (hasConnected) loadNotifications();
        hasConnected = true;

        client.subscribe("/topic/admin/notifications", (frame) => {
          try {
            addNotification(JSON.parse(frame.body));
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
    await storeApi.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? { ...item, isRead: true, read: true }
          : item,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await storeApi.markAllNotificationsRead();
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true, read: true })),
    );
  }, []);

  const clearAll = () => setNotifications([]);

  return {
    isConnected,
    isFallback,
    notifications,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
