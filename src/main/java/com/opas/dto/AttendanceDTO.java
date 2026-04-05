package com.opas.dto;

import com.opas.model.AttendanceStatus;
import java.time.LocalDate;

public class AttendanceDTO {
    private Long studentId;
    private LocalDate date;
    private AttendanceStatus status;
    private Long markedById;


    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public Long getMarkedById() {
        return markedById;
    }

    public void setMarkedById(Long markedById) {
        this.markedById = markedById;
    }
}
