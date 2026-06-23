package com.monocept.demo.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.PaymentRequestDto;
import com.monocept.demo.dto.response.PaymentResponseDto;
import com.monocept.demo.entity.Policy;
import com.monocept.demo.entity.PremiumPayment;
import com.monocept.demo.entity.User;
import com.monocept.demo.enums.PaymentStatus;
import com.monocept.demo.enums.PolicyStatus;
import com.monocept.demo.enums.Role;
import com.monocept.demo.exception.ForbiddenAccessException;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.exception.ValidationException;
import com.monocept.demo.repository.PolicyRepository;
import com.monocept.demo.repository.PremiumPaymentRepository;
import com.monocept.demo.repository.UserRepository;
import com.monocept.demo.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PremiumPaymentRepository paymentRepository;

	@Autowired
	private PolicyRepository policyRepository;
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper mapper;

	@Override
	public PaymentResponseDto payPremium(Long policyId, PaymentRequestDto requestDto) {

		Policy policy = policyRepository.findById(policyId)
				.orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

		if (requestDto.getAmount() == null || requestDto.getAmount().doubleValue() <= 0) {

			throw new ValidationException("Payment amount must be greater than zero");
		}

		String transactionReference = "TXN-" + System.currentTimeMillis();

		if (paymentRepository.findByTransactionReference(transactionReference).isPresent()) {

			throw new ValidationException("Duplicate transaction reference");
		}

		PremiumPayment payment = new PremiumPayment();

		payment.setPolicy(policy);
		payment.setAmount(requestDto.getAmount());
		payment.setPaymentMode(requestDto.getPaymentMode());
		payment.setPaymentDate(LocalDateTime.now());

		payment.setTransactionReference(transactionReference);

		payment.setPaymentStatus(PaymentStatus.SUCCESS);

		payment = paymentRepository.save(payment);

		// Update Total Premium Paid

		BigDecimal totalPaid = policy.getTotalPremiumPaid() == null ? BigDecimal.ZERO : policy.getTotalPremiumPaid();

		totalPaid = totalPaid.add(requestDto.getAmount());

		policy.setTotalPremiumPaid(totalPaid);

		// Activate Policy

		if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) {

			policy.setPolicyStatus(PolicyStatus.ACTIVE);

			policy.setStartDate(LocalDate.now());

			policy.setEndDate(LocalDate.now().plusYears(policy.getPolicyPlan().getDuration()));
		}

		policyRepository.save(policy);

		return mapper.map(payment, PaymentResponseDto.class);
	}

	@Override
	public PaymentResponseDto getPaymentById(Long paymentId) {

		PremiumPayment payment = paymentRepository.findById(paymentId)
				.orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

		validatePaymentAccess(payment);

		return mapper.map(payment, PaymentResponseDto.class);
	}

	@Override
	public Page<PaymentResponseDto> getPaymentsByPolicy(Long policyId, Pageable pageable) {

		Policy policy = policyRepository.findById(policyId)
				.orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

		validatePolicyAccess(policy);

		return paymentRepository.findByPolicyPolicyId(policyId, pageable)
				.map(payment -> mapper.map(payment, PaymentResponseDto.class));
	}
	
	private User getLoggedInUser() {

	    Authentication authentication =
	            SecurityContextHolder
	                    .getContext()
	                    .getAuthentication();

	    String email =
	            authentication.getName();

	    return userRepository.findByEmail(email)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "User not found"));
	}

	@Override
	public Page<PaymentResponseDto> getAllPayments(Pageable pageable) {

		return paymentRepository.findAll(pageable).map(payment -> mapper.map(payment, PaymentResponseDto.class));
	}

	@Override
	public PaymentResponseDto updatePaymentStatus(Long paymentId, String status) {

		PremiumPayment payment = paymentRepository.findById(paymentId)
				.orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

		payment.setPaymentStatus(PaymentStatus.valueOf(status));

		paymentRepository.save(payment);

		return mapper.map(payment, PaymentResponseDto.class);
	}
	
	private void validatePaymentAccess(
	        PremiumPayment payment) {

	    User loggedInUser =
	            getLoggedInUser();

	    if (loggedInUser.getRole() == Role.ADMIN
	            || loggedInUser.getRole() == Role.AGENT) {
	        return;
	    }

	    Long ownerId =
	            payment.getPolicy()
	                    .getCustomer()
	                    .getUser()
	                    .getUserId();

	    if (!ownerId.equals(
	            loggedInUser.getUserId())) {

	        throw new ForbiddenAccessException(
	                "You can view only your own payments");
	    }
	}
	
	private void validatePolicyAccess(
	        Policy policy) {

	    User loggedInUser =
	            getLoggedInUser();

	    if (loggedInUser.getRole() == Role.ADMIN
	            || loggedInUser.getRole() == Role.AGENT) {
	        return;
	    }

	    Long ownerId =
	            policy.getCustomer()
	                    .getUser()
	                    .getUserId();

	    if (!ownerId.equals(
	            loggedInUser.getUserId())) {

	        throw new ForbiddenAccessException(
	                "You can access only your own payments");
	    }
	}
}