package com.monocept.demo.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.monocept.demo.dto.response.DocumentResponse;

public interface DocumentService
{
	 DocumentResponse uploadDocument(
	            MultipartFile file,
	            String customerEmail);

	    List<DocumentResponse> getMyDocuments(
	            String customerEmail);

	    Map<String,Object> uploadFile(
	            MultipartFile file);

}