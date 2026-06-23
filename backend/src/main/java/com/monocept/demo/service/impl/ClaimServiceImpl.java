package com.monocept.demo.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.demo.dto.request.ClaimDecisionRequestDto;
import com.monocept.demo.dto.request.ClaimRecommendationRequestDto;
import com.monocept.demo.dto.request.ClaimRequestDto;
import com.monocept.demo.dto.request.ClaimReviewRequestDto;
import com.monocept.demo.dto.response.ClaimResponseDto;
import com.monocept.demo.dto.response.DocumentResponse;
import com.monocept.demo.entity.Claim;
import com.monocept.demo.entity.ClaimDocument;
import com.monocept.demo.entity.Policy;
import com.monocept.demo.enums.ClaimStatus;
import com.monocept.demo.enums.PolicyStatus;
import com.monocept.demo.exception.BadRequestException;
import com.monocept.demo.exception.DuplicateResourceException;
import com.monocept.demo.exception.InvalidClaimStatusException;
import com.monocept.demo.exception.InvalidPolicyStatusException;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.repository.ClaimDocumentRepository;
import com.monocept.demo.repository.ClaimRepository;
import com.monocept.demo.repository.PolicyRepository;
import com.monocept.demo.service.ClaimService;
import com.monocept.demo.service.ClaimStatusHistoryService;
import com.monocept.demo.service.DocumentService;

@Service
public class ClaimServiceImpl implements ClaimService {

	@Autowired
	private ClaimRepository claimRepository;

	@Autowired
	private PolicyRepository policyRepository;

	@Autowired
	private ClaimStatusHistoryService historyService;

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private DocumentService fileUploadService;

	@Autowired
	private ClaimDocumentRepository claimDocumentRepository;

	@Override
	public ClaimResponseDto recommendClaimForApproval(Long claimId, ClaimRecommendationRequestDto requestDto) {

		Claim claim = getClaimEntity(claimId);

		if (claim.getClaimStatus() != ClaimStatus.UNDER_REVIEW) {
			throw new InvalidClaimStatusException("Claim must be under review");
		}

		ClaimStatus oldStatus = claim.getClaimStatus();

		claim.setClaimStatus(ClaimStatus.RECOMMENDED_FOR_APPROVAL);

		claim.setAgentRemarks(requestDto.getRemarks());

		claim.setUpdatedDate(LocalDateTime.now());

		claimRepository.save(claim);

		historyService.saveStatusHistory(claimId, oldStatus, ClaimStatus.RECOMMENDED_FOR_APPROVAL,
				requestDto.getRemarks());

		return mapper.map(claim, ClaimResponseDto.class);
	}

	@Override
	public ClaimResponseDto recommendClaimForRejection(Long claimId, ClaimRecommendationRequestDto requestDto) {

		Claim claim = getClaimEntity(claimId);

		if (claim.getClaimStatus() != ClaimStatus.UNDER_REVIEW) {
			throw new InvalidClaimStatusException("Claim must be under review");
		}

		ClaimStatus oldStatus = claim.getClaimStatus();

		claim.setClaimStatus(ClaimStatus.RECOMMENDED_FOR_REJECTION);

		claim.setAgentRemarks(requestDto.getRemarks());

		claim.setUpdatedDate(LocalDateTime.now());

		claimRepository.save(claim);

		historyService.saveStatusHistory(claimId, oldStatus, ClaimStatus.RECOMMENDED_FOR_REJECTION,
				requestDto.getRemarks());

		return mapper.map(claim, ClaimResponseDto.class);
	}

	@Override
	public ClaimResponseDto submitClaim(Long policyId, ClaimRequestDto requestDto) {

		Policy policy = policyRepository.findById(policyId)
				.orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

		if (policy.getPolicyStatus() != PolicyStatus.ACTIVE) {
			throw new InvalidPolicyStatusException("Claim can only be raised for active policies");
		}

		if (claimRepository.existsByPolicyPolicyIdAndIncidentDate(policyId, requestDto.getIncidentDate())) {

			throw new DuplicateResourceException("Claim already exists for this incident date");
		}

		BigDecimal coverageAmount = policy.getPolicyPlan().getCoverageAmount();

		if (requestDto.getClaimAmount().compareTo(coverageAmount) > 0) {

			throw new BadRequestException("Claim amount cannot exceed policy coverage amount");
		}

		Claim claim = new Claim();

		claim.setClaimNumber("CLM" + System.currentTimeMillis());

		claim.setPolicy(policy);

		claim.setClaimAmount(requestDto.getClaimAmount());

		claim.setClaimReason(requestDto.getClaimReason());

		claim.setIncidentDate(requestDto.getIncidentDate());

		claim.setClaimStatus(ClaimStatus.SUBMITTED);

		claim.setCreatedDate(LocalDateTime.now());

		claim.setUpdatedDate(LocalDateTime.now());

		claim = claimRepository.save(claim);

		historyService.saveStatusHistory(claim.getClaimId(), null, ClaimStatus.SUBMITTED, "Claim Submitted");

		return mapper.map(claim, ClaimResponseDto.class);
	}

	@Override
	public ClaimResponseDto reviewClaim(Long claimId, ClaimReviewRequestDto requestDto) {

		Claim claim = getClaimEntity(claimId);

		validateClaimNotFinalized(claim);

		if (claim.getClaimStatus() != ClaimStatus.SUBMITTED) {
			throw new InvalidClaimStatusException("Only submitted claims can be reviewed");
		}

		ClaimStatus oldStatus = claim.getClaimStatus();

		claim.setClaimStatus(ClaimStatus.UNDER_REVIEW);

		claim.setAgentRemarks(requestDto.getRemarks());

		claim.setUpdatedDate(LocalDateTime.now());

		claimRepository.save(claim);

		historyService.saveStatusHistory(claimId, oldStatus, ClaimStatus.UNDER_REVIEW, requestDto.getRemarks());

		return mapper.map(claim, ClaimResponseDto.class);
	}

