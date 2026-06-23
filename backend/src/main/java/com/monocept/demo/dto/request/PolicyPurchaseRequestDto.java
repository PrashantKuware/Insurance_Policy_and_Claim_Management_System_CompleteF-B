package com.monocept.demo.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PolicyPurchaseRequestDto {

    @NotNull
    private Long planId;
}