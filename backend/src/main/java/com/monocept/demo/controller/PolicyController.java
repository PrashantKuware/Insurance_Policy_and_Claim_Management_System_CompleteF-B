package com.monocept.demo.controller;

import java.util.List;

import org.springframework.data.domain.Page;
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

import com.monocept.demo.dto.request.PolicyPurchaseRequestDto;
import com.monocept.demo.dto.response.PolicyResponseDto;
import com.monocept.demo.service.PolicyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/policies")
@CrossOrigin("http://localhost:5173/")
public class PolicyController {

    private final PolicyService policyService;

    // CUSTOMER
    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/purchase")
    public PolicyResponseDto purchasePolicy(
            @Valid @RequestBody PolicyPurchaseRequestDto dto) {

        return policyService.purchasePolicy(dto);
    }

    // CUSTOMER, ADMIN, AGENT
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN','AGENT')")
    @GetMapping("/{policyId}")
    public PolicyResponseDto getPolicyById(@PathVariable Long policyId) {

        return policyService.getPolicyById(policyId);
    }

    // CUSTOMER
    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my-policies")
    public List<PolicyResponseDto> getMyPolicies() {

        return policyService.getPoliciesByCustomer();
    }

    // ADMIN, AGENT
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    @GetMapping
    public Page<PolicyResponseDto> getAllPolicies(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "policyId") String sortBy) {

        return policyService.getAllPolicies(pageNo, pageSize, sortBy);
    }

    // ADMIN, AGENT
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    @PatchMapping("/{policyId}/activate")
    public String activatePolicy(@PathVariable Long policyId) {

        policyService.activatePolicy(policyId);

        return "Policy activated successfully";
    }

    // ADMIN, AGENT
    @PreAuthorize("hasAnyRole('ADMIN','AGENT')")
    @PatchMapping("/{policyId}/cancel")
    public String cancelPolicy(@PathVariable Long policyId) {

        policyService.cancelPolicy(policyId);

        return "Policy cancelled successfully";
    }
}
