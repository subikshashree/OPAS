package com.opas.dto;

import com.opas.model.AcademicRecord;
import lombok.Data;
import java.util.List;

@Data
public class ParentDashboardDTO {
    private String studentName;
    private String registerNumber;
    private float cgpa;
    private int attendancePercentage;
    private List<AcademicRecord> academicHistory; // Or a simplified DTO
    private List<TaskDTO> recentTasks;
    private List<LeaveRequestDTO> recentLeaveRequests;
}
