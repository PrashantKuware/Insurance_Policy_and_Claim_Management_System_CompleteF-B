package com.monocept.demo.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.monocept.demo.enums.PremiumType;

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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "policy_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyPlan {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long planId;

	@ManyToOne
	@JoinColumn(name = "product_id")
	private InsuranceProduct product;

	private String planName;

	@Positive(message = "Amount must be +ve")
	private BigDecimal coverageAmount;

	@Positive(message = "Amount must be +ve")
	private BigDecimal premiumAmount;

	@Enumerated(EnumType.STRING)
	private PremiumType premiumType;

	@Positive(message = "Duration must be +ve")
	private Integer duration;

	@Column()
	private String termsConditions;

	private Boolean active = true;

	@Column(updatable = false)
    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;
    
    @PrePersist
    public void prePersist() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedDate = LocalDateTime.now();
    }

	@OneToMany(mappedBy = "policyPlan")
	private List<Policy> policies;
}