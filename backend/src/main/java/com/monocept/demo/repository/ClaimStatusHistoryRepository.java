package com.monocept.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.demo.entity.ClaimStatusHistory;

public interface ClaimStatusHistoryRepository extends JpaRepository<ClaimStatusHistory, Long> {

	List<ClaimStatusHistory> findByClaimClaimIdOrderByUpdatedDateAsc(Long claimId);
}