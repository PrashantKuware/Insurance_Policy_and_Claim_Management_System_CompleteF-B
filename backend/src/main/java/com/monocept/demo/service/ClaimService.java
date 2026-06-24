package com.monocept.demo.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.demo.dto.request.ClaimDecisionRequestDto;
import com.monocept.demo.dto.request.ClaimRecommendationRequestDto;
import com.monocept.demo.dto.request.ClaimRequestDto;
import com.monocept.demo.dto.request.ClaimReviewRequestDto;
import com.monocept.demo.dto.response.ClaimDocumentResponseDto;
import com.monocept.demo.dto.response.ClaimResponseDto;
import com.monocept.demo.dto.response.DocumentResponse;
import com.monocept.demo.entity.Claim;

public interface ClaimService {

	ClaimResponseDto submitClaim(Long policyId, ClaimRequestDto requestDto);

	ClaimResponseDto reviewClaim(Long claimId, ClaimReviewRequestDto requestDto);

	ClaimResponseDto recommendClaimForApproval(Long claimId, ClaimRecommendationRequestDto requestDto);

	ClaimResponseDto recommendClaimForRejection(Long claimId, ClaimRecommendationRequestDto requestDto);

	ClaimResponseDto approveClaim(Long claimId, ClaimDecisionRequestDto requestDto);

	ClaimResponseDto rejectClaim(Long claimId, ClaimDecisionRequestDto requestDto);

	ClaimResponseDto getClaimById(Long claimId);

	ClaimResponseDto getClaimByClaimNumber(String claimNumber);

	Page<ClaimResponseDto> getClaimsByCustomer(Long customerId, Pageable pageable);

	Page<ClaimResponseDto> getAllClaims(Pageable pageable);

	Page<ClaimResponseDto> getClaimsByPolicy(Long policyId, Pageable pageable);

	ClaimResponseDto withdrawClaim(Long claimId);

	DocumentResponse uploadDocument(Long claimId, MultipartFile file);

	List<ClaimDocumentResponseDto> getClaimDocuments(Long claimId);

	public List<DocumentResponse> uploadDocuments(Long claimId, MultipartFile[] files);

	public List<ClaimResponseDto> getSubmittedClaims();
}