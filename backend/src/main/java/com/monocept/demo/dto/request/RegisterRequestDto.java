package com.monocept.demo.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDto {

	@NotBlank(message = "Full name is required")
	@Pattern(regexp = "^[a-zA-Z]+$", message = "Username must contain only letters (A-Z, a-z)")
	private String fullName;

	@Email(message = "Invalid email format")
	@NotBlank(message = "Email is required")
	private String email;

	@Pattern(regexp = "^[6-9]\\d{9}$", message = "Mobile number must be 10 digits")
	@NotNull(message="Mobile Number cannot be Empty")
	private String mobileNumber;

	@Size(min = 6, message = "Password must contain at least 6 characters")
	private String password;
	
	private String emailOtp;
	private String mobileOtp;
}