package com.example.gccm.controller;

import com.example.gccm.constant.MappingConstants;
import com.example.gccm.dto.OrderRequest;
import com.example.gccm.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(MappingConstants.API_CUSTOMER_ORDERS) // Tương đương: /api/v1/customer/orders
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Customer tạo đơn hàng
    @PostMapping
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest request) {
        try {
            // Chỉ cần gọi sang Service, Service đã có logic tự động nhận diện Customer qua JWT
            orderService.createOrder(request);
            return ResponseEntity.ok("Gửi yêu cầu đặt hàng thành công! Chúng tôi sẽ sớm liên hệ lại.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xử lý đơn hàng: " + e.getMessage());
        }
    }
}