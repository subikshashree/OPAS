package com.opas.controller;

import com.opas.dto.AttendanceDTO;
import com.opas.model.Attendance;
import com.opas.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    AttendanceService attendanceService;

    @PostMapping("/mark")
    // @PreAuthorize("hasRole('FACULTY')") // Uncomment when roles are set up
    public ResponseEntity<Attendance> markAttendance(@RequestBody AttendanceDTO attendanceDTO) {
        return ResponseEntity.ok(attendanceService.markAttendance(attendanceDTO));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getStudentAttendance(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendance(studentId));
    }
}
