package com.example.gccm.controller;

import com.example.gccm.common.base.PageableObject;
import com.example.gccm.constant.MappingConstants;
import com.example.gccm.dto.OrderPageRequest; // Đổi import
import com.example.gccm.dto.OrderResponseDTO;
import com.example.gccm.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(MappingConstants.API_ADMIN_ORDERS)
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<PageableObject<OrderResponseDTO>> getAllOrders(OrderPageRequest request) { // Đổi tham số

        int pageNo = request.getPage() > 0 ? request.getPage() - 1 : 0;
        Sort.Direction direction = request.getSortBy().equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(pageNo, request.getSize(), Sort.by(direction, request.getOrderBy()));

        Page<OrderResponseDTO> orderPage = orderService.getAllOrders(pageable);

        return ResponseEntity.ok(PageableObject.of(orderPage));
    }
}