package com.example.gccm.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequestDTO {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 50, message = "Tên sản phẩm không vượt quá 50 ký tự")
    private String name;

    @NotNull(message = "Vui lòng nhập độ dày")
    @Positive(message = "Độ dày phải lớn hơn 0")
    @Max(value = 20, message = "Độ dày tối đa không quá 20mm")
    private Integer thicknessMm;

    @NotNull(message = "Vui lòng nhập cân nặng")
    @Positive(message = "Cân nặng phải là số dương")
    @DecimalMax(value = "20.0", message = "Cân nặng tối đa không quá 20kg/m2")
    private BigDecimal weightKgM2;

    @NotNull(message = "Vui lòng nhập chiều rộng")
    @Positive(message = "Chiều rộng phải lớn hơn 0")
    @DecimalMax(value = "5.0", message = "Chiều rộng thảm tối đa không quá 5m")
    private BigDecimal widthM;

    @NotNull(message = "Vui lòng nhập chiều dài")
    @Positive(message = "Chiều dài phải lớn hơn 0")
    @DecimalMax(value = "15.0", message = "Chiều dài cuộn thảm tối đa không quá 15m")
    private BigDecimal lengthM;

    @NotNull(message = "Vui lòng nhập giá bán")
    @Min(value = 0, message = "Giá bán không được là số âm")
    @DecimalMax(value = "1000000.0", message = "Giá bán tối đa 1,000,000đ/m2")
    private BigDecimal unitPrice;

    @NotNull(message = "Vui lòng nhập số lượng tồn kho")
    @Min(value = 0, message = "Tồn kho không được là số âm")
    @DecimalMax(value = "200000.0", message = "Tồn kho tối đa 200,000m2")
    private BigDecimal stockQuantityM2;

    @NotBlank(message = "Mô tả không được để trống")
    @Size(max = 500, message = "Mô tả sản phẩm không dài quá 500 ký tự")
    private String description;

    @NotNull(message = "Trạng thái không được để trống")
    @Min(value = 0, message = "Trạng thái không hợp lệ (chỉ nhận 0 hoặc 1)")
    @Max(value = 1, message = "Trạng thái không hợp lệ (chỉ nhận 0 hoặc 1)")
    private Integer status;
}