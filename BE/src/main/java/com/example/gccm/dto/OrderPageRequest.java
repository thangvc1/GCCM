package com.example.gccm.dto;

import com.example.gccm.common.base.PageableRequest;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class OrderPageRequest extends PageableRequest {
    // Bạn có thể thêm các bộ lọc riêng cho đơn hàng sau này nếu cần, ví dụ:
    // private Integer status;
    // private String fromDate;
    // private String toDate;
    // Thêm vào file OrderPageRequest.java
    private String keyword;
    private Integer thickness;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endDate;
}