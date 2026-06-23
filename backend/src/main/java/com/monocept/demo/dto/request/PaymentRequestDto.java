package com.monocept.demo.dto.request;

import java.math.BigDecimal;

import com.monocept.demo.enums.PaymentMode;
import com.monocept.demo.enums.PaymentStatus;

import lombok.Data;

@Data
public class PaymentRequestDto {

    private Long policyId;

    private BigDecimal amount;

    private PaymentMode paymentMode;

    private PaymentStatus paymentStatus;
}