package com.monocept.demo.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import com.monocept.demo.dto.request.PolicyPurchaseRequestDto;
import com.monocept.demo.dto.response.PolicyResponseDto;
import com.monocept.demo.service.PolicyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

	private final PolicyService policyService;

	// CUSTOMER
	@PostMapping("/purchase")
	public PolicyResponseDto purchasePolicy(@Valid @RequestBody PolicyPurchaseRequestDto dto) {

		return policyService.purchasePolicy(dto);
	}

	// ADMIN / AGENT
//	@PostMapping("/issue")
//	public PolicyResponseDto issuePolicy(@RequestParam Long customerId, @RequestParam Long planId) {
//
//		return policyService.issuePolicy(customerId, planId);
//	}

	// CUSTOMER(own), ADMIN, AGENT
	@GetMapping("/{policyId}")
	public PolicyResponseDto getPolicyById(@PathVariable Long policyId) {

		return policyService.getPolicyById(policyId);
	}

	@GetMapping("/my-policies")
	public List<PolicyResponseDto> getMyPolicies() {

	    return policyService.getPoliciesByCustomer();
	}

	// ADMIN / AGENT
	@GetMapping
	public Page<PolicyResponseDto> getAllPolicies(@RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "10") int pageSize, @RequestParam(defaultValue = "policyId") String sortBy) {

		return policyService.getAllPolicies(pageNo, pageSize, sortBy);
	}

	// ADMIN / AGENT
	@PatchMapping("/{policyId}/activate")
	public String activatePolicy(@PathVariable Long policyId) {

		policyService.activatePolicy(policyId);

		return "Policy activated successfully";
	}

	// ADMIN / AGENT
	@PatchMapping("/{policyId}/cancel")
	public String cancelPolicy(@PathVariable Long policyId) {

		policyService.cancelPolicy(policyId);

		return "Policy cancelled successfully";
	}
}