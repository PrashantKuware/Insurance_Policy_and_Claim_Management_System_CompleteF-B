package com.monocept.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.demo.dto.request.ClaimDecisionRequestDto;
import com.monocept.demo.dto.request.ClaimRecommendationRequestDto;
import com.monocept.demo.dto.request.ClaimRequestDto;
import com.monocept.demo.dto.request.ClaimReviewRequestDto;
import com.monocept.demo.dto.response.ClaimResponseDto;
import com.monocept.demo.dto.response.DocumentResponse;
import com.monocept.demo.service.ClaimService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

	@Autowired
	private ClaimService claimService;

	@PostMapping("/policy/{policyId}")
	public ResponseEntity<ClaimResponseDto> submitClaim(@PathVariable Long policyId,
			@Valid @RequestBody ClaimRequestDto requestDto) {

		return new ResponseEntity<>(claimService.submitClaim(policyId, requestDto), HttpStatus.CREATED);
	}

	@GetMapping("/policy/{policyId}")
	public ResponseEntity<Page<ClaimResponseDto>> getClaimsByPolicy(@PathVariable Long policyId, Pageable pageable) {

		return ResponseEntity.ok(claimService.getClaimsByPolicy(policyId, pageable));
	}

	@PutMapping("/{claimId}/withdraw")
	public ResponseEntity<ClaimResponseDto> withdrawClaim(@PathVariable Long claimId) {

		return ResponseEntity.ok(claimService.withdrawClaim(claimId));
	}

	@PutMapping("/{claimId}/review")
	public ResponseEntity<ClaimResponseDto> reviewClaim(@PathVariable Long claimId,
			@Valid @RequestBody ClaimReviewRequestDto requestDto) {

		return ResponseEntity.ok(claimService.reviewClaim(claimId, requestDto));
	}

	@PutMapping("/{claimId}/recommend-approval")
	public ResponseEntity<ClaimResponseDto> recommendClaimForApproval(@PathVariable Long claimId,
			@Valid @RequestBody ClaimRecommendationRequestDto requestDto) {

		return ResponseEntity.ok(claimService.recommendClaimForApproval(claimId, requestDto));
	}

	@PutMapping("/{claimId}/recommend-rejection")
	public ResponseEntity<ClaimResponseDto> recommendClaimForRejection(@PathVariable Long claimId,
			@Valid @RequestBody ClaimRecommendationRequestDto requestDto) {

		return ResponseEntity.ok(claimService.recommendClaimForRejection(claimId, requestDto));
	}

	@PutMapping("/{claimId}/approve")
	public ResponseEntity<ClaimResponseDto> approveClaim(@PathVariable Long claimId,
			@Valid @RequestBody ClaimDecisionRequestDto requestDto) {

		return ResponseEntity.ok(claimService.approveClaim(claimId, requestDto));
	}

	@PutMapping("/{claimId}/reject")
	public ResponseEntity<ClaimResponseDto> rejectClaim(@PathVariable Long claimId,
			@Valid @RequestBody ClaimDecisionRequestDto requestDto) {

		return ResponseEntity.ok(claimService.rejectClaim(claimId, requestDto));
	}

	@GetMapping("/{claimId}")
	public ResponseEntity<ClaimResponseDto> getClaimById(@PathVariable Long claimId) {

		return ResponseEntity.ok(claimService.getClaimById(claimId));
	}

	@GetMapping("/number/{claimNumber}")
	public ResponseEntity<ClaimResponseDto> getClaimByClaimNumber(@PathVariable String claimNumber) {

		return ResponseEntity.ok(claimService.getClaimByClaimNumber(claimNumber));
	}

	@GetMapping("/customer/{customerId}")
	public ResponseEntity<Page<ClaimResponseDto>> getClaimsByCustomer(@PathVariable Long customerId,
			Pageable pageable) {

		return ResponseEntity.ok(claimService.getClaimsByCustomer(customerId, pageable));
	}

	@GetMapping
	public ResponseEntity<Page<ClaimResponseDto>> getAllClaims(Pageable pageable) {

		return ResponseEntity.ok(claimService.getAllClaims(pageable));
	}
	
	@PostMapping("/{claimId}/documents")
	public ResponseEntity<DocumentResponse> uploadDocument( @PathVariable Long claimId, @RequestParam("file") MultipartFile file) 
	{
		System.out.println("Upload API called");
	    return ResponseEntity.ok( claimService.uploadDocument(claimId, file) );
	}
}