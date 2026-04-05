package com.opas.controller;

import com.opas.dto.HODDashboardDTO;
import com.opas.model.LeaveRequest;
import com.opas.model.User;
import com.opas.model.RequestStatus;
import com.opas.repository.LeaveRequestRepository;
import com.opas.repository.UserRepository;
import com.opas.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hod")
@PreAuthorize("hasRole('HOD')")
public class HODController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<HODDashboardDTO> getDashboard(Authentication authentication) {
        User hod = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(dashboardService.getHODDashboard(hod));
    }

    @PostMapping("/approve-od/{requestId}")
    public ResponseEntity<?> approveOD(@PathVariable Long requestId, @RequestParam RequestStatus status) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Add check if request is actually OD type and belongs to student in HOD's dept

        request.setStatus(status);
        leaveRequestRepository.save(request);
        return ResponseEntity.ok("OD Request updated successfully");
    }
}
