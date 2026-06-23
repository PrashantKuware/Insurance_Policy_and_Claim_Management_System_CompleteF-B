package com.monocept.demo.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.PolicyPlanRequestDto;
import com.monocept.demo.dto.response.PolicyPlanResponseDto;
import com.monocept.demo.entity.InsuranceProduct;
import com.monocept.demo.entity.PolicyPlan;
import com.monocept.demo.exception.DuplicateResourceException;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.repository.InsuranceProductRepository;
import com.monocept.demo.repository.PolicyPlanRepository;
import com.monocept.demo.service.PolicyPlanService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyPlanServiceImpl implements PolicyPlanService {

	private final PolicyPlanRepository policyPlanRepository;
	private final InsuranceProductRepository productRepository;

	@Override
	public PolicyPlanResponseDto addPlan(PolicyPlanRequestDto planRequestDto) {
		if (policyPlanRepository.existsByPlanName(planRequestDto.getPlanName())) {
			throw new DuplicateResourceException("Plan already exists with name : " + planRequestDto.getPlanName());
		}

		InsuranceProduct product = productRepository.findById(planRequestDto.getProductId()).orElseThrow(
				() -> new ResourceNotFoundException("Product not found with id : " + planRequestDto.getProductId()));

		PolicyPlan policyPlan = new PolicyPlan();

		policyPlan.setProduct(product);
		policyPlan.setCoverageAmount(planRequestDto.getCoverageAmount());
		policyPlan.setDuration(planRequestDto.getDuration());
		policyPlan.setPlanName(planRequestDto.getPlanName());
		policyPlan.setPremiumAmount(planRequestDto.getPremiumAmount());
		policyPlan.setPremiumType(planRequestDto.getPremiumType());
		policyPlan.setTermsConditions(planRequestDto.getTermsConditions());

		policyPlanRepository.save(policyPlan);

		return mapToResponse(policyPlan);
	}

	@Override
	public PolicyPlanResponseDto updatePlan(Long policyId, PolicyPlanRequestDto planRequestDto) {
		PolicyPlan plan = policyPlanRepository.findById(policyId)
				.orElseThrow(() -> new ResourceNotFoundException("Plan not found with id : " + policyId));

		InsuranceProduct product = productRepository.findById(planRequestDto.getProductId()).orElseThrow(
				() -> new ResourceNotFoundException("Product not found with id : " + planRequestDto.getProductId()));

		plan.setProduct(product);
		plan.setPlanName(planRequestDto.getPlanName());
		plan.setCoverageAmount(planRequestDto.getCoverageAmount());
		plan.setPremiumAmount(planRequestDto.getPremiumAmount());
		plan.setPremiumType(planRequestDto.getPremiumType());
		plan.setDuration(planRequestDto.getDuration());
		plan.setTermsConditions(planRequestDto.getTermsConditions());

		policyPlanRepository.save(plan);

		return mapToResponse(plan);
	}

	@Override
	public PolicyPlanResponseDto getPlanById(Long planId) {

		PolicyPlan plan = policyPlanRepository.findById(planId)
				.orElseThrow(() -> new ResourceNotFoundException("Plan not found with id : " + planId));

		return mapToResponse(plan);
	}

	@Override
	public Page<PolicyPlanResponseDto> getAllPlans(int pageNo, int pageSize) {

		Pageable pageable = PageRequest.of(pageNo, pageSize);

		return policyPlanRepository.findAll(pageable).map(this::mapToResponse);
	}

	@Override
	public void deactivatePlan(Long policyId) {
		PolicyPlan plan = policyPlanRepository.findById(policyId)
				.orElseThrow(() -> new ResourceNotFoundException("Plan not found with id : " + policyId));

		plan.setActive(false);

		policyPlanRepository.save(plan);
	}

	private PolicyPlanResponseDto mapToResponse(PolicyPlan plan) {
		return PolicyPlanResponseDto.builder().planId(plan.getPlanId()).productName(plan.getProduct().getProductName())
				.planName(plan.getPlanName()).coverageAmount(plan.getCoverageAmount())
				.premiumAmount(plan.getPremiumAmount()).premiumType(plan.getPremiumType()).duration(plan.getDuration())
				.active(plan.getActive()).build();
	}

}
