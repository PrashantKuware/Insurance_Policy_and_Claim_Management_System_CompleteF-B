package com.monocept.demo.controller;

import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.demo.dto.response.ClaimHistoryResponseDto;
import com.monocept.demo.service.ClaimStatusHistoryService;

@RestController
@RequestMapping("/api/claim-history")
@CrossOrigin("http://localhost:5173/")
public class ClaimStatusHistoryController {

	@Autowired
	private ClaimStatusHistoryService historyService;

	// ADMIN, AGENT, CUSTOMER
	@PreAuthorize("hasAnyRole('ADMIN','AGENT', 'CUSTOMER')")
	@GetMapping("/{claimId}")
	public ResponseEntity<List<ClaimHistoryResponseDto>> getClaimHistory(
			@PathVariable Long claimId) {

		return ResponseEntity.ok(
				historyService.getClaimHistory(claimId));
	}
	
	@PreAuthorize("hasAnyRole('ADMIN','AGENT', 'CUSTOMER')")
	@GetMapping("/policy/{policyId}")
	public ResponseEntity<List<ClaimHistoryResponseDto>>
	getPolicyClaimHistory(
	        @PathVariable Long policyId) {

	    return ResponseEntity.ok(
	            historyService.getPolicyClaimHistory(
	                    policyId));
	}
	
	@GetMapping("/policy/{policyId}/pdf")
	public ResponseEntity<byte[]>
	downloadClaimHistoryPdf(
	        @PathVariable Long policyId) {

	    byte[] pdf =
	            historyService
	                    .generateClaimHistoryPdf(
	                            policyId);

	    return ResponseEntity.ok()
	            .header(
	                    HttpHeaders.CONTENT_DISPOSITION,
	                    "attachment; filename=claim-history.pdf")
	            .contentType(
	                    MediaType.APPLICATION_PDF)
	            .body(pdf);
	}
}