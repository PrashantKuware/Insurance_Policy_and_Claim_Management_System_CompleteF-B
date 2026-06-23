package com.monocept.demo.exception;

public class ForbiddenAccessException extends RuntimeException{

	public ForbiddenAccessException(String msg) {
		super(msg);
	}

}
