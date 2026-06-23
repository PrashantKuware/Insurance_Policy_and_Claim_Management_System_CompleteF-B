package com.monocept.demo.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.monocept.demo.enums.PolicyStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PolicyResponseDto {

    private Long policyId;

    private String policyNumber;

    private String customerName;

    private String planName;

    private LocalDate startDate;

    private LocalDate endDate;

    private PolicyStatus policyStatus;

    private BigDecimal totalPremiumPaid;
}