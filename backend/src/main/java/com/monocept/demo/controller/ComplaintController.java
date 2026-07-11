package com.monocept.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.demo.dto.request.ComplaintRequestDto;
import com.monocept.demo.dto.response.ComplaintResponseDto;
import com.monocept.demo.service.ComplaintService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

	private final ComplaintService complaintService;

	@PostMapping
	public ResponseEntity<ComplaintResponseDto> submitComplaint(@RequestBody ComplaintRequestDto dto) {
		ComplaintResponseDto response = complaintService.submitComplaint(dto);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<ComplaintResponseDto>> getAllComplaints() {
		List<ComplaintResponseDto> complaints = complaintService.getAllCompliment();
		return ResponseEntity.ok(complaints);
	}

	@GetMapping("/my")
	public ResponseEntity<List<ComplaintResponseDto>> getMyComplaints(
	        Authentication authentication) {

	    String email = authentication.getName();

	    return ResponseEntity.ok(
	        complaintService.getComplimentByCustomer(email)
	    );
	}

}