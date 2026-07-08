package com.monocept.demo.dto.response;


import java.math.BigDecimal;

import lombok.Data;


@Data
public class CreateOrderResponseDto {


    private String orderId;

    private String key;

    private BigDecimal amount;

}