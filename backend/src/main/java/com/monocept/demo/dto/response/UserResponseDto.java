package com.monocept.demo.dto.response;

import java.time.LocalDateTime;

import com.monocept.demo.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {

	private Long userId;

	private String fullName;

	private String email;

	private String mobileNumber;

	private Role role;

	private boolean emailVerified;

	private boolean mobileVerified;

	private Boolean active;

	private LocalDateTime createdDate;

	private LocalDateTime updatedDate;

}
