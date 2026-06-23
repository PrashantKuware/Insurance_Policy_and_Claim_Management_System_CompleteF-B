package com.monocept.demo.dto.response;

import java.math.BigDecimal;

import com.monocept.demo.enums.PremiumType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PolicyPlanResponseDto {

	private Long planId;

	private String productName;

	private String planName;

	private PremiumType premiumType;

	private BigDecimal coverageAmount;

	private BigDecimal premiumAmount;

	private Integer duration;

	private String termsConditions;

	private boolean active;
}