	@Override
	public ClaimResponseDto approveClaim(Long claimId, ClaimDecisionRequestDto requestDto) {

		Claim claim = getClaimEntity(claimId);

		validateClaimNotFinalized(claim);

		if (claim.getClaimStatus() != ClaimStatus.RECOMMENDED_FOR_APPROVAL) {
			throw new InvalidClaimStatusException("Claim must be RECOMMENDED_FOR_APPROVAL or UNDER_REVIEW");
		}

		ClaimStatus oldStatus = claim.getClaimStatus();

		claim.setClaimStatus(ClaimStatus.APPROVED);

		claim.setAdminRemarks(requestDto.getRemarks());

		claim.setUpdatedDate(LocalDateTime.now());

		claimRepository.save(claim);

		historyService.saveStatusHistory(claimId, oldStatus, ClaimStatus.APPROVED, requestDto.getRemarks());

		return mapper.map(claim, ClaimResponseDto.class);
	}

	@Override
	public ClaimResponseDto rejectClaim(Long claimId, ClaimDecisionRequestDto requestDto) {

		Claim claim = getClaimEntity(claimId);

		validateClaimNotFinalized(claim);

		if (claim.getClaimStatus() != ClaimStatus.RECOMMENDED_FOR_REJECTION) {
			throw new InvalidClaimStatusException("Claim must be under review");
		}

		ClaimStatus oldStatus = claim.getClaimStatus();

		claim.setClaimStatus(ClaimStatus.REJECTED);

		claim.setAdminRemarks(requestDto.getRemarks());

		claim.setUpdatedDate(LocalDateTime.now());

		claimRepository.save(claim);

		historyService.saveStatusHistory(claimId, oldStatus, ClaimStatus.REJECTED, requestDto.getRemarks());

		return mapper.map(claim, ClaimResponseDto.class);
	}

	@Override
	public ClaimResponseDto getClaimById(Long claimId) {

		Claim claim = getClaimEntity(claimId);

		return mapper.map(claim, ClaimResponseDto.class);
	}

	@Override
	public ClaimResponseDto getClaimByClaimNumber(String claimNumber) {

		Claim claim = claimRepository.findByClaimNumber(claimNumber)
				.orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

		return mapper.map(claim, ClaimResponseDto.class);
	}

	@Override
	public Page<ClaimResponseDto> getClaimsByCustomer(Long customerId, Pageable pageable) {

		return claimRepository.findByPolicy_Customer_CustomerId(customerId, pageable)
				.map(claim -> mapper.map(claim, ClaimResponseDto.class));
	}

	@Override
	public Page<ClaimResponseDto> getAllClaims(Pageable pageable) {

		return claimRepository.findAll(pageable).map(claim -> mapper.map(claim, ClaimResponseDto.class));
	}

	private Claim getClaimEntity(Long claimId) {

		return claimRepository.findById(claimId).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
	}

	@Override
	public Page<ClaimResponseDto> getClaimsByPolicy(Long policyId, Pageable pageable) {

		return claimRepository.findByPolicyPolicyId(policyId, pageable)
				.map(claim -> mapper.map(claim, ClaimResponseDto.class));
	}

	@Override
	public ClaimResponseDto withdrawClaim(Long claimId) {

		Claim claim = getClaimEntity(claimId);

		validateClaimNotFinalized(claim);

		if (claim.getClaimStatus() != ClaimStatus.SUBMITTED) {

			throw new InvalidClaimStatusException("Only submitted claims can be withdrawn");
		}

		ClaimStatus oldStatus = claim.getClaimStatus();

		claim.setClaimStatus(ClaimStatus.WITHDRAWN);

		claim.setUpdatedDate(LocalDateTime.now());

		claimRepository.save(claim);

		historyService.saveStatusHistory(claimId, oldStatus, ClaimStatus.WITHDRAWN, "Claim Withdrawn");

		return mapper.map(claim, ClaimResponseDto.class);
	}

	private void validateClaimNotFinalized(Claim claim) {

		if (claim.getClaimStatus() == ClaimStatus.APPROVED || claim.getClaimStatus() == ClaimStatus.REJECTED) {

			throw new InvalidClaimStatusException("Approved or rejected claims cannot be modified");
		}
	}

	@Override
	public DocumentResponse uploadDocument(Long claimId, MultipartFile file) {

		Claim claim = claimRepository.findById(claimId)
				.orElseThrow(() -> new ResourceNotFoundException("Claim not found with id : " + claimId));

		Map<String, Object> cloudinaryResponse = fileUploadService.uploadFile(file);

		ClaimDocument document = ClaimDocument.builder().claim(claim).originalFileName(file.getOriginalFilename())
				.contentType(file.getContentType()).sizeInBytes(file.getSize())
				.cloudinaryPublicId(cloudinaryResponse.get("public_id").toString())
				.cloudinaryUrl(cloudinaryResponse.get("secure_url").toString())
				.resourceType(cloudinaryResponse.get("resource_type").toString()).build();

		ClaimDocument savedDocument = claimDocumentRepository.save(document);

		return DocumentResponse.builder().documentId(savedDocument.getDocumentId())
				.originalFileName(savedDocument.getOriginalFileName()).contentType(savedDocument.getContentType())
				.sizeInBytes(savedDocument.getSizeInBytes()).cloudinaryPublicId(savedDocument.getCloudinaryPublicId())
				.cloudinaryUrl(savedDocument.getCloudinaryUrl()).resourceType(savedDocument.getResourceType())
				.uploadedAt(savedDocument.getUploadedAt()).build();
	}
}