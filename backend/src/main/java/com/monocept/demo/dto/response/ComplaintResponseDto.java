package com.monocept.demo.dto.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ComplaintResponseDto {

    private Long complaintId;
    
    private Long CustomerId;
    
    private String subject;

    private String description;

    private LocalDateTime createdAt;

    private String customerName;

}