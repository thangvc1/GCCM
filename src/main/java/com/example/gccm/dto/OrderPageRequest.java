package com.example.gccm.dto;

import com.example.gccm.common.base.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderPageRequest extends PageableRequest {
    // Bạn có thể thêm các bộ lọc riêng cho đơn hàng sau này nếu cần, ví dụ:
    // private Integer status;
    // private String fromDate;
    // private String toDate;
}