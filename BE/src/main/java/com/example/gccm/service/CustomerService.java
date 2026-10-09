package com.example.gccm.service;

import com.example.gccm.dto.CustomerDTO;
import java.util.List;

public interface CustomerService {
    List<CustomerDTO> getAllCustomers();
    CustomerDTO createCustomer(CustomerDTO dto);
    CustomerDTO updateCustomer(Long id, CustomerDTO dto);
    void toggleCustomerStatus(Long id); // Tắt/mở hoạt động
    List<CustomerDTO> searchCustomers(String keyword, Integer status);
}