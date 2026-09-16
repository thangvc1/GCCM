package com.example.gccm.service;

import com.example.gccm.dto.OrderDetailResponseDTO;
import com.example.gccm.dto.OrderResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.stream.Collectors;
import com.example.gccm.dto.OrderItemRequest;
import com.example.gccm.dto.OrderRequest;
import com.example.gccm.entity.*;
import com.example.gccm.enums.NotificationType;
import com.example.gccm.repository.*;
import com.example.gccm.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final NotificationRepository notificationRepository;

    public OrderService(OrderRepository orderRepository, OrderDetailRepository orderDetailRepository,
                        ProductRepository productRepository, CustomerRepository customerRepository,
                        NotificationRepository notificationRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.notificationRepository = notificationRepository;
    }

    @Transactional // Đảm bảo nếu lỗi ở bất kỳ dòng nào, toàn bộ quá trình sẽ được Rollback
    public Order createOrder(OrderRequest request) {

        // 1. Kiểm tra xem người dùng là Khách đăng nhập hay Khách vãng lai
        Customer currentCustomer = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            // Lấy Customer thông qua Account ID
            currentCustomer = customerRepository.findByAccountId(userDetails.getAccount().getId()).orElse(null);
        }

        // 2. Khởi tạo Đơn hàng (Order)
        Order order = new Order();
        order.setCustomer(currentCustomer); // Sẽ là null nếu là khách vãng lai
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCustomerNote(request.getCustomerNote());
        order.setCreatedAt(LocalDateTime.now());
        order.setTotalAreaM2(BigDecimal.ZERO);
        order.setTotalPrice(BigDecimal.ZERO);
        order.setFinalAmount(BigDecimal.ZERO);

        // Lưu tạm order để lấy ID (dùng cho OrderDetail)
        order = orderRepository.save(order);

        // 3. Xử lý Giỏ hàng (Order Details) và Tính tiền an toàn từ DB
        BigDecimal totalArea = BigDecimal.ZERO;
        BigDecimal totalPrice = BigDecimal.ZERO;
        List<OrderDetail> details = new ArrayList<>();

        // Tạo StringBuilder để nối chuỗi nội dung Thông báo cho Admin
        StringBuilder notifContent = new StringBuilder();
        notifContent.append("Khách hàng: ").append(request.getReceiverName())
                .append(" - SĐT: ").append(request.getReceiverPhone())
                .append(" đã đặt mua:\n");

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + itemReq.getProductId()));

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(product);
            detail.setQuantityM2(itemReq.getQuantityM2());
            detail.setUnitPrice(product.getUnitPrice()); // LẤY GIÁ TỪ DB, KHÔNG NHẬN TỪ FRONTEND

            // Công thức: Thành tiền = Giá * Số lượng
            BigDecimal subtotal = product.getUnitPrice().multiply(itemReq.getQuantityM2());
            detail.setSubtotal(subtotal);
            details.add(detail);

            // Cộng dồn tổng đơn
            totalArea = totalArea.add(itemReq.getQuantityM2());
            totalPrice = totalPrice.add(subtotal);

            // Nối chuỗi thông báo: "- 20m2 Thảm bê tông GCCM (Dày: 10mm)"
            notifContent.append("- ").append(itemReq.getQuantityM2()).append("m2 ")
                    .append(product.getName()).append(" (Dày: ").append(product.getThicknessMm()).append("mm)\n");
        }

        orderDetailRepository.saveAll(details);

        // Cập nhật lại tổng tiền cho Đơn hàng
        order.setTotalAreaM2(totalArea);
        order.setTotalPrice(totalPrice);
        order.setFinalAmount(totalPrice); // Nếu bạn có Voucher, logic trừ tiền sẽ nằm ở đây
        orderRepository.save(order);

        // 4. Tạo Thông báo gửi Admin
        Notification notif = new Notification();
        notif.setTitle("Đơn hàng mới từ " + request.getReceiverName());
        notif.setContent(notifContent.toString());
        notif.setOrderId(order.getId());

        // SỬ DỤNG ENUM TẠI ĐÂY
        notif.setType(NotificationType.NEW_ORDER);

        notif.setIsRead(0);
        notif.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notif);

        return order;
    }

    // HÀM MỚI 1: Lấy TẤT CẢ đơn hàng (Dành cho Admin)
    public Page<OrderResponseDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::mapToOrderResponseDTO);
    }

    // HÀM MỚI 2: Lấy đơn hàng CỦA RIÊNG MỘT KHÁCH (Dành cho Customer xem lịch sử)
    public Page<OrderResponseDTO> getOrdersByCustomer(Long customerId, Pageable pageable) {
        return orderRepository.findByCustomerId(customerId, pageable).map(this::mapToOrderResponseDTO);
    }

    // HÀM TIỆN ÍCH: Chuyển Entity Order -> DTO an toàn
    private OrderResponseDTO mapToOrderResponseDTO(Order order) {

        List<OrderDetailResponseDTO> itemDTOs = order.getOrderDetails().stream()
                .map(detail -> OrderDetailResponseDTO.builder()
                        .productId(detail.getProduct().getId())
                        .productName(detail.getProduct().getName())
                        .thicknessMm(detail.getProduct().getThicknessMm())
                        .quantityM2(detail.getQuantityM2())
                        .unitPrice(detail.getUnitPrice())
                        .subtotal(detail.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(order.getId())
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .customerName(order.getCustomer() != null ? order.getCustomer().getFullName() : "Khách vãng lai")
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .totalAreaM2(order.getTotalAreaM2())
                .totalPrice(order.getTotalPrice())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .customerNote(order.getCustomerNote())
                .createdAt(order.getCreatedAt())
                .items(itemDTOs)
                .build();
    }
}