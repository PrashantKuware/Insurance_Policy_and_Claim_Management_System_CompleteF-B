package com.monocept.demo.dto.response;

import java.time.LocalDate;

import lombok.Data;

@Data
public class CustomerResponseDto {

    private Long customerId;

    private String fullName;

    private String email;

//    private Long agentId;

    private String agentName;

    private LocalDate dateOfBirth;

    private String address;

    private String city;

    private String state;

    private String pinCode;

    private String nomineeName;
}