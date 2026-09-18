package com.example.gccm;

import com.example.gccm.constant.MappingConstants;
import com.example.gccm.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}