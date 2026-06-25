package com.monocept.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.monocept.demo.dto.request.ProductRequestDto;
import com.monocept.demo.dto.response.ProductResponseDto;
import com.monocept.demo.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173/")
public class ProductController {

	private final ProductService productService;

	// ADMIN
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ProductResponseDto addProduct(
			@Valid @RequestBody ProductRequestDto dto) {

		return productService.addProduct(dto);
	}

	// ADMIN, AGENT, CUSTOMER
	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN','AGENT','CUSTOMER')")
	public ProductResponseDto getProductById(
			@PathVariable Long id) {

		return productService.getProductById(id);
	}

	// ADMIN, AGENT, CUSTOMER
	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN','AGENT','CUSTOMER')")
	public Page<ProductResponseDto> getAllProducts(
			@RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "10") int pageSize) {

		return productService.getAllProducts(pageNo, pageSize);
	}

	// ADMIN
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ProductResponseDto updateProduct(
			@PathVariable Long id,
			@Valid @RequestBody ProductRequestDto dto) {

		return productService.updateProduct(id, dto);
	}

	// ADMIN
	@PatchMapping("/{id}/deactivate")
	@PreAuthorize("hasRole('ADMIN')")
	public String deactivateProduct(
			@PathVariable Long id) {

		productService.deactivateProduct(id);

		return "Product deactivated successfully";
	}
}