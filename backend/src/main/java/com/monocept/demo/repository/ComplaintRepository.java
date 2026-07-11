package com.monocept.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.monocept.demo.entity.Complaint;
import com.monocept.demo.entity.Customer;

public interface ComplaintRepository extends JpaRepository<Complaint, Long>{

	List<Complaint> findByCustomer(Customer customer);
	
	List<Complaint> findAllByOrderByComplaintIdDesc();
}
