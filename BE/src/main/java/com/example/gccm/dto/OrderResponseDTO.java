package com.example.gccm.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private Long id;

    // Nếu là null thì là khách vãng lai
    private Long customerId;
    private String customerName;

    // Thông tin giao hàng
    private String receiverName;
    private String receiverPhone;
    private String deliveryAddress;

    // Tiền nong
    private BigDecimal totalAreaM2;
    private BigDecimal totalPrice;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;

    private String customerNote;
    private LocalDateTime createdAt;

    // Danh sách sản phẩm
    private List<OrderDetailResponseDTO> items;
}