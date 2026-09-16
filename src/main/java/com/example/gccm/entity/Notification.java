package com.example.gccm.entity;

import com.example.gccm.enums.NotificationType;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    // THÊM: Liên kết trực tiếp tới Order (Tùy chọn)
    @Column(name = "order_id")
    private Long orderId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", length = 50)
    private NotificationType type;

    @Column(name = "is_read")
    private Integer isRead; // 0: Chưa đọc, 1: Đã đọc

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}