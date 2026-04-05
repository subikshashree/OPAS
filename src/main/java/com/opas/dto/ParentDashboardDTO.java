package com.opas.dto;

import com.opas.model.AcademicRecord;
import java.util.List;

public class ParentDashboardDTO {
    private String studentName;
    private String registerNumber;
    private float cgpa;
    private int attendancePercentage;
    private List<AcademicRecord> academicHistory; // Or a simplified DTO
    private List<TaskDTO> recentTasks;
    private List<LeaveRequestDTO> recentLeaveRequests;


    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRegisterNumber() {
        return registerNumber;
    }

    public void setRegisterNumber(String registerNumber) {
        this.registerNumber = registerNumber;
    }

    public float getCgpa() {
        return cgpa;
    }

    public void setCgpa(float cgpa) {
        this.cgpa = cgpa;
    }

    public int getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(int attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }

    public List<AcademicRecord> getAcademicHistory() {
        return academicHistory;
    }

    public void setAcademicHistory(List<AcademicRecord> academicHistory) {
        this.academicHistory = academicHistory;
    }

    public List<TaskDTO> getRecentTasks() {
        return recentTasks;
    }

    public void setRecentTasks(List<TaskDTO> recentTasks) {
        this.recentTasks = recentTasks;
    }

    public List<LeaveRequestDTO> getRecentLeaveRequests() {
        return recentLeaveRequests;
    }

    public void setRecentLeaveRequests(List<LeaveRequestDTO> recentLeaveRequests) {
        this.recentLeaveRequests = recentLeaveRequests;
    }
}
