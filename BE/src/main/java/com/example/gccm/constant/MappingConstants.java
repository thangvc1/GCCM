package com.example.gccm.constant;

public class MappingConstants {

    /* ==============================================================
     * 1. TIỀN TỐ CƠ BẢN (VERSION & ROLE)
     * ============================================================== */
    public static final String API_VERSION_PREFIX = "/api/v1";

    public static final String ADMIN = "/admin";
    public static final String CUSTOMER = "/customer";
    public static final String PUBLIC = "/public"; // API không cần đăng nhập

    /* ==============================================================
     * 2. ĐƯỜNG DẪN CƠ SỞ THEO ROLE
     * ============================================================== */
    public static final String API_ADMIN_PREFIX = API_VERSION_PREFIX + ADMIN;
    public static final String API_CUSTOMER_PREFIX = API_VERSION_PREFIX + CUSTOMER;
    public static final String API_PUBLIC_PREFIX = API_VERSION_PREFIX + PUBLIC;

    /* ==============================================================
     * 3. XÁC THỰC (AUTHENTICATION)
     * ============================================================== */
    public static final String API_AUTH_PREFIX = API_VERSION_PREFIX + "/auth";
    public static final String API_AUTH_LOGIN = API_AUTH_PREFIX + "/login";
    public static final String API_AUTH_REGISTER = API_AUTH_PREFIX + "/register";

    /* ==============================================================
     * 4. QUẢN TRỊ (ADMIN) - DÀNH CHO CÔNG TY
     * ============================================================== */
    // Quản lý kho thảm GCCM
    public static final String API_ADMIN_PRODUCTS = API_ADMIN_PREFIX + "/products";
    public static final String API_ADMIN_PRODUCTS_CATEGORY = API_ADMIN_PRODUCTS + "/categories";

    // Quản lý Đơn hàng & Hóa đơn
    public static final String API_ADMIN_ORDERS = API_ADMIN_PREFIX + "/orders";
    public static final String API_ADMIN_INVOICES = API_ADMIN_PREFIX + "/invoices";

    // Quản lý Khách hàng
    public static final String API_ADMIN_CUSTOMERS = API_ADMIN_PREFIX + "/customers";

    // Thống kê doanh thu
    public static final String API_ADMIN_STATISTICS = API_ADMIN_PREFIX + "/statistics";

    // Quản lý Thông báo (MỚI THÊM)
    public static final String API_ADMIN_NOTIFICATIONS = API_ADMIN_PREFIX + "/notifications";

    /* ==============================================================
     * 5. KHÁCH HÀNG (CUSTOMER)
     * ============================================================== */
    // Đặt hàng online
    public static final String API_CUSTOMER_CART = API_CUSTOMER_PREFIX + "/cart";
    public static final String API_CUSTOMER_ORDERS = API_CUSTOMER_PREFIX + "/orders";

    // Quản lý địa chỉ giao hàng
    public static final String API_CUSTOMER_ADDRESSES = API_CUSTOMER_PREFIX + "/addresses";

    /* ==============================================================
     * 6. CÔNG KHAI (PUBLIC) - TRANG CHỦ
     * ============================================================== */
    // Danh sách sản phẩm cho khách vãng lai
    public static final String API_PUBLIC_PRODUCTS = API_PUBLIC_PREFIX + "/products";

    // Khách vãng lai gửi yêu cầu đặt hàng
    public static final String API_PUBLIC_ORDERS = API_PUBLIC_PREFIX + "/orders";
}