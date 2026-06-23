package com.monocept.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.PolicyPlanRequestDto;
import com.monocept.demo.dto.response.PolicyPlanResponseDto;

@Service
public interface PolicyPlanService {

	PolicyPlanResponseDto addPlan(PolicyPlanRequestDto planRequestDto);
	
	PolicyPlanResponseDto updatePlan(Long policyId, PolicyPlanRequestDto planRequestDto);
	
	PolicyPlanResponseDto getPlanById(Long policyId);
	
	Page<PolicyPlanResponseDto> getAllPlans(int pageNo, int pageSize);

	void deactivatePlan(Long policyId);
}

