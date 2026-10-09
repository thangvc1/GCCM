package com.example.gccm.controller;

import com.example.gccm.constant.MappingConstants;
import com.example.gccm.dto.CustomerDTO;
import com.example.gccm.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(MappingConstants.API_ADMIN_CUSTOMERS)
@RequiredArgsConstructor
public class AdminCustomerController {

    private final CustomerService customerService;

    // CHỈ GIỮ LẠI HÀM GET NÀY CHO CẢ VIỆC LẤY TẤT CẢ VÀ TÌM KIẾM
    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getCustomers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status) {
        return ResponseEntity.ok(customerService.searchCustomers(keyword, status));
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody CustomerDTO dto) {
        return ResponseEntity.ok(customerService.createCustomer(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO dto) {
        return ResponseEntity.ok(customerService.updateCustomer(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> toggleCustomerStatus(@PathVariable Long id) {
        customerService.toggleCustomerStatus(id);
        return ResponseEntity.ok().build();
    }
}