package com.monocept.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.monocept.demo.dto.response.ClaimDocumentResponseDto;
import com.monocept.demo.dto.response.ClaimResponseDto;
import com.monocept.demo.dto.response.DocumentResponse;
import com.monocept.demo.entity.Claim;
import com.monocept.demo.service.ClaimService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin("http://localhost:5173/")
public class ClaimController {

	@Autowired
	private ClaimService claimService;

	// CUSTOMER
	@PreAuthorize("hasRole('CUSTOMER')")
	@PostMapping("/policy/{policyId}")
	public ResponseEntity<ClaimResponseDto> submitClaim(
			@PathVariable Long policyId,
			@Valid @RequestBody ClaimRequestDto requestDto) {

		return new ResponseEntity<>(
				claimService.submitClaim(policyId, requestDto),
				HttpStatus.CREATED);
	}

	// CUSTOMER, ADMIN, AGENT
	@PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','AGENT')")
	@GetMapping("/policy/{policyId}")
	public ResponseEntity<Page<ClaimResponseDto>> getClaimsByPolicy(
			@PathVariable Long policyId,
			Pageable pageable) {

		return ResponseEntity.ok(
				claimService.getClaimsByPolicy(policyId, pageable));
	}

	// CUSTOMER
	@PreAuthorize("hasRole('CUSTOMER')")
	@PutMapping("/{claimId}/withdraw")
	public ResponseEntity<ClaimResponseDto> withdrawClaim(
			@PathVariable Long claimId) {

		return ResponseEntity.ok(
				claimService.withdrawClaim(claimId));
	}

	// AGENT
	@PreAuthorize("hasRole('AGENT')")
	@PutMapping("/{claimId}/review")
	public ResponseEntity<ClaimResponseDto> reviewClaim(
			@PathVariable Long claimId,
			@Valid @RequestBody ClaimReviewRequestDto requestDto) {

		return ResponseEntity.ok(
				claimService.reviewClaim(claimId, requestDto));
	}

	// AGENT
	@PreAuthorize("hasRole('AGENT')")
	@PutMapping("/{claimId}/recommend-approval")
	public ResponseEntity<ClaimResponseDto> recommendClaimForApproval(
			@PathVariable Long claimId,
			@Valid @RequestBody ClaimRecommendationRequestDto requestDto) {

		return ResponseEntity.ok(
				claimService.recommendClaimForApproval(claimId, requestDto));
	}

	// AGENT
	@PreAuthorize("hasRole('AGENT')")
	@PutMapping("/{claimId}/recommend-rejection")
	public ResponseEntity<ClaimResponseDto> recommendClaimForRejection(
			@PathVariable Long claimId,
			@Valid @RequestBody ClaimRecommendationRequestDto requestDto) {

		return ResponseEntity.ok(
				claimService.recommendClaimForRejection(claimId, requestDto));
	}

	// ADMIN
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/{claimId}/approve")
	public ResponseEntity<ClaimResponseDto> approveClaim(
			@PathVariable Long claimId,
			@Valid @RequestBody ClaimDecisionRequestDto requestDto) {

		return ResponseEntity.ok(
				claimService.approveClaim(claimId, requestDto));
	}

	// ADMIN
	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/{claimId}/reject")
	public ResponseEntity<ClaimResponseDto> rejectClaim(
			@PathVariable Long claimId,
			@Valid @RequestBody ClaimDecisionRequestDto requestDto) {

		return ResponseEntity.ok(
				claimService.rejectClaim(claimId, requestDto));
	}

	// CUSTOMER, ADMIN, AGENT
	@PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','AGENT')")
	@GetMapping("/{claimId}")
	public ResponseEntity<ClaimResponseDto> getClaimById(
			@PathVariable Long claimId) {

		return ResponseEntity.ok(
				claimService.getClaimById(claimId));
	}

	// CUSTOMER, ADMIN, AGENT
	@PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','AGENT')")
	@GetMapping("/number/{claimNumber}")
	public ResponseEntity<ClaimResponseDto> getClaimByClaimNumber(
			@PathVariable String claimNumber) {

		return ResponseEntity.ok(
				claimService.getClaimByClaimNumber(claimNumber));
	}

	// CUSTOMER, ADMIN, AGENT
	@PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','AGENT')")
	@GetMapping("/customer/{customerId}")
	public ResponseEntity<Page<ClaimResponseDto>> getClaimsByCustomer(
			@PathVariable Long customerId,
			Pageable pageable) {

		return ResponseEntity.ok(
				claimService.getClaimsByCustomer(customerId, pageable));
	}

	// CUSTOMER, ADMIN, AGENT
	@PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','AGENT')")
	@GetMapping
	public ResponseEntity<Page<ClaimResponseDto>> getAllClaims(
			Pageable pageable) {

		return ResponseEntity.ok(
				claimService.getAllClaims(pageable));
	}

	// CUSTOMER
	@PreAuthorize("hasRole('CUSTOMER')")
	@PostMapping("/{claimId}/documents")
	public ResponseEntity<List<DocumentResponse>> uploadDocument(
	        @PathVariable Long claimId,
	        @RequestParam("files") MultipartFile[] files) {

	    return ResponseEntity.ok(
	            claimService.uploadDocuments(claimId, files));
	}
	
	@GetMapping("/{claimId}/documents")
	public ResponseEntity<List<ClaimDocumentResponseDto>>
	        getClaimDocuments(@PathVariable Long claimId) {

	    return ResponseEntity.ok(
	            claimService.getClaimDocuments(claimId));
	}
	
	@GetMapping("/submitted")
	@PreAuthorize("hasRole('AGENT')")
	public ResponseEntity<List<ClaimResponseDto>> getSubmittedClaims() {

	    return ResponseEntity.ok(
	            claimService.getSubmittedClaims()
	    );
	}
}