package com.monocept.demo.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.monocept.demo.dto.request.ProductRequestDto;
import com.monocept.demo.dto.response.ProductResponseDto;
import com.monocept.demo.enums.ProductType;

public interface ProductService {

	ProductResponseDto addProduct(ProductRequestDto dto);

	ProductResponseDto updateProduct(Long productId, ProductRequestDto dto);

	ProductResponseDto getProductById(Long productId);

	Page<ProductResponseDto> getAllProducts(int pageNo, int pageSize);

	void deactivateProduct(Long productId);
	
	List<ProductResponseDto> getProductByProductType(ProductType productType);
}