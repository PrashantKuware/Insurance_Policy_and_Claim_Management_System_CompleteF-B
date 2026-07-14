package com.monocept.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.demo.entity.Policy;
import com.monocept.demo.enums.PolicyStatus;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    List<Policy> findByCustomerCustomerId(Long customerId);

    boolean existsByPolicyNumber(String policyNumber);

    boolean existsByCustomerCustomerIdAndPolicyPlanPlanIdAndPolicyStatusNot(
            Long customerId,
            Long planId,
            PolicyStatus status);

    boolean existsByCustomerCustomerIdAndPolicyPlanPlanId(
            Long customerId,
            Long planId);

    boolean existsByPolicyIdAndCustomerCustomerId(
            Long policyId,
            Long customerId);

    // ADD THIS
    List<Policy> findByPolicyPlanPlanId(Long planId);
}