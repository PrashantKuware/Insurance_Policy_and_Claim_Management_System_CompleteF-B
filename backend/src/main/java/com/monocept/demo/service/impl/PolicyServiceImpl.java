package com.monocept.demo.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.PolicyPurchaseRequestDto;
import com.monocept.demo.dto.response.PolicyResponseDto;
import com.monocept.demo.entity.Customer;
import com.monocept.demo.entity.Policy;
import com.monocept.demo.entity.PolicyPlan;
import com.monocept.demo.entity.User;
import com.monocept.demo.enums.PolicyStatus;
import com.monocept.demo.enums.Role;
import com.monocept.demo.exception.ForbiddenAccessException;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.exception.ValidationException;
import com.monocept.demo.repository.CustomerRepository;
import com.monocept.demo.repository.PolicyPlanRepository;
import com.monocept.demo.repository.PolicyRepository;
import com.monocept.demo.repository.UserRepository;
import com.monocept.demo.service.PolicyService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PolicyServiceImpl implements PolicyService {

	private final PolicyRepository policyRepository;
	private final CustomerRepository customerRepository;
	private final PolicyPlanRepository planRepository;
	private final UserRepository userRepository;

	@Override
	public PolicyResponseDto purchasePolicy(PolicyPurchaseRequestDto dto) {

		User loggedInUser = getLoggedInUser();

		Customer customer = customerRepository.findByUserUserId(loggedInUser.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));

		PolicyPlan plan = planRepository.findById(dto.getPlanId())
				.orElseThrow(() -> new ResourceNotFoundException("Plan not found"));

		if (!plan.getActive()) {
			throw new ValidationException("Selected plan is inactive");
		}

		Policy policy = Policy.builder().policyNumber("POL" + System.currentTimeMillis()).customer(customer)
				.policyPlan(plan).policyStatus(PolicyStatus.PENDING_PAYMENT).createdDate(LocalDateTime.now()).build();

		policyRepository.save(policy);

		return mapToResponse(policy);
	}

	@Override
	public List<PolicyResponseDto> getPoliciesByCustomer() {

		User loggedInUser = getLoggedInUser();

		Customer customer = customerRepository.findByUserUserId(loggedInUser.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

		return policyRepository.findByCustomerCustomerId(customer.getCustomerId()).stream().map(this::mapToResponse)
				.toList();
	}

	private PolicyResponseDto mapToResponse(Policy policy) {

		return PolicyResponseDto.builder().policyId(policy.getPolicyId()).policyNumber(policy.getPolicyNumber())
				.customerName(policy.getCustomer().getUser().getFullName())
				.planName(policy.getPolicyPlan().getPlanName()).startDate(policy.getStartDate())
				.endDate(policy.getEndDate()).policyStatus(policy.getPolicyStatus())
				.totalPremiumPaid(policy.getTotalPremiumPaid()).build();
	}

//	@Override
//	public PolicyResponseDto issuePolicy(Long customerId, Long planId) {
//
//		PolicyPurchaseRequestDto dto = new PolicyPurchaseRequestDto();
//
//		dto.setCustomerId(customerId);
//		dto.setPlanId(planId);
//
//		return purchasePolicy(dto);
//	}

	@Override
	public Page<PolicyResponseDto> getAllPolicies(int pageNo, int pageSize, String sortBy) {

		Pageable pageable = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));

		return policyRepository.findAll(pageable).map(this::mapToResponse);
	}

	@Override
	public void cancelPolicy(Long policyId) {

		Policy policy = policyRepository.findById(policyId)
				.orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

		policy.setPolicyStatus(PolicyStatus.CANCELLED);

		policy.setUpdatedDate(LocalDateTime.now());

		policyRepository.save(policy);
	}

	@Override
	public PolicyResponseDto getPolicyById(Long policyId) {

		Policy policy = policyRepository.findById(policyId)
				.orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

		validatePolicyAccess(policy);

		return mapToResponse(policy);
	}

	@Override
	public void activatePolicy(Long policyId) {

		Policy policy = policyRepository.findById(policyId)
				.orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

		policy.setPolicyStatus(PolicyStatus.ACTIVE);

		policy.setStartDate(LocalDate.now());

		policy.setEndDate(LocalDate.now().plusYears(policy.getPolicyPlan().getDuration()));

		policy.setUpdatedDate(LocalDateTime.now());

		policyRepository.save(policy);
	}

	private void validatePolicyAccess(Policy policy) {

		User loggedInUser = getLoggedInUser();

		if (loggedInUser.getRole() == Role.ADMIN || loggedInUser.getRole() == Role.AGENT) {
			return;
		}

		Long ownerId = policy.getCustomer().getUser().getUserId();

		if (!ownerId.equals(loggedInUser.getUserId())) {

			throw new ForbiddenAccessException("You can access only your own policy");
		}
	}

	private User getLoggedInUser() {

		String email = SecurityContextHolder.getContext().getAuthentication().getName();

		return userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
	}

}