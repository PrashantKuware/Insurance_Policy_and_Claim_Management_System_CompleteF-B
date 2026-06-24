package com.monocept.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.demo.dto.request.PaymentRequestDto;
import com.monocept.demo.dto.response.PaymentResponseDto;
import com.monocept.demo.service.PaymentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin("http://localhost:5173/")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // CUSTOMER + AGENT
    @PreAuthorize("hasAnyRole('CUSTOMER','AGENT')")
    @PostMapping("/policy/{policyId}")
    public ResponseEntity<PaymentResponseDto> payPremium(
            @PathVariable Long policyId,
            @Valid @RequestBody PaymentRequestDto requestDto) {

        return new ResponseEntity<>(
                paymentService.payPremium(policyId, requestDto),
                HttpStatus.CREATED);
    }

    // CUSTOMER + ADMIN + AGENT
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','AGENT')")
    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDto> getPaymentById(
            @PathVariable Long paymentId) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(paymentId));
    }

    // CUSTOMER + ADMIN + AGENT
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','AGENT')")
    @GetMapping("/policy/{policyId}")
    public ResponseEntity<Page<PaymentResponseDto>> getPaymentsByPolicy(
            @PathVariable Long policyId,
            Pageable pageable) {

        return ResponseEntity.ok(
                paymentService.getPaymentsByPolicy(policyId, pageable));
    }

    // CUSTOMER + ADMIN + AGENT
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','AGENT')")
    @GetMapping
    public ResponseEntity<Page<PaymentResponseDto>> getAllPayments(
            Pageable pageable) {

        return ResponseEntity.ok(
                paymentService.getAllPayments(pageable));
    }

    // ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{paymentId}/status")
    public ResponseEntity<PaymentResponseDto> updatePaymentStatus(
            @PathVariable Long paymentId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                paymentService.updatePaymentStatus(paymentId, status));
    }
}