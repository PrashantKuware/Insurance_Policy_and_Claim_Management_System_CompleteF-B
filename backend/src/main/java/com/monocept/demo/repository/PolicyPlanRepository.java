package com.monocept.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.demo.entity.PolicyPlan;

public interface PolicyPlanRepository extends JpaRepository<PolicyPlan, Long>{

    boolean existsByPlanName(String planName);

}
