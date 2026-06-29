package com.Arun.StudentManagement.controller;

import com.Arun.StudentManagement.dto.StudentRequest;
import com.Arun.StudentManagement.dto.StudentResponse;
import com.Arun.StudentManagement.service.StudentService;
import jakarta.validation.Valid;  // Triggers validation on the request body
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentResponse> create(
            @Valid
            @RequestBody StudentRequest request){

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(studentService.create(request));
    }
    @GetMapping
    public ResponseEntity<Page<StudentResponse>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
                Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        return ResponseEntity.ok(studentService.getAll(
                org.springframework.data.domain.PageRequest.of(page, size, sort)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getById(

            @PathVariable Long id) {

        return ResponseEntity.ok(studentService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {

        return ResponseEntity.ok(studentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudentResponse>> searchByName(
            @RequestParam String name) {

        return ResponseEntity.ok(studentService.searchByName(name));
    }

    @GetMapping("/department")
    public ResponseEntity<List<StudentResponse>> getByDepartment(
            @RequestParam(name = "dept") String department) {

        return ResponseEntity.ok(studentService.getByDepartment(department));
    }
}
