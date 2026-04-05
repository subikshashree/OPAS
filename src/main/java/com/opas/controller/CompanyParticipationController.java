package com.opas.controller;

import com.opas.model.CompanyParticipation;
import com.opas.model.Student;
import com.opas.repository.CompanyParticipationRepository;
import com.opas.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/company")
public class CompanyParticipationController {

    @Autowired
    CompanyParticipationRepository companyParticipationRepository;

    @Autowired
    StudentRepository studentRepository;

    @PostMapping("/add")
    public ResponseEntity<CompanyParticipation> addParticipation(@RequestBody CompanyParticipation participation) {
        return ResponseEntity.ok(companyParticipationRepository.save(participation));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<CompanyParticipation>> getStudentParticipation(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        return ResponseEntity.ok(companyParticipationRepository.findByStudent(student));
    }
}
