package com.example.gccm.controller;

import com.example.gccm.dto.JwtResponse;
import com.example.gccm.dto.LoginRequest;
import com.example.gccm.dto.RegisterRequest;
import com.example.gccm.entity.Account;
import com.example.gccm.entity.Customer;
import com.example.gccm.entity.Role;
import com.example.gccm.repository.AccountRepository;
import com.example.gccm.repository.CustomerRepository;
import com.example.gccm.repository.RoleRepository;
import com.example.gccm.security.CustomUserDetails;
import com.example.gccm.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
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

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String role = userDetails.getAccount().getRole().getRoleName();

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), role));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        // 1. Kiểm tra username đã tồn tại chưa
        if (accountRepository.findByUsername(signUpRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Lỗi: Tên đăng nhập đã tồn tại!");
        }

        // 2. Tạo tài khoản mới (Account)
        Account account = new Account();
        account.setUsername(signUpRequest.getUsername());
        account.setPassword(passwordEncoder.encode(signUpRequest.getPassword())); // Mã hóa mật khẩu
        account.setStatus(1);
        account.setCreatedAt(LocalDateTime.now());

        // Lấy Role khách hàng mặc định
        Role userRole = roleRepository.findByRoleName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role. Cần insert Role vào DB trước."));
        account.setRole(userRole);

        accountRepository.save(account);

        // 3. Tạo thông tin hồ sơ (Customer)
        Customer customer = new Customer();
        customer.setAccount(account);
        customer.setFullName(signUpRequest.getFullName());
        customer.setPhone(signUpRequest.getPhone());
        customer.setAddress(signUpRequest.getAddress());
        customer.setStatus(1);

        customerRepository.save(customer);

        return ResponseEntity.ok("Đăng ký tài khoản thành công!");
    }
}