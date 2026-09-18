package com.example.gccm.controller;

import com.example.gccm.constant.MappingConstants;
import com.example.gccm.entity.Product;
import com.example.gccm.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(MappingConstants.API_PUBLIC_PRODUCTS)
public class PublicProductController {

    private final ProductRepository productRepository;

    public PublicProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Ai cũng có thể vào xem danh sách sản phẩm thảm để mua
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}