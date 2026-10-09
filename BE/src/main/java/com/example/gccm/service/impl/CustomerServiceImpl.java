package com.example.gccm.service.impl;

import com.example.gccm.dto.CustomerDTO;
import com.example.gccm.entity.Account;
import com.example.gccm.entity.Customer;
import com.example.gccm.entity.Role;
import com.example.gccm.repository.AccountRepository;
import com.example.gccm.repository.CustomerRepository;
import com.example.gccm.repository.RoleRepository;
import com.example.gccm.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    // Trong CustomerServiceImpl.java, thêm RoleRepository vào RequiredArgsConstructor
    private final RoleRepository roleRepository;

    @Override
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<CustomerDTO> searchCustomers(String keyword, Integer status) {
        if (keyword != null && keyword.trim().isEmpty()) keyword = null;
        return customerRepository.searchCustomers(keyword, status)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        customer.setFullName(dto.getFullName());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        customer.setStatus(dto.getStatus());

        return mapToDTO(customerRepository.save(customer));
    }

    @Override
    @Transactional
    public void toggleCustomerStatus(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));

        // Đổi lật trạng thái giữa 1 (Hoạt động) và 2 (Khóa) thay vì 0
        customer.setStatus(customer.getStatus() == 1 ? 2 : 1);

        // Đồng bộ trạng thái khóa sang cả bảng Account để chặn đăng nhập
        if (customer.getAccount() != null) {
            customer.getAccount().setStatus(customer.getStatus());
        }

        customerRepository.save(customer);
    }

    private CustomerDTO mapToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFullName(customer.getFullName());
        dto.setPhone(customer.getPhone());
        dto.setAddress(customer.getAddress());
        dto.setStatus(customer.getStatus());
        if (customer.getAccount() != null) {
            dto.setUsername(customer.getAccount().getUsername());
        }
        return dto;
    }



    @Override
    @Transactional
    public CustomerDTO createCustomer(CustomerDTO dto) {

        // Kiểm tra trùng lặp tên đăng nhập
        if (accountRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        // Tạo Account trước
        Account account = new Account();
        account.setUsername(dto.getUsername());
        account.setPassword(passwordEncoder.encode(dto.getPassword()));

        // Mặc định tạo mới là Hoạt động (1) và lưu thời gian tạo
        account.setStatus(1);
        account.setCreatedAt(java.time.LocalDateTime.now());

        Role role = roleRepository.findByRoleName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền ROLE_CUSTOMER trong DB"));
        account.setRole(role);

        account = accountRepository.save(account);

        // Tạo Customer
        Customer customer = new Customer();
        customer.setAccount(account);
        customer.setFullName(dto.getFullName());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());

        // Mặc định tạo mới là Hoạt động (1)
        customer.setStatus(1);

        return mapToDTO(customerRepository.save(customer));
    }
}