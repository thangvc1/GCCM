package com.example.gccm.dto;

import com.example.gccm.common.base.PageableRequest;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductPageRequest extends PageableRequest {
    private Integer status; // Thêm bộ lọc trạng thái (1: Đang bán, 0: Ngừng bán)
}