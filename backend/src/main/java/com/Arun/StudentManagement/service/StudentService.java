package com.Arun.StudentManagement.service;

import com.Arun.StudentManagement.dto.StudentRequest;
import com.Arun.StudentManagement.dto.StudentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudentService {
    StudentResponse create(StudentRequest request);

    StudentResponse getById(Long id);

    Page<StudentResponse> getAll(Pageable pageable);

    StudentResponse update(Long id, StudentRequest request);

    void delete(Long id);

    List<StudentResponse> searchByName(String name);

    List<StudentResponse> getByDepartment(String department);

}
