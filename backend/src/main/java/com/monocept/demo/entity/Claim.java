package com.monocept.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.monocept.demo.enums.ClaimStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long claimId;

    @Column(unique = true)
    private String claimNumber;

    @ManyToOne
    @JoinColumn(name = "policy_id")
    private Policy policy;

    @Positive(message = "Claim amount must be greater than 0")
    @NotNull(message = "Amount should be there")
    private BigDecimal claimAmount;

    @Column(columnDefinition = "TEXT")
    @NotNull(message = "claimReason should be there")
    private String claimReason;
    
    @NotNull(message = "incidentDate should be there")
    private LocalDate incidentDate;

    @Enumerated(EnumType.STRING)
    private ClaimStatus claimStatus;

    private String agentRemarks;

    private String adminRemarks;

    @Column(updatable = false)
    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "claim")
    private List<ClaimDocument> documents;

    @OneToMany(mappedBy = "claim")
    private List<ClaimStatusHistory> history;
}