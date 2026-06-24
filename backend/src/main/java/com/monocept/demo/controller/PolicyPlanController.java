package com.monocept.demo.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.demo.dto.request.PolicyPlanRequestDto;
import com.monocept.demo.dto.response.PolicyPlanResponseDto;
import com.monocept.demo.service.PolicyPlanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173/")
public class PolicyPlanController {

	private final PolicyPlanService policyPlanService;

	// ADMIN
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public PolicyPlanResponseDto addPlan(
			@Valid @RequestBody PolicyPlanRequestDto dto) {

		return policyPlanService.addPlan(dto);
	}

	// ADMIN, AGENT, CUSTOMER
	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','AGENT','CUSTOMER')")
	public PolicyPlanResponseDto getPlanById(
			@PathVariable Long id) {

		return policyPlanService.getPlanById(id);
	}

	// ADMIN, AGENT, CUSTOMER
	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN','AGENT','CUSTOMER')")
	public Page<PolicyPlanResponseDto> getAllPlans(
			@RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "10") int pageSize) {

		return policyPlanService.getAllPlans(pageNo, pageSize);
	}

	// ADMIN
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public PolicyPlanResponseDto updatePlan(
			@PathVariable Long id,
			@Valid @RequestBody PolicyPlanRequestDto dto) {

		return policyPlanService.updatePlan(id, dto);
	}

	// ADMIN
	@PatchMapping("/{id}/deactivate")
	@PreAuthorize("hasRole('ADMIN')")
	public String deactivatePlan(
			@PathVariable Long id) {

		policyPlanService.deactivatePlan(id);

		return "Plan deactivated successfully";
	}

	// ADMIN
	@GetMapping("/product/{productId}")
	@PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
	public List<PolicyPlanResponseDto> getPolicyByProductId(
			@PathVariable Long productId) {

		return policyPlanService.getPolicyByProductId(productId);
	}
}