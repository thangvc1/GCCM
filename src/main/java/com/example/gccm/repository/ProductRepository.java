package com.example.gccm.repository;

import com.example.gccm.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE " +
            "(p.name LIKE %:q% OR :q IS NULL) AND " +
            "(p.status = :status OR :status IS NULL)")
    Page<Product> searchProducts(String q, Integer status, Pageable pageable);
}