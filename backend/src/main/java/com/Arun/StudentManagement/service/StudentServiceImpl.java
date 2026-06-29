package com.Arun.StudentManagement.service;

import com.Arun.StudentManagement.dto.StudentRequest;
import com.Arun.StudentManagement.dto.StudentResponse;
import com.Arun.StudentManagement.entity.Student;
import com.Arun.StudentManagement.exception.DuplicateEmailException;
import com.Arun.StudentManagement.exception.DuplicateRollNumberException;
import com.Arun.StudentManagement.exception.ResourceNotFoundException;
import com.Arun.StudentManagement.repository.StudentRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public StudentResponse create(StudentRequest request) {
        log.info("Creating student with email: {}", request.getEmail());

        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already in use: " + request.getEmail());
        }
        if (studentRepository.findByRollNumber(request.getRollNumber()).isPresent()) {
            throw new DuplicateRollNumberException("Roll number already in use: " + request.getRollNumber());
        }

        Student student = Student.builder()
                .name(request.getName())
                .email(request.getEmail())
                .department(request.getDepartment())
                .rollNumber(request.getRollNumber())
                .cgpa(request.getCgpa())
                .build();

        Student saved = studentRepository.save(student);
        log.info("Student create with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getById(Long id) {
        return mapToResponse(
                studentRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id))
        );

    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAll(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public StudentResponse update(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (!student.getEmail().equals(request.getEmail())
                && studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already in use: " + request.getEmail());
        }

        if (!student.getRollNumber().equals(request.getRollNumber())
                && studentRepository.findByRollNumber(request.getRollNumber()).isPresent()) {
            throw new DuplicateRollNumberException("Roll number already in use: " + request.getRollNumber());
        }

        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setDepartment(request.getDepartment());
        student.setRollNumber(request.getRollNumber());
        student.setCgpa(request.getCgpa());

        Student updated = studentRepository.save(student);
        log.info("Student updated with id: {}", updated.getId());

        return mapToResponse(updated);

    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
        log.info("Student deleted with id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> searchByName(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name)
                .stream()                                         // Convert List to Stream
                .map(this::mapToResponse)                         // Convert each Student to StudentResponse
                .collect(Collectors.toList());                    // Collect back to List
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponse> getByDepartment(String department) {
        return studentRepository.findByDepartmentIgnoreCase(department)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    private StudentResponse mapToResponse(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getName())
                .email(student.getEmail())
                .department(student.getDepartment())
                .rollNumber(student.getRollNumber())
                .cgpa(student.getCgpa())
                .enrolledAt(student.getEnrolledAt())
                .build();
    }
}