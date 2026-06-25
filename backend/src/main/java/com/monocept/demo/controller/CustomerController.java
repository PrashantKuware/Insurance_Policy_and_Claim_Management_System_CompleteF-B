package com.monocept.demo.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.demo.dto.request.CustomerRequestDto;
import com.monocept.demo.dto.response.ApiResponse;
import com.monocept.demo.dto.response.CustomerResponseDto;
import com.monocept.demo.service.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173/")
public class CustomerController {

	private final CustomerService customerService;

	// CUSTOMER
	@PreAuthorize("hasRole('CUSTOMER')")
	@PostMapping
	public ApiResponse<CustomerResponseDto> createCustomer(
			@Valid @RequestBody CustomerRequestDto request) {

		CustomerResponseDto response = customerService.createCustomer(request);

		return ApiResponse.<CustomerResponseDto>builder()
				.success(true)
				.message("Customer profile created successfully")
				.data(response)
				.timestamp(LocalDateTime.now())
				.build();
	}

	// ADMIN, AGENT
	@PreAuthorize("hasAnyRole('ADMIN','AGENT')")
	@GetMapping("")
	public ApiResponse<List<CustomerResponseDto>> getAllCustomers() {

		List<CustomerResponseDto> list = customerService.getAllCustomers();

		return ApiResponse.<List<CustomerResponseDto>>builder()
				.success(true)
				.message("All Customers fetched successfully")
				.data(list)
				.timestamp(LocalDateTime.now())
				.build();
	}

	// ADMIN, AGENT
	@PreAuthorize("hasAnyRole('ADMIN','AGENT')")
	@GetMapping("/{customerId}")
	public ApiResponse<CustomerResponseDto> getCustomerById(
			@PathVariable Long customerId) {

		CustomerResponseDto response = customerService.getCustomerById(customerId);

		return ApiResponse.<CustomerResponseDto>builder()
				.success(true)
				.message("Customer fetched successfully")
				.data(response)
				.timestamp(LocalDateTime.now())
				.build();
	}

	// ADMIN
	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{customerId}")
	public ApiResponse<String> deleteCustomer(
			@PathVariable Long customerId) {

		customerService.deleteCustomer(customerId);

		return ApiResponse.<String>builder()
				.success(true)
				.message("Customer deleted successfully")
				.data("Customer removed")
				.timestamp(LocalDateTime.now())
				.build();
	}

	// CUSTOMER
	@PreAuthorize("hasRole('CUSTOMER')")
	@PutMapping
	public ApiResponse<CustomerResponseDto> updateCustomer(
			@Valid @RequestBody CustomerRequestDto customerRequestDto) {

		CustomerResponseDto response =
				customerService.updateCustomer(customerRequestDto);

		return ApiResponse.<CustomerResponseDto>builder()
				.success(true)
				.message("Customer updated successfully")
				.data(response)
				.timestamp(LocalDateTime.now())
				.build();
	}
}