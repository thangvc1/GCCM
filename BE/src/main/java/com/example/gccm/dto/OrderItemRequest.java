package com.example.gccm.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemRequest {

    @NotNull(message = "Mã sản phẩm không được để trống")
    private Long productId;

    @NotNull(message = "Số lượng (m2) không được để trống")
    // Dùng DecimalMin cho BigDecimal thay vì Min
    @DecimalMin(value = "0.1", message = "Số lượng đặt mua phải lớn hơn 0")
    private BigDecimal quantityM2; // Đã đổi tên cho khớp Entity
}