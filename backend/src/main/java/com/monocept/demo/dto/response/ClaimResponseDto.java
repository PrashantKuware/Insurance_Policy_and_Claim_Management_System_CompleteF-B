package com.monocept.demo.dto.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ClaimResponseDto {

    private Long claimId;

    private String claimNumber;

    private Double claimAmount;

    private String claimStatus;

    private String claimReason;
    
    private String agentName;
    
    private String agentEmail;
    
    private String agentRemark;
    
    private String agentRecommendation;

    private String adminName;
    
    private String adminRemark;
    
    private LocalDateTime approvedDate;
}