package com.Arun.StudentManagement.repository;

import com.Arun.StudentManagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByEmail(String email);

    Optional<Student> findByRollNumber(String rollNumber);

    List<Student> findByNameContainingIgnoreCase(String name);

    List<Student> findByDepartmentIgnoreCase(String department);

    List<Student> findByCgpaGreaterThanEqual(Double minCgpa);

    @Query("SELECT s FROM Student s WHERE s.cgpa >= :min AND LOWER(s.department) = LOWER(:dept)")
    List<Student> findByMinCgpaAndDept(@Param("min") Double min, @Param("dept") String dept);

}
