package com.monocept.demo.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.monocept.demo.dto.response.ClaimHistoryResponseDto;
import com.monocept.demo.entity.Claim;
import com.monocept.demo.entity.ClaimStatusHistory;
import com.monocept.demo.enums.ClaimStatus;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.repository.ClaimRepository;
import com.monocept.demo.repository.ClaimStatusHistoryRepository;
import com.monocept.demo.service.ClaimStatusHistoryService;

@Service
public class ClaimStatusHistoryServiceImpl implements ClaimStatusHistoryService {

	@Autowired
	private ClaimRepository claimRepository;

	@Autowired
	private ClaimStatusHistoryRepository historyRepository;

	@Autowired
	private ModelMapper mapper;

	@Override
	public void saveStatusHistory(Long claimId, ClaimStatus oldStatus, ClaimStatus newStatus, String remarks) {

		Claim claim = claimRepository.findById(claimId)
				.orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

		ClaimStatusHistory history = new ClaimStatusHistory();

		history.setClaim(claim);

		history.setPreviousStatus(oldStatus);

		history.setNewStatus(newStatus);

		history.setRemarks(remarks);

		history.setUpdatedDate(LocalDateTime.now());

		historyRepository.save(history);
	}

	@Override
	public List<ClaimHistoryResponseDto> getClaimHistory(Long claimId) {

		return historyRepository.findByClaimClaimIdOrderByUpdatedDateAsc(claimId).stream()
				.map(history -> mapper.map(history, ClaimHistoryResponseDto.class)).collect(Collectors.toList());
	}
}