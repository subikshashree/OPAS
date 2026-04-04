package com.opas.controller;

import com.opas.dto.ParentDashboardDTO;
import com.opas.model.User;
import com.opas.repository.UserRepository;
import com.opas.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parent")
@PreAuthorize("hasRole('PARENT')")
public class ParentController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ParentDashboardDTO> getDashboard(Authentication authentication) {
        User parent = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(dashboardService.getParentDashboard(parent));
    }
}
