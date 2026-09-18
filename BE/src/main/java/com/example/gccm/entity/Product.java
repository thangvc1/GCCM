package com.example.gccm.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "thickness_mm")
    private Integer thicknessMm;

    @Column(name = "weight_kg_m2")
    private BigDecimal weightKgM2;

    @Column(name = "width_m")
    private BigDecimal widthM;

    @Column(name = "length_m")
    private BigDecimal lengthM;

    @Column(name = "unit_price", precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "stock_quantity_m2", precision = 10, scale = 2)
    private BigDecimal stockQuantityM2;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer status; // 1: Available, 0: Unavailable

    @Column(name = "image_url")
    private String imageUrl;
}