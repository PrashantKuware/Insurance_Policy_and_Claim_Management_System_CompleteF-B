package com.monocept.demo.dto.request;

import lombok.Data;

@Data
public class ClaimRecommendationRequestDto {

    private Long claimId;

    private String remarks;

    private boolean approve;
}