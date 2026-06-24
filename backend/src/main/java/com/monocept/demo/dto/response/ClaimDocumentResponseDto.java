package com.monocept.demo.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClaimDocumentResponseDto {

    private Long documentId;
    private String originalFileName;
    private String contentType;
    private Long sizeInBytes;
    private String cloudinaryUrl;
    private String resourceType;
    private LocalDateTime uploadedAt;
}