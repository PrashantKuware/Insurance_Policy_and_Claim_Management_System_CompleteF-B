package com.monocept.demo.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.demo.entity.PremiumPayment;

public interface PremiumPaymentRepository extends JpaRepository<PremiumPayment, Long> {

	Page<PremiumPayment> findByPolicyPolicyId(Long policyId, Pageable pageable);

	Optional<PremiumPayment> findByTransactionReference(String transactionReference);
}
