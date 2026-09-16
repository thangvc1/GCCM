package com.example.gccm.controller;

import com.example.gccm.constant.MappingConstants;
import com.example.gccm.dto.JwtResponse;
import com.example.gccm.dto.LoginRequest;
import com.example.gccm.dto.RegisterRequest;
import com.example.gccm.dto.UserResponse;
import com.example.gccm.entity.Account;
import com.example.gccm.entity.Customer;
import com.example.gccm.entity.Role;
import com.example.gccm.repository.AccountRepository;
import com.example.gccm.repository.CustomerRepository;
import com.example.gccm.repository.RoleRepository;
import com.example.gccm.security.CustomUserDetails;
import com.example.gccm.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping(MappingConstants.API_AUTH_PREFIX)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils,
                          AccountRepository accountRepository, CustomerRepository customerRepository,
                          RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // THÊM @Valid ĐỂ KÍCH HOẠT KIỂM TRA DỮ LIỆU
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String role = userDetails.getAccount().getRole().getRoleName();

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), role));
    }

    // THÊM @Valid ĐỂ KÍCH HOẠT KIỂM TRA DỮ LIỆU
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (accountRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Lỗi: Tên đăng nhập đã tồn tại!");
        }

        Account account = new Account();
        account.setUsername(signUpRequest.getUsername());
        account.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        account.setStatus(1);
        account.setCreatedAt(LocalDateTime.now());

        Role userRole = roleRepository.findByRoleName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role. Cần insert Role vào DB trước."));
        account.setRole(userRole);
        accountRepository.save(account);

        Customer customer = new Customer();
        customer.setAccount(account);
        customer.setFullName(signUpRequest.getFullName());
        customer.setPhone(signUpRequest.getPhone());
        customer.setAddress(signUpRequest.getAddress());
        customer.setStatus(1);

        customerRepository.save(customer);

        return ResponseEntity.ok("Đăng ký tài khoản thành công!");
    }

    // API LẤY THÔNG TIN NGƯỜI DÙNG HIỆN TẠI
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa xác thực hoặc token hết hạn");
        }

        // Tận dụng luôn CustomUserDetails mà bạn đã xây dựng
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Account account = userDetails.getAccount();

        // Truy vấn Customer dựa trên AccountID
        Customer customer = customerRepository.findByAccountId(account.getId()).orElse(null);

        UserResponse userResponse = UserResponse.builder()
                .id(account.getId())
                .username(account.getUsername())
                .role(account.getRole().getRoleName())
                .fullName(customer != null ? customer.getFullName() : null)
                .email(account.getUsername()) // Nếu hệ thống dùng chung email làm username, hoặc bỏ trường này nếu entity Customer không có email
                .phone(customer != null ? customer.getPhone() : null)
                .address(customer != null ? customer.getAddress() : null)
                .build();

        return ResponseEntity.ok(userResponse);
    }
}