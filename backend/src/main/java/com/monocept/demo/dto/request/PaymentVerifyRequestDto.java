package com.monocept.demo.dto.request;


import lombok.Data;


@Data
public class PaymentVerifyRequestDto {


    private Long policyId;


    private String razorpayOrderId;


    private String razorpayPaymentId;


    private String razorpaySignature;

}