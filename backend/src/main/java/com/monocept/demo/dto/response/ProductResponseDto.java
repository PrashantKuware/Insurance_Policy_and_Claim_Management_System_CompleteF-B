package com.monocept.demo.dto.response;

import com.monocept.demo.enums.ProductType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponseDto {

    private Long productId;

    private String productName;

    private ProductType productType;

    private String description;

    private Boolean active;
}