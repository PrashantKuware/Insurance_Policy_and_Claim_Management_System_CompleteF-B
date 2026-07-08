package com.monocept.demo.service;

import java.util.List;

import com.monocept.demo.dto.request.ReviewRequestDto;
import com.monocept.demo.dto.response.ReviewResponseDto;

public interface ReviewService {

    ReviewResponseDto addReview(ReviewRequestDto dto);

    boolean existsByCustomerIdAndPolicyId(
            Long customerId,
            Long policyId);

    List<ReviewResponseDto> getReviewsByPlanId(
            Long planId);

    Double getAverageRating(
            Long planId);
    
}