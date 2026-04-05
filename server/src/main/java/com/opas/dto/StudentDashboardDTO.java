package com.opas.dto;

import lombok.Data;
import java.util.List;
import com.opas.model.AcademicRecord;

@Data
public class StudentDashboardDTO {
    private String name;
    private String registerNumber;
    private String department;
    private float cgpa;
    private float attendancePercentage;
    private int companyParticipationCount;
    private List<AcademicRecord> academicHistory;
    // Add more fields as needed like recent leave status
}
