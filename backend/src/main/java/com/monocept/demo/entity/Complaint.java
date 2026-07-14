package com.monocept.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@RequiredArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long complaintId;

    @NotBlank(message = "Need Subject")
    private String subject;

    @Column(length = 1000)
    @NotBlank(message = "Need Description")
    private String description;

    
    private LocalDateTime createdAt;
    
    @PrePersist 
    public void prePersist() {
    	createdAt = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name="customer_id")
    private Customer customer;

}