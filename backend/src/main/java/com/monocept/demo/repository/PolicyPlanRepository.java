package com.monocept.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.demo.entity.PolicyPlan;

public interface PolicyPlanRepository extends JpaRepository<PolicyPlan, Long>{

    boolean existsByPlanName(String planName);
    
    List<PolicyPlan> findByProductProductId(Long productId);

}
