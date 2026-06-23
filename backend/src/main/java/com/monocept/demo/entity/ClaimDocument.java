package com.monocept.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "claim_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentId;

    @Column(nullable = false)
    private String originalFileName;

    private String contentType;

    private Long sizeInBytes;

    @Column(nullable = false)
    private String cloudinaryPublicId;

    @Column(nullable = false, length = 1000)
    private String cloudinaryUrl;

    private String resourceType;

    private LocalDateTime uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim;

    @PrePersist
    public void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}