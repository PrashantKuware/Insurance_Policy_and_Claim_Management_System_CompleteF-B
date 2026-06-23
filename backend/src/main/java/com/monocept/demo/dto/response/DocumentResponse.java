package com.monocept.demo.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DocumentResponse {
    private Long documentId;
    private String originalFileName;
    private String contentType;
    private Long sizeInBytes;
    private String cloudinaryPublicId;
    private String cloudinaryUrl;
    private String resourceType;
    private LocalDateTime uploadedAt;
}