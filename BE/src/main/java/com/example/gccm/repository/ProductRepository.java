package com.example.gccm.repository;

import com.example.gccm.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
            "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR CAST(p.thicknessMm AS string) LIKE CONCAT('%', :keyword, '%')) AND " +
            "(:status IS NULL OR :status = 0 OR p.status = :status)")
    Page<Product> searchProducts(@Param("keyword") String keyword, @Param("status") Integer status, Pageable pageable);
}