package com.monocept.demo.dto.response;

import lombok.Data;

@Data
public class PaymentResponseDto {

    private Long paymentId;

    private String transactionReference;

    private Double amount;

    private String paymentStatus;
}