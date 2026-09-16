package com.example.gccm.controller;

import com.example.gccm.constant.MappingConstants;
import com.example.gccm.dto.OrderRequest;
import com.example.gccm.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(MappingConstants.API_PUBLIC_PREFIX + "/orders") // Tương đương: /api/v1/public/orders
public class PublicOrderController {

    private final OrderService orderService;

    public PublicOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Endpoint POST để tạo đơn hàng mới
    @PostMapping
    public ResponseEntity<?> submitOrder(@Valid @RequestBody OrderRequest orderRequest) {
        try {
            orderService.createOrder(orderRequest);
            return ResponseEntity.ok("Gửi yêu cầu đặt hàng thành công! Chúng tôi sẽ sớm liên hệ lại.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xử lý đơn hàng: " + e.getMessage());
        }
    }
}