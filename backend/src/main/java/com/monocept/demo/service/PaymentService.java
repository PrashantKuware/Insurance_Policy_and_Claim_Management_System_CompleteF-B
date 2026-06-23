package com.monocept.demo.service;


import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.monocept.demo.dto.request.PaymentRequestDto;
import com.monocept.demo.dto.response.PaymentResponseDto;


public interface PaymentService {

    PaymentResponseDto payPremium(
            Long policyId,
            PaymentRequestDto requestDto);

    PaymentResponseDto getPaymentById(
            Long paymentId);

    Page<PaymentResponseDto> getPaymentsByPolicy(
            Long policyId,
            Pageable pageable);

    Page<PaymentResponseDto> getAllPayments(
            Pageable pageable);

    PaymentResponseDto updatePaymentStatus(
            Long paymentId,
            String status);
}