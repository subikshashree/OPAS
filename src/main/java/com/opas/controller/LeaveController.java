package com.opas.controller;

import com.opas.dto.ApprovalDTO;
import com.opas.dto.LeaveRequestDTO;
import com.opas.model.LeaveRequest;
import com.opas.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leave")
public class LeaveController {

    @Autowired
    LeaveService leaveService;

    @PostMapping("/apply")
    public ResponseEntity<LeaveRequest> applyLeave(@RequestBody LeaveRequestDTO leaveRequestDTO) {
        return ResponseEntity.ok(leaveService.applyLeave(leaveRequestDTO));
    }

    @PutMapping("/approve")
    public ResponseEntity<LeaveRequest> approveLeave(@RequestBody ApprovalDTO approvalDTO) {
        return ResponseEntity.ok(leaveService.approveLeave(approvalDTO));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<LeaveRequest>> getStudentLeaves(@PathVariable Long studentId) {
        return ResponseEntity.ok(leaveService.getStudentLeaves(studentId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LeaveRequest>> getPendingRequests() {
        return ResponseEntity.ok(leaveService.getAllPendingRequests());
    }
}
