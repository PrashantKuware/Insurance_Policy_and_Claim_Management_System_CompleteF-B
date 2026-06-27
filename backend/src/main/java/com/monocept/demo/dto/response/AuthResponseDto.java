package com.monocept.demo.dto.response;

import com.monocept.demo.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponseDto {

	 private String token;

	    private String tokenType;

	    private String username;
	    
		private Role role;
		
		private String fullName;
		
		 private String message;
}