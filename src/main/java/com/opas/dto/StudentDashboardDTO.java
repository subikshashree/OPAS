package com.opas.dto;

import java.util.List;
import com.opas.model.AcademicRecord;

public class StudentDashboardDTO {
    private String name;
    private String registerNumber;
    private String department;
    private float cgpa;
    private float attendancePercentage;
    private int companyParticipationCount;
    private List<AcademicRecord> academicHistory;
    // Add more fields as needed like recent leave status


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegisterNumber() {
        return registerNumber;
    }

    public void setRegisterNumber(String registerNumber) {
        this.registerNumber = registerNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public float getCgpa() {
        return cgpa;
    }

    public void setCgpa(float cgpa) {
        this.cgpa = cgpa;
    }

    public float getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(float attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public int getCompanyParticipationCount() {
        return companyParticipationCount;
    }

    public void setCompanyParticipationCount(int companyParticipationCount) {
        this.companyParticipationCount = companyParticipationCount;
    }

    public List<AcademicRecord> getAcademicHistory() {
        return academicHistory;
    }

    public void setAcademicHistory(List<AcademicRecord> academicHistory) {
        this.academicHistory = academicHistory;
    }
}
