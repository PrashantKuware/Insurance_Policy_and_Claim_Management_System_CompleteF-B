package com.monocept.demo.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.monocept.demo.dto.response.DocumentResponse;
import com.monocept.demo.entity.Customer;
import com.monocept.demo.entity.CustomerDocument;
import com.monocept.demo.exception.BadRequestException;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.repository.CustomerDocumentRepository;
import com.monocept.demo.repository.CustomerRepository;
import com.monocept.demo.service.DocumentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

	private final Cloudinary cloudinary;

	private final CustomerRepository customerRepository;

	private final CustomerDocumentRepository documentRepository;

	private static final List<String> ALLOWED_TYPES = List.of("application/pdf", "application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png",
			"image/webp");

	@Transactional
	public DocumentResponse uploadDocument(MultipartFile file, String customerEmail) {

		validateFile(file);

		Customer customer = customerRepository.findByUserEmail(customerEmail)
		        .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

		try {

			String resourceType = getCloudinaryResourceType(file.getContentType());

			String publicId = buildPublicId(file.getOriginalFilename(), customer.getCustomerId(), resourceType);

			Map<String, Object> options = new HashMap<>();

			options.put("resource_type", resourceType);

			options.put("public_id", publicId);

			Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

			CustomerDocument document = CustomerDocument.builder().customer(customer)
					.originalFileName(file.getOriginalFilename()).contentType(file.getContentType())
					.sizeInBytes(file.getSize()).cloudinaryPublicId(uploadResult.get("public_id").toString())
					.cloudinaryUrl(uploadResult.get("secure_url").toString())
					.resourceType(uploadResult.get("resource_type").toString()).uploadedAt(LocalDateTime.now()).build();

			document = documentRepository.save(document);

			return toDocumentResponse(document);

		} catch (IOException ex) {

			throw new BadRequestException("Unable to upload document");
		}
	}

	public List<DocumentResponse> getMyDocuments(String customerEmail) {

		return documentRepository.findByCustomerUserEmail(customerEmail).stream().map(this::toDocumentResponse).toList();
	}

	private void validateFile(MultipartFile file) {

		if (file == null || file.isEmpty()) {

			throw new BadRequestException("Please upload a file");
		}

		if (file.getSize() > 5 * 1024 * 1024) {

			throw new BadRequestException("File size must be less than 5 MB");
		}

		if (!ALLOWED_TYPES.contains(file.getContentType())) {

			throw new BadRequestException("Only PDF, DOC, DOCX, JPG, PNG, WEBP allowed");
		}
	}

	private String getCloudinaryResourceType(String contentType) {

		if (contentType != null && contentType.startsWith("image/")) {

			return "image";
		}

		return "raw";
	}

	private String buildPublicId(String originalFilename, Long customerId, String resourceType) {

		String safeName = Objects.requireNonNullElse(originalFilename, "document").replaceAll("[^a-zA-Z0-9._-]", "_");

		String extension = getFileExtension(safeName);

		String baseName = extension.isBlank() ? safeName
				: safeName.substring(0, safeName.length() - extension.length());

		String uniqueName = baseName + "-" + UUID.randomUUID();

		if ("raw".equals(resourceType)) {

			uniqueName += extension;
		}

		return "customer-documents/customer-" + customerId + "/" + uniqueName;
	}

	private String getFileExtension(String filename) {

		int lastDot = filename.lastIndexOf('.');

		if (lastDot == -1) {

			return "";
		}

		return filename.substring(lastDot);
	}

	private DocumentResponse toDocumentResponse(CustomerDocument document) {

		return DocumentResponse.builder().documentId(document.getDocumentId())
				.originalFileName(document.getOriginalFileName()).contentType(document.getContentType())
				.sizeInBytes(document.getSizeInBytes()).cloudinaryPublicId(document.getCloudinaryPublicId())
				.cloudinaryUrl(document.getCloudinaryUrl()).resourceType(document.getResourceType())
				.uploadedAt(document.getUploadedAt()).build();
	}

	@Override
	public Map<String, Object> uploadFile(MultipartFile file) {

	    try {

	        String resourceType =
	                getCloudinaryResourceType(file.getContentType());

	        return cloudinary.uploader().upload(
	                file.getBytes(),
	                ObjectUtils.asMap(
	                        "resource_type",
	                        resourceType
	                )
	        );

	    } catch (IOException e) {

	        throw new BadRequestException(
	                "Unable to upload document"
	        );
	    }
	}
}