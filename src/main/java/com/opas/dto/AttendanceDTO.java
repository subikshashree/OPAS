package com.opas.dto;

import com.opas.model.AttendanceStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AttendanceDTO {
    private Long studentId;
    private LocalDate date;
    private AttendanceStatus status;
    private Long markedById;
}
