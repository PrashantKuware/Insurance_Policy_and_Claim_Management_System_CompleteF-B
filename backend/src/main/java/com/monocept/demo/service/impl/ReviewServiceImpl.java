package com.monocept.demo.service.impl;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.ReviewRequestDto;
import com.monocept.demo.dto.response.ReviewResponseDto;
import com.monocept.demo.entity.Customer;
import com.monocept.demo.entity.Policy;
import com.monocept.demo.entity.Review;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.repository.CustomerRepository;
import com.monocept.demo.repository.PolicyRepository;
import com.monocept.demo.repository.ReviewRepository;
import com.monocept.demo.service.ReviewService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public ReviewResponseDto addReview(ReviewRequestDto dto) {

        Policy policy = policyRepository.findById(dto.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

        Customer customer = customerRepository
                .findByUserEmail(SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (!policy.getCustomer().getCustomerId()
                .equals(customer.getCustomerId())) {
            throw new RuntimeException("You can review only your own policy");
        }

        boolean alreadyReviewed = reviewRepository
                .existsByCustomerIdAndPolicyId(
                        customer.getCustomerId(),
                        dto.getPolicyId());

        if (alreadyReviewed) {
            throw new RuntimeException("You already reviewed this policy");
        }

        Review review = new Review();

        review.setCustomerId(customer.getCustomerId());
        review.setPolicyId(policy.getPolicyId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        Review savedReview = reviewRepository.save(review);

        ReviewResponseDto response = new ReviewResponseDto();

        response.setReviewId(savedReview.getReviewId());
        response.setPolicyId(savedReview.getPolicyId());
        response.setCustomerName(customer.getUser().getFullName());
        response.setRating(savedReview.getRating());
        response.setComment(savedReview.getComment());
        response.setCreatedAt(savedReview.getCreatedAt());

        return response;
    }

    @Override
    public boolean existsByCustomerIdAndPolicyId(
            Long customerId,
            Long policyId) {

        return reviewRepository
                .existsByCustomerIdAndPolicyId(
                        customerId,
                        policyId);
    }

    @Override
    public List<ReviewResponseDto> getReviewsByPlanId(Long planId) {

        List<Policy> policies =
                policyRepository.findByPolicyPlanPlanId(planId);

        List<Long> policyIds = policies.stream()
                .map(Policy::getPolicyId)
                .toList();

        List<Review> reviews =
                reviewRepository.findByPolicyIdIn(policyIds);

        return reviews.stream().map(review -> {

            Customer customer =
                    customerRepository.findById(review.getCustomerId())
                            .orElse(null);

            ReviewResponseDto dto =
                    new ReviewResponseDto();

            dto.setReviewId(review.getReviewId());
            dto.setPolicyId(review.getPolicyId());
            dto.setCustomerName(
                    customer != null
                            ? customer.getUser().getFullName()
                            : "Unknown User");
            dto.setRating(review.getRating());
            dto.setComment(review.getComment());
            dto.setCreatedAt(review.getCreatedAt());

            return dto;

        }).toList();
    }

    @Override
    public Double getAverageRating(Long planId) {

        List<Policy> policies =
                policyRepository.findByPolicyPlanPlanId(planId);

        List<Long> policyIds = policies.stream()
                .map(Policy::getPolicyId)
                .toList();

        if (policyIds.isEmpty()) {
            return 0.0;
        }

        Double avg =
                reviewRepository.getAverageRatingByPolicyIds(policyIds);

        return avg == null ? 0.0 : avg;
    }
}