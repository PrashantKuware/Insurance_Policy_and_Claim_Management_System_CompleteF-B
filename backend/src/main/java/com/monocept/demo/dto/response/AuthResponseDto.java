package com.monocept.demo.dto.response;

import com.monocept.demo.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDto {

	 private String token;

	    private String tokenType;

	    private String username;
		private Role role;
}