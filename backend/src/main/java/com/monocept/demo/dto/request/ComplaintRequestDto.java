package com.monocept.demo.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ComplaintRequestDto {
	
	@NotBlank(message = "Need Subject")
	private String subject;

	@Column(length = 1000)
	@NotBlank(message = "Need Description")
	private String description;

}
