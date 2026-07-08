package com.monocept.demo.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.demo.entity.Claim;
import com.monocept.demo.enums.ClaimStatus;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

	Optional<Claim> findByClaimNumber(String claimNumber);

	Page<Claim> findByPolicy_Customer_CustomerId(Long customerId, Pageable pageable);

	Page<Claim> findByPolicyPolicyId(Long policyId, Pageable pageable);

	boolean existsByPolicyPolicyIdAndIncidentDate(Long policyId, LocalDate incidentDate);

	boolean existsByPolicyPolicyIdAndClaimStatusIn(Long policyId, List<ClaimStatus> statuses);

	List<Claim> findByClaimStatus(ClaimStatus claimStatus);
	
	 @Query("""
	            SELECT COALESCE(SUM(c.claimAmount), 0)
	            FROM Claim c
	            WHERE c.policy.policyId = :policyId
	            AND c.claimStatus = 'APPROVED'
	            """)
	    BigDecimal getTotalApprovedClaimAmount(
	            @Param("policyId") Long policyId);
}