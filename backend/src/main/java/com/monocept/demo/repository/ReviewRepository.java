package com.monocept.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.monocept.demo.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

	boolean existsByCustomerIdAndPolicyId(Long customerId, Long policyId);

	List<Review> findByPolicyId(Long policyId);

	@Query("""
			SELECT AVG(r.rating)
			FROM Review r
			WHERE r.policyId = :policyId
			""")
	Double getAverageRating(@Param("policyId") Long policyId);
	
	List<Review> findByPolicyIdIn(List<Long> policyIds);

	@Query("""
	       SELECT AVG(r.rating)
	       FROM Review r
	       WHERE r.policyId IN :policyIds
	       """)
	Double getAverageRatingByPolicyIds(
	        @Param("policyIds") List<Long> policyIds);
}