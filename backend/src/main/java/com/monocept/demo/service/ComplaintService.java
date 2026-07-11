package com.monocept.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.ComplaintRequestDto;
import com.monocept.demo.dto.response.ComplaintResponseDto;

@Service	
public interface ComplaintService {

	ComplaintResponseDto submitComplaint(ComplaintRequestDto dto);
	
	List<ComplaintResponseDto> getAllCompliment();
	
	List<ComplaintResponseDto> getComplimentByCustomer(String email);
}
