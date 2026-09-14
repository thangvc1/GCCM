package com.example.gccm.repository;

import com.example.gccm.entity.Account;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    // Yêu cầu Spring Data tự động JOIN với cột "role" khi gọi hàm này
    @EntityGraph(attributePaths = {"role"})
    Optional<Account> findByUsername(String username);
}