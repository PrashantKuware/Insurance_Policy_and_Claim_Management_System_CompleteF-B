package com.monocept.demo.controller;

import java.util.List;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.monocept.demo.dto.response.DocumentResponse;
import com.monocept.demo.service.DocumentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers/documents")
@RequiredArgsConstructor
public class CustomerDocumentController {
	private final DocumentService documentService;

	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<DocumentResponse> uploadDocument(@RequestParam("file") MultipartFile file,
			Authentication authentication) {

		String email = authentication.name();

		return ResponseEntity.ok(documentService.uploadDocument(file, email));
	}

	@GetMapping
	public ResponseEntity<List<DocumentResponse>> getMyDocuments(Authentication authentication) {

		String email = authentication.name();

		return ResponseEntity.ok(documentService.getMyDocuments(email));
	}
}