import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { publicApi, storeApi } from "../api";
import { uid } from "../lib/format";
import { useAuth } from "./AuthContext.jsx";

const StoreContext = createContext(null);
const emptyState = {
  settings: { shopName: "", address: "", phone: "", taxRate: 0 },
  products: [],
  customers: [],
  orders: [],
  notifications: [],
  stockLogs: [],
};

const unwrap = (value) => value?.data ?? value;
const collection = (value) => {
  const data = unwrap(value);
  return Array.isArray(data) ? data : data?.items || data?.results || [];
};

export function StoreProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(emptyState);
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = (msg, type = "ok") => {
    const id = uid("t");
    setToasts((items) => [...items, { id, msg, type }]);
    setTimeout(
      () => setToasts((items) => items.filter((item) => item.id !== id)),
      2800,
    );
  };

  const refresh = async () => {
    if (user?.role === "ROLE_CUSTOMER") {
      const products = await publicApi.getProducts({ page: 1, size: 100 });
      setState((current) => ({ ...current, products: collection(products) }));
      return;
    }

    const [products, customers, orders, stockLogs, settings, notifications] =
      await Promise.all([
        storeApi.getProducts(),
        // storeApi.getCustomers(),
        storeApi.getOrders(),
        // storeApi.getStockLogs(),
        // storeApi.getSettings(),
        storeApi.getNotifications({ page: 1, size: 100 }),
      ]);

    setState({
      products: collection(products),
      customers: collection(customers),
      orders: collection(orders),
      notifications: collection(notifications),
      stockLogs: collection(stockLogs),
      settings: unwrap(settings) || emptyState.settings,
    });
  };

  useEffect(() => {
    if (user?.role !== "ROLE_ADMIN") {
      setIsLoading(false);
      return undefined;
    }
    refresh()
      .catch((error) =>
        toast(error?.message || "Không thể tải dữ liệu cửa hàng", "warn"),
      )
      .finally(() => setIsLoading(false));
  }, [user?.role]);

  const api = useMemo(
    () => ({
      saveSettings: async (settings) => {
        await storeApi.updateSettings(settings);
        await refresh();
        toast("Đã lưu cài đặt");
      },
      upsertProduct: async (product) => {
        if (product.id) await storeApi.updateProduct(product.id, product);
        else await storeApi.createProduct(product);
        await refresh();
        toast(product.id ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm");
      },
      // ✅ SỬA: Nhận đủ 3 tham số (id, product, image)
      saveProduct: async (id, product, image) => {
        const savedProduct = await storeApi.saveProduct(id, product, image);
        await refresh();
        toast(id ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm");
        return savedProduct;
      },
      deleteProduct: async (id) => {
        await storeApi.deleteProduct(id);
        await refresh();
        toast("Đã xóa sản phẩm", "warn");
      },
      upsertCustomer: async (customer) => {
        if (customer.id) await storeApi.updateCustomer(customer.id, customer);
        else await storeApi.createCustomer(customer);
        await refresh();
        toast("Đã lưu khách hàng");
      },
      deleteCustomer: async (id) => {
        await storeApi.deleteCustomer(id);
        await refresh();
        toast("Đã xóa khách hàng", "warn");
      },
      checkout: async (order) => {
        if (!order.items.length) {
          toast("Giỏ hàng trống", "warn");
          return null;
        }
        const created = await storeApi.createOrder(order);
        await refresh();
        toast(`Đã tạo ${created?.code || "đơn hàng"}`);
        return created;
      },
      cancelOrder: async (id) => {
        await storeApi.cancelOrder(id);
        await refresh();
        toast("Đã hủy đơn, hoàn kho", "warn");
      },
      adjustStock: async (adjustment) => {
        if (!Number(adjustment.qty)) {
          toast("Số lượng không hợp lệ", "warn");
          return;
        }
        await storeApi.adjustStock(adjustment);
        await refresh();
        toast("Đã cập nhật tồn kho");
      },
    }),
    [], // Bỏ dependency thừa để giữ reference API ổn định
  );

  return (
    <StoreContext.Provider value={{ ...state, ...api, toasts, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be inside StoreProvider");
  return context;
}
