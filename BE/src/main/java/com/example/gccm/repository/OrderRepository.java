package com.example.gccm.repository;

import com.example.gccm.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByCustomerId(Long customerId, Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN o.orderDetails od LEFT JOIN od.product p WHERE " +
            "(:keyword IS NULL OR LOWER(o.receiverName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR o.receiverPhone LIKE CONCAT('%', :keyword, '%')) AND " +
            "(:thickness IS NULL OR p.thicknessMm = :thickness) AND " +
            "(:startDate IS NULL OR o.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR o.createdAt <= :endDate)")
    Page<Order> searchAdminOrders(@Param("keyword") String keyword,
                                  @Param("thickness") Integer thickness,
                                  @Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate,
                                  Pageable pageable);
}