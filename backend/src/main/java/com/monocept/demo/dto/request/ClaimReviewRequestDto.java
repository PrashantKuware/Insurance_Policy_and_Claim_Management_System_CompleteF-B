package com.monocept.demo.dto.request;

import lombok.Data;

@Data
public class ClaimReviewRequestDto {

    private Long claimId;

    private String remarks;
}