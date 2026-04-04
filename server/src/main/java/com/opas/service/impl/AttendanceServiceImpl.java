package com.opas.service.impl;

import com.opas.dto.AttendanceDTO;
import com.opas.model.Attendance;
import com.opas.model.AttendanceStatus;
import com.opas.model.Student;
import com.opas.model.User;
import com.opas.repository.AttendanceRepository;
import com.opas.repository.StudentRepository;
import com.opas.repository.UserRepository;
import com.opas.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    AttendanceRepository attendanceRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public Attendance markAttendance(AttendanceDTO attendanceDTO) {
        Student student = studentRepository.findById(attendanceDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        User faculty = userRepository.findById(attendanceDTO.getMarkedById())
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setDate(attendanceDTO.getDate());
        attendance.setStatus(attendanceDTO.getStatus());
        attendance.setMarkedBy(faculty);

        // Update student aggregation stats
        if (attendance.getStatus() == AttendanceStatus.PRESENT) {
            student.setPresentDays(student.getPresentDays() + 1);
        }
        student.setTotalAttendanceDays(student.getTotalAttendanceDays() + 1);
        studentRepository.save(student);

        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getStudentAttendance(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return attendanceRepository.findByStudent(student);
    }
}
