package com.example.gccm.controller;

import com.example.gccm.constant.MappingConstants;
import com.example.gccm.entity.Notification;
import com.example.gccm.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(MappingConstants.API_ADMIN_NOTIFICATIONS) // Sẽ trỏ tới /api/v1/admin/notifications
public class AdminNotificationController {

    private final NotificationRepository notificationRepository;

    public AdminNotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<?> getUnreadNotifications() {
        return ResponseEntity.ok(notificationRepository.findByIsReadOrderByIdDesc(0));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));
        notification.setIsRead(1); // 1 là đã đọc
        notificationRepository.save(notification);
        return ResponseEntity.ok("Đã đánh dấu đọc thông báo " + id);
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead() {
        notificationRepository.markAllAsRead();
        return ResponseEntity.ok("Đã đánh dấu đọc tất cả");
    }
}