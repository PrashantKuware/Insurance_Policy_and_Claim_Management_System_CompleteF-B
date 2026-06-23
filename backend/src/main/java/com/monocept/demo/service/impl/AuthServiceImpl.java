package com.monocept.demo.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.LoginRequestDto;
import com.monocept.demo.dto.request.RegisterRequestDto;
import com.monocept.demo.dto.request.UserStatusUpdateDto;
import com.monocept.demo.dto.response.AuthResponseDto;
import com.monocept.demo.entity.OtpVerification;
import com.monocept.demo.entity.User;
import com.monocept.demo.enums.Role;
import com.monocept.demo.exception.DuplicateResourceException;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.repository.OtpRepository;
import com.monocept.demo.repository.UserRepository;
import com.monocept.demo.security.CustomUserDetails;
import com.monocept.demo.security.JwtService;
import com.monocept.demo.service.AuthService;
import com.monocept.demo.service.EmailService;
import com.monocept.demo.service.SmsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final OtpRepository otpRepository;
	private final EmailService emailService;
	private final SmsService smsService;

	@Override
	public AuthResponseDto registerUser(RegisterRequestDto dto) {

	    if (userRepository.existsByEmail(dto.getEmail())) {
	        throw new DuplicateResourceException("Email already registered");
	    }

	    // 1. EMAIL OTP VERIFY
	    OtpVerification emailOtp = otpRepository.findByEmail(dto.getEmail())
	            .orElseThrow(() -> new RuntimeException("Email OTP not found"));

	    if (!emailOtp.getOtp().equals(dto.getEmailOtp())) {
	        throw new RuntimeException("Invalid Email OTP");
	    }

	    if (emailOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
	        throw new RuntimeException("Email OTP expired");
	    }

	    // 2. MOBILE OTP VERIFY
	    OtpVerification mobileOtp = otpRepository.findByEmail(dto.getMobileNumber())
	            .orElseThrow(() -> new RuntimeException("Mobile OTP not found"));

	    if (!mobileOtp.getOtp().equals(dto.getMobileOtp())) {
	        throw new RuntimeException("Invalid Mobile OTP");
	    }

	    if (mobileOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
	        throw new RuntimeException("Mobile OTP expired");
	    }

	    // 3. CREATE USER
	    User user = new User();
	    user.setFullName(dto.getFullName());
	    user.setEmail(dto.getEmail());
	    user.setMobileNumber(dto.getMobileNumber());
	    user.setPassword(passwordEncoder.encode(dto.getPassword()));
	    user.setRole(Role.CUSTOMER);

	    user.setEmailVerified(true);
	    user.setMobileVerified(true);

	    userRepository.save(user);

	    otpRepository.delete(emailOtp);
	    otpRepository.delete(mobileOtp);

	    return new AuthResponseDto(null, null, "User Registered Successfully");
	}
	@Override
	public AuthResponseDto loginUser(LoginRequestDto loginRequestDto) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword()));

		CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

		String token = jwtService.generateToken(userDetails);

		return new AuthResponseDto(token, "Bearer", userDetails.getUsername());
	}

	@Override
	public List<User> getAllUser() {

		return userRepository.findAll();
	}

	@Override
	public AuthResponseDto createAgent(RegisterRequestDto request) {

		User agent = new User();

		agent.setFullName(request.getFullName());
		agent.setEmail(request.getEmail());
		agent.setMobileNumber(request.getMobileNumber());

		agent.setPassword(passwordEncoder.encode(request.getPassword()));

		agent.setRole(Role.AGENT);

		userRepository.save(agent);

		return new AuthResponseDto(null, null, "Agent created successfully");
	}

	@Override
	public void updateUserStatus(Long userId, UserStatusUpdateDto dto) {

		User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

		user.setActive(dto.getActive());

		userRepository.save(user);
	}

	@Override
	public void sendEmailOtp(String email) {

		String otp = String.valueOf((int) ((Math.random() * 900000) + 100000));

		OtpVerification verification = otpRepository.findByEmail(email).orElse(new OtpVerification());

		verification.setEmail(email);
		verification.setOtp(otp);
		verification.setExpiryTime(LocalDateTime.now().plusMinutes(5));

		otpRepository.save(verification);

		emailService.sendOtp(email, otp);
	}
	
	@Override
	public void sendMobileOtp(String mobileNumber) {

	    String otp = String.valueOf(
	            (int)((Math.random() * 900000) + 100000));

	    OtpVerification verification =
	            otpRepository.findByEmail(mobileNumber)
	                    .orElse(new OtpVerification());

	    verification.setEmail(mobileNumber);
	    verification.setOtp(otp);
	    verification.setExpiryTime(
	            LocalDateTime.now().plusMinutes(5));

	    otpRepository.save(verification);

	    smsService.sendOtp(mobileNumber, otp);
	}
}