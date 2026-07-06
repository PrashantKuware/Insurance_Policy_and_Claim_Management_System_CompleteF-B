package com.monocept.demo.service.impl;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.itextpdf.text.Document;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.monocept.demo.dto.response.ClaimHistoryResponseDto;
import com.monocept.demo.entity.Claim;
import com.monocept.demo.entity.ClaimStatusHistory;
import com.monocept.demo.entity.User;
import com.monocept.demo.enums.ClaimStatus;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.repository.ClaimRepository;
import com.monocept.demo.repository.ClaimStatusHistoryRepository;
import com.monocept.demo.repository.UserRepository;
import com.monocept.demo.service.ClaimStatusHistoryService;

@Service
public class ClaimStatusHistoryServiceImpl implements ClaimStatusHistoryService {

	@Autowired
	private ClaimRepository claimRepository;

	@Autowired
	private ClaimStatusHistoryRepository historyRepository;

	@Autowired
	private ModelMapper mapper;
	
	@Autowired
	private UserRepository userRepository;

	@Override
	public void saveStatusHistory(Long claimId, ClaimStatus oldStatus, ClaimStatus newStatus, String remarks) {

		Claim claim = claimRepository.findById(claimId)
				.orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

		ClaimStatusHistory history = new ClaimStatusHistory();

		history.setClaim(claim);

		history.setPreviousStatus(oldStatus);

		history.setNewStatus(newStatus);

		history.setRemarks(remarks);
		User loggedInUser = getLoggedInUser();

		history.setUpdatedBy(loggedInUser);
		history.setUpdatedDate(LocalDateTime.now());

		historyRepository.save(history);
	}

	@Override
	public List<ClaimHistoryResponseDto> getClaimHistory(Long claimId) {

	    return historyRepository
	            .findByClaimClaimIdOrderByUpdatedDateAsc(claimId)
	            .stream()
	            .map(history -> {

	                ClaimHistoryResponseDto dto =
	                        new ClaimHistoryResponseDto();

	                dto.setPreviousStatus(
	                        history.getPreviousStatus() == null
	                                ? null
	                                : history.getPreviousStatus().name());

	                dto.setNewStatus(
	                        history.getNewStatus().name());

	                dto.setRemarks(
	                        history.getRemarks());

	                dto.setUpdatedBy(
	                        history.getUpdatedBy() == null
	                                ? "SYSTEM"
	                                : history.getUpdatedBy().getFullName());

	                dto.setUpdatedDate(
	                        history.getUpdatedDate().toString());

	                return dto;
	            })
	            .toList();
	}
	
	private User getLoggedInUser() {

	    Authentication authentication =
	            SecurityContextHolder
	                    .getContext()
	                    .getAuthentication();

	    String email = authentication.getName();

	    return userRepository.findByEmail(email)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "User not found"));
	}
	
	@Override
	public List<ClaimHistoryResponseDto>
	getPolicyClaimHistory(Long policyId) {

	    return historyRepository
	            .findByClaimPolicyPolicyIdOrderByUpdatedDateAsc(policyId)
	            .stream()
	            .map(history -> {

	                ClaimHistoryResponseDto dto =
	                        new ClaimHistoryResponseDto();

	                dto.setPreviousStatus(
	                        history.getPreviousStatus() == null
	                                ? null
	                                : history.getPreviousStatus().name());

	                dto.setNewStatus(
	                        history.getNewStatus().name());

	                dto.setRemarks(
	                        history.getRemarks());

	                dto.setUpdatedBy(
	                        history.getUpdatedBy() == null
	                                ? "SYSTEM"
	                                : history.getUpdatedBy().getFullName());

	                dto.setUpdatedDate(
	                        history.getUpdatedDate().toString());

	                return dto;
	            })
	            .toList();
	}
	
	public List<ClaimHistoryResponseDto>
	getClaimHistoryByPolicy(Long policyId) {

	    return historyRepository
	            .findByClaimPolicyPolicyIdOrderByUpdatedDateAsc(policyId)
	            .stream()
	            .map(history -> {

	                ClaimHistoryResponseDto dto =
	                        new ClaimHistoryResponseDto();

	                dto.setPreviousStatus(
	                        history.getPreviousStatus() == null
	                                ? "-"
	                                : history.getPreviousStatus().name());

	                dto.setNewStatus(
	                        history.getNewStatus().name());

	                dto.setRemarks(
	                        history.getRemarks());

	                dto.setUpdatedBy(
	                        history.getUpdatedBy() == null
	                                ? "-"
	                                : history.getUpdatedBy().getFullName());

	                dto.setUpdatedDate(
	                        history.getUpdatedDate().toString());

	                return dto;
	            })
	            .toList();
	}

	@Override
	public byte[] generateClaimHistoryPdf(
	        Long policyId) {

	    try {

	        List<ClaimHistoryResponseDto> historyList =
	                getClaimHistoryByPolicy(policyId);

	        ByteArrayOutputStream out =
	                new ByteArrayOutputStream();

	        Document document =
	                new Document();

	        PdfWriter.getInstance(
	                document,
	                out);

	        document.open();

	        Font titleFont =
	                new Font(
	                        Font.FontFamily.HELVETICA,
	                        18,
	                        Font.BOLD);

	        Paragraph title =
	                new Paragraph(
	                        "Claim History Report",
	                        titleFont);

	        title.setAlignment(
	                Paragraph.ALIGN_CENTER);

	        document.add(title);

	        document.add(
	                new Paragraph(" ")
	        );

	        document.add(
	                new Paragraph(
	                        "Policy ID : " + policyId)
	        );

	        document.add(
	                new Paragraph(
	                        "Generated On : "
	                                + LocalDateTime.now())
	        );

	        document.add(
	                new Paragraph(" ")
	        );

	        PdfPTable table =
	                new PdfPTable(5);

	        table.setWidthPercentage(100);

	        table.addCell(
	                new PdfPCell(
	                        new Phrase("Previous Status")));

	        table.addCell(
	                new PdfPCell(
	                        new Phrase("New Status")));

	        table.addCell(
	                new PdfPCell(
	                        new Phrase("Remarks")));

	        table.addCell(
	                new PdfPCell(
	                        new Phrase("Updated By")));

	        table.addCell(
	                new PdfPCell(
	                        new Phrase("Updated Date")));

	        for (ClaimHistoryResponseDto history : historyList) {

	            table.addCell(
	                    history.getPreviousStatus());

	            table.addCell(
	                    history.getNewStatus());

	            table.addCell(
	                    history.getRemarks());

	            table.addCell(
	                    history.getUpdatedBy());

	            table.addCell(
	                    history.getUpdatedDate());
	        }

	        document.add(table);

	        document.close();

	        return out.toByteArray();

	    } catch (Exception e) {

	        throw new RuntimeException(
	                "Error generating PDF",
	                e);
	    }
	}
}