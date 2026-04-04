package com.opas.controller;

import com.opas.dto.StudentDashboardDTO;
import com.opas.model.Student;
import com.opas.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    StudentService studentService;

    @GetMapping("/dashboard/{studentId}")
    public ResponseEntity<StudentDashboardDTO> getStudentDashboard(@PathVariable Long studentId) {
        return ResponseEntity.ok(studentService.getStudentDashboard(studentId));
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<Student> getStudentProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(studentService.getStudentByUserId(userId));
    }

    @PostMapping("/profile")
    public ResponseEntity<Student> createStudentProfile(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.createStudentProfile(student));
    }
}
