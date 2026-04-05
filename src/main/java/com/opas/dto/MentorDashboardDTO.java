package com.opas.dto;

import lombok.Data;
import java.util.List;

@Data
public class MentorDashboardDTO {
    private int assignedStudentsCount;
    private int pendingLeaveRequests;
    private int pendingTaskCompletions;
    private List<StudentSummaryDTO> assignedStudents;
    private List<LeaveRequestDTO> recentLeaveRequests;
    private List<TaskDTO> recentTasks;
}
