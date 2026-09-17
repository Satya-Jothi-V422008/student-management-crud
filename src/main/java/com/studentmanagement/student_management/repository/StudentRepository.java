package com.studentmanagement.student_management.repository;

import com.studentmanagement.student_management.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}