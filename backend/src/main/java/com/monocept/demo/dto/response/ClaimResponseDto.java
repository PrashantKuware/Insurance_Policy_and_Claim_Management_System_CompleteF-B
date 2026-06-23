package com.monocept.demo.dto.response;

import lombok.Data;

@Data
public class ClaimResponseDto {

    private Long claimId;

    private String claimNumber;

    private Double claimAmount;

    private String claimStatus;

    private String claimReason;
}