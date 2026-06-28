package com.Arun.StudentManagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {

    private Long id;
    private String name;
    private String email;
    private String department;
    private String rollNumber;
    private Double cgpa;
    private LocalDate enrolledAt;
}
