package com.monocept.demo.exception;

public class UnauthorizedAccessException extends RuntimeException{

	public UnauthorizedAccessException(String msg) {
		super(msg);
	}

}
