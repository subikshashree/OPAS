package com.opas.service;

import com.opas.dto.AttendanceDTO;
import com.opas.model.Attendance;
import java.util.List;

public interface AttendanceService {
    Attendance markAttendance(AttendanceDTO attendanceDTO);

    List<Attendance> getStudentAttendance(Long studentId);
}
