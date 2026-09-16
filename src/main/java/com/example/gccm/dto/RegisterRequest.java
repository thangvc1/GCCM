package com.example.gccm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 4, max = 30, message = "Tên đăng nhập phải từ 4 đến 30 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Tên đăng nhập không được chứa ký tự đặc biệt hoặc khoảng trắng")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 50, message = "Mật khẩu phải từ 6 đến 50 ký tự")
    private String password;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng (ví dụ: ten@gmail.com)")
    private String email;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ tên không vượt quá 100 ký tự")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)[3|5|7|8|9][0-9]{8}$", message = "Số điện thoại không hợp lệ (phải là số di động Việt Nam)")
    private String phone;

    // BỔ SUNG THÊM TRƯỜNG ĐỊA CHỈ
    @NotBlank(message = "Địa chỉ không được để trống")
    @Size(min = 10, max = 255, message = "Địa chỉ phải từ 10 đến 255 ký tự (Ghi rõ số nhà, đường, phường/xã, quận/huyện, tỉnh/TP)")
    private String address;
}