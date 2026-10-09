package com.example.gccm.controller;

import com.example.gccm.common.base.PageableObject;
import com.example.gccm.constant.MappingConstants;
import com.example.gccm.dto.ProductPageRequest;
import com.example.gccm.dto.ProductRequestDTO;
import com.example.gccm.entity.Product;
import com.example.gccm.repository.ProductRepository;
import com.example.gccm.service.CloudinaryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(MappingConstants.API_ADMIN_PRODUCTS)
public class AdminProductController {

    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;

    public AdminProductController(ProductRepository productRepository,
                                  CloudinaryService cloudinaryService) {
        this.productRepository = productRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // Trong AdminProductController.java, sửa lại hàm GetMapping
    @GetMapping
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "100") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "0") Integer status) {

        Pageable pageable = PageRequest.of(page - 1, size);
        // Gọi sang service hoặc repository (tùy cấu trúc bạn đang dùng)
        return ResponseEntity.ok(productRepository.searchProducts(keyword, status, pageable));
    }

    // 2. THÊM MỚI (Dùng DTO có Validate)
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Product> createProduct(
            @Valid @RequestPart("product") ProductRequestDTO productDetails,
            @RequestPart(value = "image", required = false) MultipartFile image) throws Exception {

        Product product = new Product();
        mapDtoToEntity(productDetails, product);

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            product.setImageUrl(imageUrl);
        }
        return ResponseEntity.ok(productRepository.save(product));
    }

    // 3. CẬP NHẬT (Dùng DTO có Validate)
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @Valid @RequestPart("product") ProductRequestDTO productDetails,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        return productRepository.findById(id).map(product -> {
            mapDtoToEntity(productDetails, product);

            try {
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

    // 4. XÓA (Cập nhật trạng thái)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id).map(product -> {
            product.setStatus(0);
            productRepository.save(product);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Hàm tiện ích để đỡ phải viết lặp lại code gán dữ liệu
    private void mapDtoToEntity(ProductRequestDTO dto, Product entity) {
        entity.setName(dto.getName());
        entity.setThicknessMm(dto.getThicknessMm());
        entity.setWeightKgM2(dto.getWeightKgM2());
        entity.setWidthM(dto.getWidthM());
        entity.setLengthM(dto.getLengthM());
        entity.setUnitPrice(dto.getUnitPrice());
        entity.setStockQuantityM2(dto.getStockQuantityM2());
        entity.setDescription(dto.getDescription());
        entity.setStatus(dto.getStatus());
    }
}