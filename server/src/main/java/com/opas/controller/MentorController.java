package com.opas.controller;

import com.opas.dto.MentorDashboardDTO;
import com.opas.dto.TaskDTO;
import com.opas.model.LeaveRequest;
import com.opas.model.RequestStatus;
import com.opas.model.Task;
import com.opas.model.User;
import com.opas.repository.LeaveRequestRepository;
import com.opas.repository.UserRepository;
import com.opas.service.DashboardService;
import com.opas.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/mentor")
@PreAuthorize("hasRole('MENTOR') or hasRole('FACULTY')")
public class MentorController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private TaskService taskService;

    @GetMapping("/dashboard")
    public ResponseEntity<MentorDashboardDTO> getDashboard(Authentication authentication) {
        User mentor = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(dashboardService.getMentorDashboard(mentor));
    }

    @PostMapping("/approve-leave/{requestId}")
    public ResponseEntity<?> approveLeave(@PathVariable Long requestId, @RequestParam RequestStatus status) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(status);
        leaveRequestRepository.save(request);
        return ResponseEntity.ok("Leave Request updated successfully");
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> assignTask(@RequestBody TaskDTO taskDTO, Authentication authentication) {
        User mentor = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(taskService.createTask(taskDTO, mentor));
    }
}
