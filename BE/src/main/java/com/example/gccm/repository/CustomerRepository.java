package com.example.gccm.repository;

import com.example.gccm.entity.Account;
import com.example.gccm.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByAccount(Account account);
    Optional<Customer> findByAccountId(Long accountId);

    @Query("SELECT c FROM Customer c WHERE " +
            "c.account.role.roleName = 'ROLE_CUSTOMER' AND " +
            "(:keyword IS NULL OR " +
            " LOWER(c.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(c.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(c.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(c.account.username) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:status IS NULL OR :status = 0 OR c.status = :status)") // <-- Sửa dòng này
    List<Customer> searchCustomers(@Param("keyword") String keyword, @Param("status") Integer status);
}