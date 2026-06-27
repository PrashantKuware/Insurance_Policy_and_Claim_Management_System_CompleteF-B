package com.monocept.demo.dto.response;

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
    
    private Long policyId;
    private String customerName;
    private String customerEmail;
    private String planName;
    private BigDecimal coverageAmount;
    private BigDecimal premiumAmount;
    private LocalDate policyStartDate;
    private LocalDate policyEndDate;
}