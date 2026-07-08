package com.monocept.demo.dto.response;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ReviewResponseDto {

    private Long reviewId;

    private Long policyId;

    private Long planId;

    private String customerName;

    private Double rating;

    private String comment;

    private LocalDate createdAt;
}