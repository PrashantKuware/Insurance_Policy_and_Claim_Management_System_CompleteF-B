package com.monocept.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.demo.dto.response.ClaimHistoryResponseDto;
import com.monocept.demo.service.ClaimStatusHistoryService;

@RestController
@RequestMapping("/api/claim-history")
public class ClaimStatusHistoryController {

	@Autowired
	private ClaimStatusHistoryService historyService;

	@GetMapping("/{claimId}")
	public ResponseEntity<List<ClaimHistoryResponseDto>> getClaimHistory(@PathVariable Long claimId) {

		return ResponseEntity.ok(historyService.getClaimHistory(claimId));
	}
}