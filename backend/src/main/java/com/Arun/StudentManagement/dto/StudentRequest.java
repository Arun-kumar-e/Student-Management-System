package com.Arun.StudentManagement.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a vaild email address")
    private String email;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Roll number is required")
    @Size(min= 5 , max = 20, message = "Roll number must be between 5 and 20 characters")
    private String rollNumber;

    @NotNull(message = "CGPA is required")
    @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "CGPA cannot exceed 10.0")
    private Double cgpa;


}
