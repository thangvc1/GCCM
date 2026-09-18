package com.example.gccm.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder // Dùng Builder pattern để tạo object dễ dàng hơn
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String role;
}