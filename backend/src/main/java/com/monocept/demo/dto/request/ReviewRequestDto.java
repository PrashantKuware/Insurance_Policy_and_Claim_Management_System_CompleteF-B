package com.monocept.demo.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewRequestDto {

	@NotNull(message = "Policy ID is required")
	private Long policyId;

	@NotNull(message = "Rating is required")
	@Min(value = 1, message = "Rating must be between 1 and 5")
	@Max(value = 5, message = "Rating must be between 1 and 5")
	private Double rating;

	@NotBlank(message = "Comment is required")
	@Size(min = 5, max = 500, message = "Comment must be between 5 and 500 characters")
	private String comment;
}