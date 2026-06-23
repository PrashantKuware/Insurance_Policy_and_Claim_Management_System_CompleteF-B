package com.monocept.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
//    @ManyToOne
//    @JoinColumn(name = "agent_id")
//    private User agent;

    @NotNull(message = "Dob is not null")
    private LocalDate dateOfBirth;

    @NotNull(message = "address is not null")
    private String address;

    @NotNull(message = "city is not null")
    private String city;

    @NotNull(message = "state is not null")
    private String state;

    @NotNull(message = "pinCode is not null")
    private String pinCode;

    @NotNull(message = "nomineeName is not null")
    private String nomineeName;

    @NotNull(message = "nomineeRelation is not null")
    private String nomineeRelation;

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
}