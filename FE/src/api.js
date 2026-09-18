import axios from "axios";

const TOKEN_KEY = "access_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error.message),
);

const pageParams = (params = {}) => ({
  page: params.page ?? 1,
  size: params.size ?? 100,
});

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/admin/auth/me"),
};

export const storeApi = {
  getProducts: (params) =>
    api.get("/admin/products", { params: pageParams(params) }),
  saveProduct: (id, product, image) => {
    const formData = new FormData();

    // Thêm tên file "product.json" ở tham số thứ 3 cho Blob
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" }),
      "product.json",
    );

    const imageFile = image?.originFileObj || image;
    if (imageFile instanceof File) {
      formData.append("image", imageFile, imageFile.name);
    }

    return id
      ? api.put(`/admin/products/${id}`, formData)
      : api.post("/admin/products", formData);
  },
  createProduct: (product) => api.post("/admin/products", product),
  updateProduct: (id, product) => api.put(`/admin/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getCustomers: (params) =>
    api.get("/admin/customers", { params: pageParams(params) }),
  createCustomer: (customer) => api.post("/admin/customers", customer),
  updateCustomer: (id, customer) => api.put(`/admin/customers/${id}`, customer),
  deleteCustomer: (id) => api.delete(`/admin/customers/${id}`),
  getOrders: (params) =>
    api.get("/admin/orders", { params: pageParams(params) }),
  createOrder: (order) => api.post("/admin/orders", order),
  cancelOrder: (id) => api.patch(`/admin/orders/${id}/cancel`),
  getStockLogs: (params) =>
    api.get("/admin/stock/logs", { params: pageParams(params) }),
  adjustStock: (adjustment) => api.post("/admin/stock/adjustments", adjustment),
  getSettings: () => api.get("/admin/settings"),
  updateSettings: (settings) => api.put("/admin/settings", settings),
};

export const publicApi = {
  getProducts: (params) =>
    api.get("/public/products", { params: pageParams(params) }),
  createOrder: (order) => api.post("/public/orders", order),
};

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

export default api;
