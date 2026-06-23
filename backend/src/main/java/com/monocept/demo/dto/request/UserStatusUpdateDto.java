package com.monocept.demo.dto.request;

import lombok.Data;

@Data
public class UserStatusUpdateDto {

    private Boolean active;

    private String remarks;
}