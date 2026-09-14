package com.example.gccm.controller;

import com.example.gccm.dto.OrderRequest;
import com.example.gccm.entity.*;
import com.example.gccm.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/customer/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final NotificationRepository notificationRepository;

    public OrderController(OrderRepository orderRepository, OrderDetailRepository orderDetailRepository,
                           ProductRepository productRepository, AccountRepository accountRepository,
                           CustomerRepository customerRepository, NotificationRepository notificationRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.productRepository = productRepository;
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.notificationRepository = notificationRepository;
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest request) {
        // 1. Lấy thông tin khách hàng đang đăng nhập từ Token
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepository.findByUsername(username).orElseThrow();
        Customer customer = customerRepository.findByAccount(account).orElseThrow();

        // 2. Tạo đơn hàng mới
        Order order = new Order();
        order.setCustomer(customer);
        order.setCustomerNote(request.getCustomerNote());
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal totalArea = BigDecimal.ZERO;
        BigDecimal totalPrice = BigDecimal.ZERO;
        order = orderRepository.save(order); // Lưu tạm để lấy ID

        // 3. Xử lý chi tiết sản phẩm
        for (var itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId()).orElseThrow();

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setProduct(product);
            detail.setQuantityM2(itemReq.getQuantityM2());
            detail.setUnitPrice(product.getUnitPrice());

            BigDecimal subtotal = product.getUnitPrice().multiply(itemReq.getQuantityM2());
            detail.setSubtotal(subtotal);

            totalArea = totalArea.add(itemReq.getQuantityM2());
            totalPrice = totalPrice.add(subtotal);

            orderDetailRepository.save(detail);
        }

        // 4. Cập nhật tổng tiền vào đơn hàng (chưa áp dụng Voucher cho phiên bản này)
        order.setTotalAreaM2(totalArea);
        order.setTotalPrice(totalPrice);
        order.setFinalAmount(totalPrice);
        orderRepository.save(order);

        // 5. Tạo thông báo cho Admin
        Notification notif = new Notification();
        notif.setTitle("Đơn yêu cầu tư vấn mới");
        notif.setContent("Khách hàng " + customer.getFullName() + " (SĐT: " + customer.getPhone() + ") vừa gửi yêu cầu đặt " + totalArea + " m2 thảm bê tông.");
        notif.setIsRead(0);
        notif.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notif);

        return ResponseEntity.ok("Gửi yêu cầu đặt hàng thành công!");
    }
}