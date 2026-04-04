package com.opas.controller;

import com.opas.model.AcademicRecord;
import com.opas.model.Student;
import com.opas.repository.AcademicRecordRepository;
import com.opas.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/academic")
public class AcademicRecordController {

    @Autowired
    AcademicRecordRepository academicRecordRepository;

    @Autowired
    StudentRepository studentRepository;

    @PostMapping("/add")
    public ResponseEntity<AcademicRecord> addRecord(@RequestBody AcademicRecord record) {
        // Ensure student exists and link it properly if needed, usually passed with ID
        return ResponseEntity.ok(academicRecordRepository.save(record));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AcademicRecord>> getStudentRecords(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        return ResponseEntity.ok(academicRecordRepository.findByStudent(student));
    }
}
