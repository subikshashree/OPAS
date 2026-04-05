package com.opas.service;

import com.opas.dto.StudentDashboardDTO;
import com.opas.model.Student;
import com.opas.model.User;

public interface StudentService {
    Student getStudentByUserId(Long userId);

    StudentDashboardDTO getStudentDashboard(Long studentId);

    Student createStudentProfile(Student student);
}
