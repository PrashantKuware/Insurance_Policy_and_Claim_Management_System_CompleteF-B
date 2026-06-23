package com.monocept.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.demo.entity.ClaimDocument;

public interface ClaimDocumentRepository extends JpaRepository<ClaimDocument, Long>{

}
