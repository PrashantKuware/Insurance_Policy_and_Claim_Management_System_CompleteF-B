package com.monocept.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.demo.dto.request.LoginRequestDto;
import com.monocept.demo.dto.request.RegisterRequestDto;
import com.monocept.demo.dto.request.UserStatusUpdateDto;
import com.monocept.demo.dto.response.AuthResponseDto;
import com.monocept.demo.entity.User;
import com.monocept.demo.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public AuthResponseDto register(@Valid @RequestBody RegisterRequestDto request) {

		return authService.registerUser(request);

	}

	@PostMapping("/send-email-otp")
	public String sendEmailOtp(@RequestParam String email) {
		authService.sendEmailOtp(email);
		return "Email OTP Sent";
	}

	@PostMapping("/send-mobile-otp")
	public String sendMobileOtp(
	        @RequestParam String mobileNumber) {
	    System.out.println("Received = [" + mobileNumber + "]");

	    authService.sendMobileOtp(mobileNumber);

	    return "Mobile OTP Sent Successfully";
	}

	@PostMapping("/login")
	public AuthResponseDto login(@Valid @RequestBody LoginRequestDto request) {

		return authService.loginUser(request);
	}

	@GetMapping("/get")
	public List<User> getAllUser() {
		return authService.getAllUser();
	}

	@PostMapping("/agent")
	public AuthResponseDto createAgent(@RequestBody RegisterRequestDto request) {

		return authService.createAgent(request);
	}

	@PatchMapping("/{userId}/status")
	public String updateStatus(@PathVariable Long userId, @RequestBody UserStatusUpdateDto dto) {

		authService.updateUserStatus(userId, dto);

		return "User status updated";
	}

}
