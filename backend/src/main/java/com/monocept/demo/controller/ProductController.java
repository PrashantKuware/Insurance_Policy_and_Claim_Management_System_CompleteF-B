package com.monocept.demo.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import com.monocept.demo.dto.request.ProductRequestDto;
import com.monocept.demo.dto.response.ProductResponseDto;
import com.monocept.demo.service.ProductService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;

	@PostMapping
	public ProductResponseDto addProduct(@Valid @RequestBody ProductRequestDto dto) {

		return productService.addProduct(dto);
	}

	@GetMapping("/{id}")
	public ProductResponseDto getProductById(@PathVariable Long id) {

		return productService.getProductById(id);
	}

	@GetMapping
	public Page<ProductResponseDto> getAllProducts(@RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "10") int pageSize) {

		return productService.getAllProducts(pageNo, pageSize);
	}

	@PutMapping("/{id}")
	public ProductResponseDto updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequestDto dto) {

		return productService.updateProduct(id, dto);
	}

	@PatchMapping("/{id}/deactivate")
	public String deactivateProduct(@PathVariable Long id) {

		productService.deactivateProduct(id);

		return "Product deactivated successfully";
	}
}