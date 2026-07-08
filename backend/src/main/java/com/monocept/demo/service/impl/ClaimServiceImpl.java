package com.monocept.demo.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.demo.dto.request.ClaimDecisionRequestDto;
import com.monocept.demo.dto.request.ClaimRecommendationRequestDto;
import com.monocept.demo.dto.request.ClaimRequestDto;
import com.monocept.demo.dto.request.ClaimReviewRequestDto;
import com.monocept.demo.dto.response.ClaimDocumentResponseDto;
import com.monocept.demo.dto.response.ClaimResponseDto;
import com.monocept.demo.dto.response.DocumentResponse;
import com.monocept.demo.entity.Claim;
import com.monocept.demo.entity.ClaimDocument;
import com.monocept.demo.entity.Policy;
import com.monocept.demo.entity.User;
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
import com.monocept.demo.repository.UserRepository;
import com.monocept.demo.service.ClaimService;
import com.monocept.demo.service.ClaimStatusHistoryService;
import com.monocept.demo.service.DocumentService;

@Service
public class ClaimServiceImpl implements ClaimService {

	@Autowired
	private ClaimRepository claimRepository;
	
	@Autowired
	private UserRepository userRepository;

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

	private ClaimResponseDto mapToDto(Claim claim) {

	    ClaimResponseDto dto = new ClaimResponseDto();

	    dto.setClaimId(claim.getClaimId());
	    dto.setClaimNumber(claim.getClaimNumber());
	    
	    dto.setClaimReason(claim.getClaimReason());

	    if (claim.getClaimAmount() != null) {
	        dto.setClaimAmount(claim.getClaimAmount().doubleValue());
	    }

	    dto.setClaimReason(claim.getClaimReason());

	    if (claim.getClaimStatus() != null) {
	        dto.setClaimStatus(claim.getClaimStatus().name());
	    }

	    // Agent
	    if (claim.getReviewedBy() != null) {

	        dto.setAgentName(
	                claim.getReviewedBy().getFullName());

	        dto.setAgentEmail(
	                claim.getReviewedBy().getEmail());
	    }

	    // Admin
	    if (claim.getDecisionBy() != null) {

	        dto.setAdminName(
	                claim.getDecisionBy().getFullName());
	    }

	    dto.setAgentRemark(claim.getAgentRemarks());

	    dto.setAdminRemark(claim.getAdminRemarks());

	    dto.setApprovedDate(claim.getDecisionDate());

	    if (claim.getClaimStatus() == ClaimStatus.RECOMMENDED_FOR_APPROVAL) {

	        dto.setAgentRecommendation(
	                "Recommended For Approval");
	    }
	    else if (claim.getClaimStatus() == ClaimStatus.RECOMMENDED_FOR_REJECTION) {

	        dto.setAgentRecommendation(
	                "Recommended For Rejection");
	    }
	    else if (claim.getClaimStatus() == ClaimStatus.APPROVED) {

	        dto.setAgentRecommendation("Approved");
	    }
	    else if (claim.getClaimStatus() == ClaimStatus.REJECTED) {

	        dto.setAgentRecommendation("Rejected");
	    }

	    return dto;
	}
	
	@Override
	public ClaimResponseDto recommendClaimForApproval(Long claimId, ClaimRecommendationRequestDto requestDto) {
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Claim claim = getClaimEntity(claimId);
		
		String email = authentication.getName();

		User agent = userRepository.findByEmail(email).orElseThrow(() ->
		                new ResourceNotFoundException("Agent not found"));

		claim.setReviewedBy(agent);
		
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

		return mapToDto(claim);
	}

