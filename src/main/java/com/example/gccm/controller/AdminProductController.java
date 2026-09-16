package com.example.gccm.controller;

import com.example.gccm.constant.MappingConstants;
import com.example.gccm.entity.Product;
import com.example.gccm.repository.NotificationRepository;
import com.example.gccm.repository.ProductRepository;
import com.example.gccm.service.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(MappingConstants.API_ADMIN_PRODUCTS)
public class AdminProductController {

    private final ProductRepository productRepository;
    private final NotificationRepository notificationRepository;
    private final CloudinaryService cloudinaryService;

    public AdminProductController(ProductRepository productRepository,
                                  NotificationRepository notificationRepository,
                                  CloudinaryService cloudinaryService) {
        this.productRepository = productRepository;
        this.notificationRepository = notificationRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // THÊM MỚI (Hỗ trợ upload ảnh)
    @PostMapping(consumes = {"multipart/form-data"})
    public Product createProduct(
            @RequestPart("product") Product product,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            product.setImageUrl(imageUrl);
        }
        return productRepository.save(product);
    }

    // CẬP NHẬT (Hỗ trợ thay ảnh mới)
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") Product productDetails,
            @RequestPart(value = "image", required = false) MultipartFile image) {

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

            try {
                // Nếu người dùng chọn ảnh mới thì mới upload và đè link cũ
                if (image != null && !image.isEmpty()) {
                    String imageUrl = cloudinaryService.uploadImage(image);
                    product.setImageUrl(imageUrl);
                }
            } catch (Exception e) {
                System.err.println("Lỗi upload ảnh khi cập nhật: " + e.getMessage());
            }

            return ResponseEntity.ok(productRepository.save(product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id).map(product -> {
            product.setStatus(0);
            productRepository.save(product);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getUnreadNotifications() {
        return ResponseEntity.ok(notificationRepository.findByIsReadOrderByIdDesc(0));
    }
}