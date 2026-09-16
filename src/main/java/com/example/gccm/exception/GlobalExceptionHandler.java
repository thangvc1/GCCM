package com.example.gccm.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice // Biến class này thành trạm thu gom lỗi của toàn bộ các Controller
public class GlobalExceptionHandler {

    // Bắt riêng lỗi Validation từ các class DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Duyệt qua tất cả các trường bị lỗi và lấy câu thông báo
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        // Trả về mã lỗi 400 (Bad Request) kèm theo danh sách lỗi
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // Bạn có thể viết thêm các hàm @ExceptionHandler khác ở đây để bắt lỗi Not Found, lỗi Database... trong tương lai
}