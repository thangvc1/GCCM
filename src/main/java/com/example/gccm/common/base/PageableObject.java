package com.example.gccm.common.base;

import lombok.Getter;
import org.springframework.data.domain.Page;
import java.util.List;

@Getter
public class PageableObject<T> {
    private final List<T> data;
    private final long totalPages;
    private final int currentPage;
    private final long totalElements;

    public PageableObject(Page<T> page) {
        this.data = page.getContent();
        this.totalPages = page.getTotalPages();
        // Cộng 1 vì Spring Boot đếm trang từ 0, còn hiển thị UI thường từ 1
        this.currentPage = page.getNumber() + 1;
        this.totalElements = page.getTotalElements();
    }

    public static <T> PageableObject<T> of(Page<T> page) {
        return new PageableObject<>(page);
    }
}