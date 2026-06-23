package com.monocept.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.demo.entity.Policy;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

	List<Policy> findByCustomerCustomerId(Long customerId);

	boolean existsByPolicyNumber(String policyNumber);
}