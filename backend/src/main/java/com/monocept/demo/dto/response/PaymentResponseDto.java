package com.monocept.demo.dto.response;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PaymentResponseDto {

    private Long paymentId;

    private String transactionReference;

    private BigDecimal amount;

    private String paymentStatus;
    
    private String razorpayOrderId;
    private String razorpayKey;
    private Long policyId;
}