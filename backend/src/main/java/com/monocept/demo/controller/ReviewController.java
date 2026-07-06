package com.monocept.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.demo.dto.request.ReviewRequestDto;
import com.monocept.demo.dto.response.ReviewResponseDto;
import com.monocept.demo.entity.Customer;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.repository.CustomerRepository;
import com.monocept.demo.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final CustomerRepository customerRepository;

    @PostMapping
    public ResponseEntity<ReviewResponseDto> addReview(
            @Valid @RequestBody ReviewRequestDto dto) {

        return ResponseEntity.ok(reviewService.addReview(dto));
    }

    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<ReviewResponseDto>> getReviewsByPlanId(
            @PathVariable Long planId) {

        return ResponseEntity.ok(
                reviewService.getReviewsByPlanId(planId));
    }

    @GetMapping("/average/{planId}")
    public ResponseEntity<Double> getAverageRating(
            @PathVariable Long planId) {

        return ResponseEntity.ok(
                reviewService.getAverageRating(planId));
    }
    
    @GetMapping("/exists/{policyId}")
    public ResponseEntity<Boolean> checkReviewExists(
            @PathVariable Long policyId) {

        Customer customer = customerRepository
                .findByUserEmail(
                    SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getName())
                .orElseThrow(() ->
                    new ResourceNotFoundException("Customer not found"));

        return ResponseEntity.ok(
                reviewService.existsByCustomerIdAndPolicyId(
                        customer.getCustomerId(),
                        policyId));
    }
}