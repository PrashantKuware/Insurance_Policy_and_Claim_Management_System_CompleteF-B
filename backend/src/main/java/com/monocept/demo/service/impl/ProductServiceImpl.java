package com.monocept.demo.service.impl;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.monocept.demo.dto.request.ProductRequestDto;
import com.monocept.demo.dto.response.ProductResponseDto;
import com.monocept.demo.entity.InsuranceProduct;
import com.monocept.demo.exception.DuplicateResourceException;
import com.monocept.demo.exception.ResourceNotFoundException;
import com.monocept.demo.repository.InsuranceProductRepository;
import com.monocept.demo.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

	private final InsuranceProductRepository repository;

	@Override
	public ProductResponseDto addProduct(ProductRequestDto dto) {

		if (repository.existsByProductName(dto.getProductName())) {
			throw new DuplicateResourceException("Product already exists");
		}

		InsuranceProduct product = InsuranceProduct.builder().productName(dto.getProductName())
				.productType(dto.getProductType()).description(dto.getDescription()).active(true)
				.createdDate(LocalDateTime.now()).build();

		repository.save(product);

		return mapToResponse(product);
	}

	@Override
	public ProductResponseDto getProductById(Long productId) {

		InsuranceProduct product = repository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		return mapToResponse(product);
	}

	private ProductResponseDto mapToResponse(InsuranceProduct product) {

		return ProductResponseDto.builder().productId(product.getProductId()).productName(product.getProductName())
				.productType(product.getProductType()).description(product.getDescription()).active(product.getActive())
				.build();
	}

	@Override
	public ProductResponseDto updateProduct(Long productId, ProductRequestDto dto) {

		InsuranceProduct product = repository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		product.setProductName(dto.getProductName());
		product.setProductType(dto.getProductType());
		product.setDescription(dto.getDescription());
		product.setUpdatedDate(LocalDateTime.now());

		repository.save(product);

		return mapToResponse(product);
	}

	@Override
	public void deactivateProduct(Long productId) {

		InsuranceProduct product = repository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		product.setActive(false);

		repository.save(product);
	}

    @Override
    public Page<ProductResponseDto> getAllProducts(
            int pageNo,
            int pageSize) {

        Pageable pageable =
                PageRequest.of(pageNo, pageSize);

        return repository.findAll(pageable)
                .map(this::mapToResponse);
    }
}