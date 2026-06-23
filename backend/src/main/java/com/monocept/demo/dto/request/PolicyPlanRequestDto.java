package com.monocept.demo.dto.request;

import java.math.BigDecimal;

import com.monocept.demo.enums.PremiumType;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PolicyPlanRequestDto {

    @NotNull(message = "Product Id can't be null")
    private Long productId;

    @NotNull(message = "Product Name can't be null")
    private String planName;

    @NotNull(message = "Product coverage Amount can't be null")
    private BigDecimal coverageAmount;

    @NotNull(message = "Product premium Amount can't be null")
    private BigDecimal premiumAmount;

    @NotNull(message = "Product Premium Type can't be null")
    private PremiumType premiumType;

    @NotNull(message = "Product duration can't be null")
    private Integer duration;

    @NotNull(message = "Product terms and Conditions can't be null")
    private String termsConditions;
    
    private boolean active;
}