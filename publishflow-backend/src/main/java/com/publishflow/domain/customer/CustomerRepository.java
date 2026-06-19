package com.publishflow.domain.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {

    Optional<Customer> findByIdAndDeletedAtIsNull(String id);

    @Query("""
        SELECT c FROM Customer c WHERE c.deletedAt IS NULL
        AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Customer> findAllActive(@Param("search") String search, Pageable pageable);
}
