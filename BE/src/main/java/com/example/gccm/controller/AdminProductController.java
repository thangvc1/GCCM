package com.example.gccm.controller;

import com.example.gccm.common.base.PageableObject;
import com.example.gccm.constant.MappingConstants;
import com.example.gccm.dto.ProductPageRequest;
import com.example.gccm.dto.ProductRequestDTO;
import com.example.gccm.entity.Product;
import com.example.gccm.repository.NotificationRepository;
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
    private final NotificationRepository notificationRepository;
    private final CloudinaryService cloudinaryService;

    public AdminProductController(ProductRepository productRepository,
                                  NotificationRepository notificationRepository,
                                  CloudinaryService cloudinaryService) {
        this.productRepository = productRepository;
        this.notificationRepository = notificationRepository;
        this.cloudinaryService = cloudinaryService;
    }

    // 1. GET ALL (Có phân trang & Tìm kiếm)
    @GetMapping
    public ResponseEntity<PageableObject<Product>> getAllProducts(ProductPageRequest request) {
        int pageNo = request.getPage() > 0 ? request.getPage() - 1 : 0;

        Sort.Direction direction = request.getSortBy().equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(pageNo, request.getSize(), Sort.by(direction, request.getOrderBy()));

        // SỬA Ở ĐÂY: Thay request.get() thành request.getQ()
        Page<Product> productPage = productRepository.searchProducts(request.getQ(), request.getStatus(), pageable);

        return ResponseEntity.ok(PageableObject.of(productPage));
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

    @GetMapping("/notifications")
    public ResponseEntity<?> getUnreadNotifications() {
        return ResponseEntity.ok(notificationRepository.findByIsReadOrderByIdDesc(0));
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