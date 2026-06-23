package com.monocept.demo.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.monocept.demo.dto.request.PolicyPurchaseRequestDto;
import com.monocept.demo.dto.response.PolicyResponseDto;

public interface PolicyService 
{

	PolicyResponseDto purchasePolicy(PolicyPurchaseRequestDto dto);

//	PolicyResponseDto issuePolicy(Long customerId, Long planId);

	PolicyResponseDto getPolicyById(Long policyId);

	List<PolicyResponseDto> getPoliciesByCustomer();

	Page<PolicyResponseDto> getAllPolicies(int pageNo, int pageSize, String sortBy);

	void activatePolicy(Long policyId);

	void cancelPolicy(Long policyId);
}