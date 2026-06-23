package com.monocept.demo.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import lombok.Data;

@Data
public class CustomerRequestDto {

//    private Long agentId;

    @Past(message = "Date not in future")
    private LocalDate dateOfBirth;

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @NotBlank
    private String state;

    @NotBlank
    private String pinCode;

    @NotBlank
    private String nomineeName;

    @NotBlank
    private String nomineeRelation;
}