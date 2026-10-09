package com.example.gccm.dto;

import lombok.Data;

@Data
public class CustomerDTO {
    private Long id;
    private String username; // Dùng để hiển thị hoặc khi tạo mới
    private String password; // Chỉ dùng khi Admin muốn set mật khẩu lúc tạo mới
    private String fullName;
    private String phone;
    private String address;
    private Integer status;
}