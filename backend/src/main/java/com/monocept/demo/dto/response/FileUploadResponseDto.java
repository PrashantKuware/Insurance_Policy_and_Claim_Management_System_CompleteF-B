package com.monocept.demo.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadResponseDto {
	  private Long documentId;
	    private String originalFileName;
	    private String contentType;
	    private Long sizeInBytes;
	    private String cloudinaryPublicId;
	    private String cloudinaryUrl;
	    private String resourceType;
	    private LocalDateTime uploadedAt;
}