package com.monocept.demo.dto.response;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class ClaimResponseDto {

    private Long claimId;
    private String claimNumber;
    private Double claimAmount;
    private String claimStatus;
    private String claimReason;

    // Agent Details
    private String agentName;
    private String agentEmail;
    private String agentRemark;
    private String agentRecommendation;

    // Admin Details
    private String adminName;
    private String adminRemark;
    private LocalDateTime approvedDate;

    // Policy Details
    private Long policyId;
    private String customerName;
    private String customerEmail;
    private String planName;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private LocalDate policyStartDate;
    private LocalDate policyEndDate;
}