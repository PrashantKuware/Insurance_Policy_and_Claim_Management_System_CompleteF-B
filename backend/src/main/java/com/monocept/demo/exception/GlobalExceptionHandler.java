package com.monocept.demo.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpServerErrorException.InternalServerError;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
		log.warn("Resource not found: {}", ex.getMessage());
		return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<Map<String, Object>> handleDuplicateResource(DuplicateResourceException ex) {
		log.warn("Duplicate resource: {}", ex.getMessage());
		return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<Map<String, Object>> handleBadRequest(BadRequestException ex) {
		log.warn("Bad request: {}", ex.getMessage());
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
		log.warn("Illegal argument: {}", ex.getMessage());
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());

	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {

		return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password");
	}

	@ExceptionHandler(DisabledException.class)
	public ResponseEntity<Map<String, Object>> handleDisabledException(DisabledException ex) {

		return buildResponse(HttpStatus.FORBIDDEN, "User account is disabled");
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
		log.warn("Validation failed");
		Map<String, String> validationErrors = new LinkedHashMap<>();
		for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
			validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
		}
		Map<String, Object> error = new LinkedHashMap<>();
		error.put("timestamp", LocalDateTime.now());
		error.put("status", HttpStatus.BAD_REQUEST.value());
		error.put("error", "Validation Failed");
		error.put("messages", validationErrors);
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
		log.warn("Invalid path variable or request parameter: {}", ex.getMessage());
		return buildResponse(HttpStatus.BAD_REQUEST, "Invalid input. Please provide valid data.");
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidJson(HttpMessageNotReadableException ex) {
		log.warn("Invalid JSON request body");
		return buildResponse(HttpStatus.BAD_REQUEST, "Invalid JSON request body.");
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException ex) {
		log.error("Database constraint violation: {}", ex.getMessage());
		return buildResponse(HttpStatus.CONFLICT, "Duplicate or invalid database value.");
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
		log.warn("Access denied: {}", ex.getMessage());
		return buildResponse(HttpStatus.FORBIDDEN, "You do not have permission to access this resource.");
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ErrorResponse> handleIllegalStateException(IllegalStateException ex,
			HttpServletRequest request) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(),
				HttpStatus.BAD_REQUEST.name(), ex.getMessage(), request.getRequestURI());

		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
		log.error("Unexpected error occurred", ex);
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
	}

	@ExceptionHandler(ForbiddenAccessException.class)
	public ResponseEntity<Map<String, Object>> handleForbiddenAccessException(ForbiddenAccessException ex,
			HttpServletRequest request) {

		return buildResponse(HttpStatus.FORBIDDEN, "You Can't have access to do that.");
	}

	@ExceptionHandler(InvalidClaimStatusException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidClaimStatusException(InvalidClaimStatusException ex,
			HttpServletRequest request) {

		return buildResponse(HttpStatus.BAD_REQUEST, "Invalid claim status.");
	}

	@ExceptionHandler(InvalidPolicyStatusException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidPolicyStatusException(InvalidPolicyStatusException ex,
			HttpServletRequest request) {

		return buildResponse(HttpStatus.BAD_REQUEST, "Invalid Policy status.");
	}

	@ExceptionHandler(UnauthorizedAccessException.class)
	public ResponseEntity<Map<String, Object>> handleUnauthorizedAccessException(UnauthorizedAccessException ex,
			HttpServletRequest request) {

		return buildResponse(HttpStatus.UNAUTHORIZED, "You Are Unauthorized.");
	}

	@ExceptionHandler(ValidationException.class)
	public ResponseEntity<Map<String, Object>> handleValidationException(ValidationException ex,
			HttpServletRequest request) {

		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}
	
	@ExceptionHandler(InternalServerError.class)
	public ResponseEntity<Map<String, Object>> handleInternalServerException(InternalServerError ex,
			HttpServletRequest request) {

		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
	}

	private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
		Map<String, Object> error = new LinkedHashMap<>();
		error.put("timestamp", LocalDateTime.now());
		error.put("status", status.value());
		error.put("error", status.getReasonPhrase());
		error.put("message", message);
		return new ResponseEntity<>(error, status);
	}
}
