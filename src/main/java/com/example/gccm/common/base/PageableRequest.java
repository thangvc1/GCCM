package com.example.gccm.common.base;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public abstract class PageableRequest {
    private int page = 1; // Mặc định là trang 1 (Frontend thường truyền 1 thay vì 0)
    private int size = 10;
    private String orderBy = "id";
    private String sortBy = "desc";
    private String q = ""; // Từ khóa tìm kiếm
}