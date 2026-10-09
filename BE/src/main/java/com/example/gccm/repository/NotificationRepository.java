package com.example.gccm.repository;

import com.example.gccm.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Hàm cũ của bạn giữ nguyên
    List<Notification> findByIsReadOrderByIdDesc(Integer isRead);

    // Hàm mới: Đánh dấu tất cả là đã đọc
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = 1 WHERE n.isRead = 0")
    void markAllAsRead();
}