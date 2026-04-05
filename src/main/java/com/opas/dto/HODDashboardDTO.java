package com.opas.dto;

import lombok.Data;
import java.util.List;

@Data
public class HODDashboardDTO {
    private int totalStudents;
    private int pendingLeaveRequests;
    private int pendingODRequests;
    private List<StudentSummaryDTO> topPerformers;
    private List<LeaveRequestDTO> recentRequests;
}
