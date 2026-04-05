package com.opas.dto;

import com.opas.model.LeaveType;
import com.opas.model.RequestStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class LeaveRequestDTO {
    private Long id;
    private Long studentId;
    private String studentName; // Added for HOD/Mentor view
    private String registerNumber; // Added for HOD/Mentor view
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private LeaveType leaveType;
    private RequestStatus status; // Added to show current status
}
