package com.Arun.StudentManagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name" , nullable = false, length = 100)
    private String name;

    @Column( nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false, name = "roll_number" , unique = true, length = 20)
    private String rollNumber;

    @Column
    private Double cgpa;

    @Column(name = "enrolled_at")
    private LocalDate enrolledAt;

    @PrePersist
    public void setEnrollmentDate(){
        if(this.enrolledAt == null){
            this.enrolledAt = LocalDate.now();
        }
    }

}