	@Override
	public ClaimResponseDto recommendClaimForRejection(Long claimId, ClaimRecommendationRequestDto requestDto) {
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Claim claim = getClaimEntity(claimId);
		
		String email = authentication.getName();

		User agent = userRepository.findByEmail(email).orElseThrow(() ->
		                new ResourceNotFoundException("Agent not found"));

		claim.setReviewedBy(agent);
		
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
		Authentication authentication =
	            SecurityContextHolder.getContext()
	                    .getAuthentication();

	    String email = authentication.getName();

	    User cusUser = userRepository
	            .findByEmail(email)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "Customer not found"
	                    ));

	    if (!cusUser.getActive()) {

	        throw new BadRequestException(
	                "Your account is inactive. You cannot buy policy."
	        );
	    }

		Policy policy = policyRepository.findById(policyId)
				.orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

		
		if (policy.getPolicyStatus() != PolicyStatus.ACTIVE) {
			throw new InvalidPolicyStatusException("Claim can only be raised for active policies");
		}

		boolean hasPendingClaim = claimRepository.existsByPolicyPolicyIdAndClaimStatusIn(policyId,
				List.of(ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW, ClaimStatus.RECOMMENDED_FOR_APPROVAL,
						ClaimStatus.RECOMMENDED_FOR_REJECTION));

		if (hasPendingClaim) {
			throw new BadRequestException("A claim is already pending for this policy");
		}

		if (claimRepository.existsByPolicyPolicyIdAndIncidentDate(policyId, requestDto.getIncidentDate())) {

			throw new DuplicateResourceException("Claim already exists for this incident date");
		}

		BigDecimal coverageAmount = policy.getPolicyPlan().getCoverageAmount();

		if (requestDto.getClaimAmount().compareTo(coverageAmount) > 0) {

			throw new BadRequestException("Claim amount cannot exceed policy coverage amount");
		}
		
		BigDecimal alreadyClaimed =
		        claimRepository.getTotalApprovedClaimAmount(policyId);

		BigDecimal remainingCoverage =
		        coverageAmount.subtract(alreadyClaimed);

		if (requestDto.getClaimAmount()
		        .compareTo(remainingCoverage) > 0) {

		    throw new BadRequestException(
		            "Remaining coverage amount is only ₹"
		                    + remainingCoverage);
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

		return mapToDto(claim);
	}
	
	@Override
	public ClaimResponseDto reviewClaim( Long claimId, ClaimReviewRequestDto requestDto) {

	    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	    Claim claim = getClaimEntity(claimId);
	    String email = authentication.getName();
	    
	    User agent = userRepository.findByEmail(email).orElseThrow(() ->
	                    new ResourceNotFoundException("Agent not found"));
	    claim.setReviewedBy(agent);
	    
	    User agentUser = userRepository
	            .findByEmail(email)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "Agent not found"
	                    ));

	    if (!agentUser.getActive()) {

	        throw new BadRequestException(
	                "Your account is inactive. You cannot review claims."
	        );
	    }
	    
	    User customerUser = claim.getPolicy()
	            .getCustomer()
	            .getUser();

	    if (!customerUser.getActive()) {

	        throw new BadRequestException(
	                "This claim cannot be reviewed because the customer account is inactive."
	        );
	    }
	    validateClaimNotFinalized(claim);

	    if (claim.getClaimStatus() != ClaimStatus.SUBMITTED) {

	        throw new InvalidClaimStatusException(
	                "Only submitted claims can be reviewed"
	        );
	    }

	    ClaimStatus oldStatus = claim.getClaimStatus();

	    claim.setClaimStatus(ClaimStatus.UNDER_REVIEW);

	    claim.setAgentRemarks(
	            requestDto.getRemarks()
	    );

	    claim.setUpdatedDate(
	            LocalDateTime.now()
	    );

	    claimRepository.save(claim);

	    historyService.saveStatusHistory(
	            claimId,
	            oldStatus,
	            ClaimStatus.UNDER_REVIEW,
	            requestDto.getRemarks()
	    );

	    return buildFullClaimDto(claim);
	}
	
	private ClaimResponseDto buildFullClaimDto(Claim claim) {

	    ClaimResponseDto dto = new ClaimResponseDto();

	    dto.setClaimId(claim.getClaimId());
	    dto.setClaimNumber(claim.getClaimNumber());
	    dto.setClaimAmount(claim.getClaimAmount().doubleValue());
	    dto.setClaimStatus(claim.getClaimStatus().name());
	    dto.setClaimReason(claim.getClaimReason());

	    Policy policy = claim.getPolicy();

	    dto.setPolicyId(policy.getPolicyId());

	    dto.setCustomerName(
	        policy.getCustomer()
	              .getUser()
	              .getFullName()
	    );

	    dto.setCustomerEmail(
	        policy.getCustomer()
	              .getUser()
	              .getEmail()
	    );

	    dto.setPlanName(
	        policy.getPolicyPlan()
	              .getPlanName()
	    );

	    dto.setCoverageAmount(
	        policy.getPolicyPlan()
	              .getCoverageAmount()
	    );

	    dto.setPremiumAmount(
	        policy.getPolicyPlan()
	              .getPremiumAmount()
	    );

	    dto.setPolicyStartDate(policy.getStartDate());
	    dto.setPolicyEndDate(policy.getEndDate());

	    return dto;
	}

	@Override
	public ClaimResponseDto approveClaim(Long claimId, ClaimDecisionRequestDto requestDto) {
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		String email = authentication.getName();
		
		Claim claim = getClaimEntity(claimId);
		
		User admin = userRepository
		        .findByEmail(email)
		        .orElseThrow(() ->
		            new ResourceNotFoundException("Admin not found"));
		
		validateClaimNotFinalized(claim);

		if (claim.getClaimStatus() != ClaimStatus.UNDER_REVIEW &&
			    claim.getClaimStatus() != ClaimStatus.RECOMMENDED_FOR_APPROVAL &&
			    claim.getClaimStatus() != ClaimStatus.RECOMMENDED_FOR_REJECTION) {

			    throw new InvalidClaimStatusException(
			        "Claim is not ready for decision"
			    );
			}

		ClaimStatus oldStatus = claim.getClaimStatus();

		claim.setClaimStatus(ClaimStatus.APPROVED);

		claim.setAdminRemarks(requestDto.getRemarks());

		claim.setUpdatedDate(LocalDateTime.now());

		claim.setDecisionBy(admin);

		claim.setDecisionDate(LocalDateTime.now());

		claimRepository.save(claim);

		historyService.saveStatusHistory(claimId, oldStatus, ClaimStatus.APPROVED, requestDto.getRemarks());

		 return mapToDto(claim);
	}

	@Override
	public ClaimResponseDto rejectClaim(Long claimId, ClaimDecisionRequestDto requestDto) {
		
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		String email = authentication.getName();

		User admin = userRepository
		        .findByEmail(email)
		        .orElseThrow(() ->
		            new ResourceNotFoundException("Admin not found"));
		
		Claim claim = getClaimEntity(claimId);

		validateClaimNotFinalized(claim);

		if (claim.getClaimStatus() != ClaimStatus.UNDER_REVIEW &&
			    claim.getClaimStatus() != ClaimStatus.RECOMMENDED_FOR_APPROVAL &&
			    claim.getClaimStatus() != ClaimStatus.RECOMMENDED_FOR_REJECTION) {

			    throw new InvalidClaimStatusException(
			        "Claim is not ready for decision"
			    );
			}

		ClaimStatus oldStatus = claim.getClaimStatus();

		claim.setClaimStatus(ClaimStatus.REJECTED);

		claim.setAdminRemarks(requestDto.getRemarks());

		claim.setUpdatedDate(LocalDateTime.now());
		
		claim.setDecisionBy(admin);

		claim.setDecisionDate(LocalDateTime.now());

		claimRepository.save(claim);

		historyService.saveStatusHistory(claimId, oldStatus, ClaimStatus.REJECTED, requestDto.getRemarks());

		 return mapToDto(claim);
	}

