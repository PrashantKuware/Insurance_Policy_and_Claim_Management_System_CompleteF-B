package com.monocept.demo.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.ComplaintRequestDto;
import com.monocept.demo.dto.response.ComplaintResponseDto;
import com.monocept.demo.entity.Complaint;
import com.monocept.demo.entity.Customer;
import com.monocept.demo.entity.User;
import com.monocept.demo.repository.ComplaintRepository;
import com.monocept.demo.repository.CustomerRepository;
import com.monocept.demo.repository.UserRepository;
import com.monocept.demo.service.ComplaintService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComplaintServiceImpl implements ComplaintService {

	private final ComplaintRepository complaintRepository;
	private final CustomerRepository customerRepository;
	private final UserRepository userRepository;

	@Override
	public ComplaintResponseDto submitComplaint(ComplaintRequestDto dto) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		Customer customer = customerRepository.findByUser(user)
				.orElseThrow(() -> new RuntimeException("Customer not found"));

		Complaint complaint = new Complaint();
		complaint.setSubject(dto.getSubject());
		complaint.setDescription(dto.getDescription());
		complaint.setCreatedAt(LocalDateTime.now());
		complaint.setCustomer(customer);
		Complaint savedComplaint = complaintRepository.save(complaint);

		return mapToDto(savedComplaint);

	}

	@Override
	public List<ComplaintResponseDto> getAllCompliment() {

		return complaintRepository.findAllByOrderByComplaintIdDesc().stream().map(this::mapToDto).toList();
	}

	@Override
	public List<ComplaintResponseDto> getComplimentByCustomer(String email) {

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Customer customer = customerRepository.findByUser(user)
				.orElseThrow(() -> new RuntimeException("Customer not found"));

		return complaintRepository.findByCustomer(customer).stream().map(this::mapToDto).toList();
	}

	private ComplaintResponseDto mapToDto(Complaint complaint) {

		ComplaintResponseDto dto = new ComplaintResponseDto();

		dto.setComplaintId(complaint.getComplaintId());

		dto.setSubject(complaint.getSubject());

		dto.setDescription(complaint.getDescription());

		dto.setCreatedAt(complaint.getCreatedAt());

		if (complaint.getCustomer() != null) {

			dto.setCustomerId(complaint.getCustomer().getCustomerId());

			dto.setCustomerName(complaint.getCustomer().getUser().getFullName());
		}

		return dto;
	}

}