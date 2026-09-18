package com.example.gccm.repository;

import com.example.gccm.entity.Account;
import com.example.gccm.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByAccount(Account account);
    Optional<Customer> findByAccountId(Long accountId);
}