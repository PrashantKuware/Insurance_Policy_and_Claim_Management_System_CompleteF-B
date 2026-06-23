package com.monocept.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import com.monocept.demo.dto.request.PolicyPlanRequestDto;
import com.monocept.demo.dto.response.PolicyPlanResponseDto;
import com.monocept.demo.service.PolicyPlanService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class PolicyPlanController {

	private final PolicyPlanService policyPlanService;

	@PostMapping
	public PolicyPlanResponseDto addPlan(@Valid @RequestBody PolicyPlanRequestDto dto) {

		return policyPlanService.addPlan(dto);
	}

	@GetMapping("/{id}")
	public PolicyPlanResponseDto getPlanById(@PathVariable Long id) {

		return policyPlanService.getPlanById(id);
	}

	@GetMapping
	public Page<PolicyPlanResponseDto> getAllPlans(@RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "10") int pageSize) {

		return policyPlanService.getAllPlans(pageNo, pageSize);
	}

	@PutMapping("/{id}")
	public PolicyPlanResponseDto updatePlan(@PathVariable Long id, @Valid @RequestBody PolicyPlanRequestDto dto) {

		return policyPlanService.updatePlan(id, dto);
	}

	@PatchMapping("/{id}/deactivate")
	public String deactivatePlan(@PathVariable Long id) {

		policyPlanService.deactivatePlan(id);

		return "Plan deactivated successfully";
	}
}