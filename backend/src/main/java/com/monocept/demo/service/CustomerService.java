package com.monocept.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.monocept.demo.dto.request.CustomerRequestDto;
import com.monocept.demo.dto.response.CustomerResponseDto;

@Service
public interface CustomerService {

//	CustomerResponseDto createCustomer(Long userId, CustomerRequestDto customerRequestDto);
	CustomerResponseDto createCustomer(CustomerRequestDto customerRequestDto);

	List<CustomerResponseDto> getAllCustomers();

	CustomerResponseDto getCustomerById(Long customerId);

//	CustomerResponseDto updateCustomer(Long customerId, CustomerRequestDto customerRequestDto);
	CustomerResponseDto updateCustomer(CustomerRequestDto customerRequestDto);

	void deleteCustomer(Long customerId);

//	Page<CustomerResponseDto> getCustomersByAgent(Long agentId, Pageable pageable);
}
