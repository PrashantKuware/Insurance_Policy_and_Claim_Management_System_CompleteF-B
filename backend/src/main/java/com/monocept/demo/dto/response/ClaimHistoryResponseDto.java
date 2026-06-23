package com.monocept.demo.dto.response;

import lombok.Data;

@Data
public class ClaimHistoryResponseDto {

    private String previousStatus;

    private String newStatus;

    private String remarks;

    private String updatedBy;

    private String updatedDate;
}