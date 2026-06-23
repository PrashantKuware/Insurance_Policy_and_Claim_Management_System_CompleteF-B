package com.monocept.demo.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class ClaimRequestDto {
	private Long policyId;
	@Column(nullable = false)
	private BigDecimal claimAmount;
	@Column(nullable = false)
	private String claimReason;
	@Column(nullable = false)
	private LocalDate incidentDate;

}