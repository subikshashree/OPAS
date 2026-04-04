package com.opas.service.impl;

import com.opas.dto.StudentDashboardDTO;
import com.opas.model.AcademicRecord;
import com.opas.model.Student;
import com.opas.repository.AcademicRecordRepository;
import com.opas.repository.CompanyParticipationRepository;
import com.opas.repository.StudentRepository;
import com.opas.repository.UserRepository;
import com.opas.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AcademicRecordRepository academicRecordRepository;

    @Autowired
    CompanyParticipationRepository companyParticipationRepository;

    @Override
    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUser(userRepository.findById(userId).orElseThrow())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
    }

    @Override
    public StudentDashboardDTO getStudentDashboard(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StudentDashboardDTO dashboard = new StudentDashboardDTO();
        dashboard.setName(student.getUser().getUsername()); // Assuming username is name for now
        dashboard.setRegisterNumber(student.getRegisterNumber());
        dashboard.setDepartment(student.getDepartment());
        dashboard.setCgpa(student.getCgpa());

        // Calculate Attendance Percentage
        float attendancePercentage = 0;
        if (student.getTotalAttendanceDays() > 0) {
            attendancePercentage = ((float) student.getPresentDays() / student.getTotalAttendanceDays()) * 100;
        }
        dashboard.setAttendancePercentage(attendancePercentage);

        // Company Participation Count
        int participationCount = companyParticipationRepository.findByStudent(student).size();
        dashboard.setCompanyParticipationCount(participationCount);

        // Academic History
        List<AcademicRecord> records = academicRecordRepository.findByStudent(student);
        dashboard.setAcademicHistory(records);

        return dashboard;
    }

    @Override
    public Student createStudentProfile(Student student) {
        return studentRepository.save(student);
    }
}
