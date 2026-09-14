package com.example.gccm.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemRequest {
    private Long productId;
    private BigDecimal quantityM2;
}