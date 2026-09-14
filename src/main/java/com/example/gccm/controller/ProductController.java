package com.example.gccm.controller;

import com.example.gccm.entity.Product;
import com.example.gccm.repository.NotificationRepository;
import com.example.gccm.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;
    private final NotificationRepository notificationRepository;

    public ProductController(ProductRepository productRepository , NotificationRepository notificationRepository) {
        this.productRepository = productRepository;
        this.notificationRepository = notificationRepository;
    }

    // Lấy danh sách
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Thêm mới
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setThicknessMm(productDetails.getThicknessMm());
            product.setWeightKgM2(productDetails.getWeightKgM2());
            product.setWidthM(productDetails.getWidthM());
            product.setLengthM(productDetails.getLengthM());
            product.setUnitPrice(productDetails.getUnitPrice());
            product.setStockQuantityM2(productDetails.getStockQuantityM2());
            product.setDescription(productDetails.getDescription());
            product.setStatus(productDetails.getStatus());
            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Xóa mềm (Chuyển trạng thái)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id).map(product -> {
            product.setStatus(0); // 0: Ngừng bán
            productRepository.save(product);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Thêm đoạn này vào trong class ProductController (đã inject notificationRepository)
    @GetMapping("/notifications")
    public ResponseEntity<?> getUnreadNotifications() {
        return ResponseEntity.ok(notificationRepository.findByIsReadOrderByIdDesc(0));
    }
}