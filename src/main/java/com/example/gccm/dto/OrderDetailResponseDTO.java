package com.example.gccm.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class OrderDetailResponseDTO {
    private Long productId;
    private String productName;
    private Integer thicknessMm;
    private BigDecimal quantityM2;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}