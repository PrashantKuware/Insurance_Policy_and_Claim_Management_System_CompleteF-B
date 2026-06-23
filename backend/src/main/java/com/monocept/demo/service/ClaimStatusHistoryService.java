package com.monocept.demo.service;


import java.util.List;

import com.monocept.demo.dto.response.ClaimHistoryResponseDto;
import com.monocept.demo.enums.ClaimStatus;



public interface ClaimStatusHistoryService {

	 void saveStatusHistory(
	            Long claimId,
	            ClaimStatus oldStatus,
	            ClaimStatus newStatus,
	            String remarks);

	    List<ClaimHistoryResponseDto>
	    getClaimHistory(Long claimId);
}