@Override
public ClaimResponseDto getClaimById(Long claimId) {

//<<<<<<< HEAD
	    Claim claim = getClaimEntity(claimId);

	    return mapToDto(claim);
	
//=======
//    Claim claim = getClaimEntity(claimId);
//    
//
//    ClaimResponseDto dto = new ClaimResponseDto();
//
//    dto.setClaimId(claim.getClaimId());
//    dto.setClaimNumber(claim.getClaimNumber());
//    dto.setClaimAmount(claim.getClaimAmount().doubleValue());
//    dto.setClaimStatus(claim.getClaimStatus().name());
//    dto.setClaimReason(claim.getClaimReason());
//    dto.setAdminName();
//
//    Policy policy = claim.getPolicy();
//
//    dto.setPolicyId(policy.getPolicyId());
//    
//    dto.setAgentName(
//    		policy.get);
//    
//    dto.setCustomerName(
//        policy.getCustomer()
//              .getUser()
//              .getFullName()
//    );
//
//    dto.setCustomerEmail(
//        policy.getCustomer()
//              .getUser()
//              .getEmail()
//    );
//
//    dto.setPlanName(
//        policy.getPolicyPlan()
//              .getPlanName()
//    );
//
//    dto.setCoverageAmount(
//        policy.getPolicyPlan()
//              .getCoverageAmount()
//    );
//
//    dto.setPremiumAmount(
//        policy.getPolicyPlan()
//              .getPremiumAmount()
//    );
//
//    dto.setPolicyStartDate(
//        policy.getStartDate()
//    );
//
//    dto.setPolicyEndDate(
//        policy.getEndDate()
//    );
//
//    return dto;
}
//>>>>>>> origin/mayank

	@Override
	public ClaimResponseDto getClaimByClaimNumber(String claimNumber) {

		Claim claim = claimRepository.findByClaimNumber(claimNumber)
				.orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

		 return mapToDto(claim);
	}

	@Override
	public Page<ClaimResponseDto> getClaimsByCustomer(Long customerId, Pageable pageable) {

		return claimRepository.findByPolicy_Customer_CustomerId(customerId, pageable)
				.map(this::mapToDto);
	}

	@Override
	public Page<ClaimResponseDto> getAllClaims(Pageable pageable) {

		return claimRepository.findAll(pageable).map(this::mapToDto);
	}

	private Claim getClaimEntity(Long claimId) {

		return claimRepository.findById(claimId).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
	}

	@Override
	public Page<ClaimResponseDto> getClaimsByPolicy(Long policyId, Pageable pageable) {

		return claimRepository.findByPolicyPolicyId(policyId, pageable)
				.map(this::mapToDto);
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

		return mapToDto(claim);
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
	
	public List<DocumentResponse> uploadDocuments(
	        Long claimId,
	        MultipartFile[] files) {

	    List<DocumentResponse> responses = new ArrayList<>();

	    for (MultipartFile file : files) {

	        responses.add(
	                uploadDocument(claimId, file)
	        );
	    }

	    return responses;
	}

	@Override
	public List<ClaimDocumentResponseDto> getClaimDocuments(Long claimId) {

	    return claimDocumentRepository
	            .findByClaimClaimId(claimId)
	            .stream()
	            .map(doc -> ClaimDocumentResponseDto.builder()
	                    .documentId(doc.getDocumentId())
	                    .originalFileName(doc.getOriginalFileName())
	                    .contentType(doc.getContentType())
	                    .sizeInBytes(doc.getSizeInBytes())
	                    .cloudinaryUrl(doc.getCloudinaryUrl())
	                    .resourceType(doc.getResourceType())
	                    .uploadedAt(doc.getUploadedAt())
	                    .build())
	            .toList();
	}
	
	@Override
	public List<ClaimResponseDto> getSubmittedClaims() {

	    return claimRepository.findByClaimStatus(ClaimStatus.SUBMITTED)
	            .stream()
	            .filter(claim ->
	                    claim.getPolicy()
	                         .getCustomer()
	                         .getUser()
	                         .getActive())
	            .map(claim -> {

	                ClaimResponseDto dto = new ClaimResponseDto();

	                dto.setClaimId(claim.getClaimId());
	                dto.setClaimNumber(claim.getClaimNumber());
	                dto.setClaimAmount(claim.getClaimAmount().doubleValue());
	                dto.setClaimReason(claim.getClaimReason());
	                dto.setClaimStatus(claim.getClaimStatus().name());

	                return dto;
	            })
	            .toList();
	}
}