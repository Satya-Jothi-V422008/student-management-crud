package com.studentmanagement.service;

import com.studentmanagement.student_management.model.Student;
import com.studentmanagement.student_management.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // CREATE
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    // READ - Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // READ - Get student by ID
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    // UPDATE
    public Student updateStudent(Long id, Student updatedStudent) {

        Optional<Student> existingStudent =
                studentRepository.findById(id);

        if (existingStudent.isPresent()) {

            Student student = existingStudent.get();

            student.setName(updatedStudent.getName());
            student.setEmail(updatedStudent.getEmail());
            student.setDepartment(updatedStudent.getDepartment());
            student.setYear(updatedStudent.getYear());
            student.setPhone(updatedStudent.getPhone());

            return studentRepository.save(student);
        }

        return null;
    }

    // DELETE
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}