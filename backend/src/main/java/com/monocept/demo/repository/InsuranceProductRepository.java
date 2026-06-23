package com.monocept.demo.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.monocept.demo.entity.InsuranceProduct;

public interface InsuranceProductRepository extends JpaRepository<InsuranceProduct, Long> {

	Optional<InsuranceProduct> findByProductName(String productName);

	boolean existsByProductName(String productName);
}