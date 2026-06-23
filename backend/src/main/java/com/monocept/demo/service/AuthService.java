package com.monocept.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.LoginRequestDto;
import com.monocept.demo.dto.request.RegisterRequestDto;
import com.monocept.demo.dto.request.UserStatusUpdateDto;
import com.monocept.demo.dto.response.AuthResponseDto;
import com.monocept.demo.entity.User;

@Service
public interface AuthService {

	AuthResponseDto registerUser(RegisterRequestDto registerRequestDto);

	AuthResponseDto loginUser(LoginRequestDto loginRequestDto);

	List<User> getAllUser();

	AuthResponseDto createAgent(RegisterRequestDto request);

	void updateUserStatus(Long userId, UserStatusUpdateDto dto);
	
	void sendEmailOtp(String email);
	
	void sendMobileOtp(String mobileNumber);
}
