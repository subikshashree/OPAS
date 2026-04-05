package com.opas.dto;

import java.util.List;

public class HODDashboardDTO {
    private int totalStudents;
    private int pendingLeaveRequests;
    private int pendingODRequests;
    private List<StudentSummaryDTO> topPerformers;
    private List<LeaveRequestDTO> recentRequests;


    public int getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
    }

    public int getPendingLeaveRequests() {
        return pendingLeaveRequests;
    }

    public void setPendingLeaveRequests(int pendingLeaveRequests) {
        this.pendingLeaveRequests = pendingLeaveRequests;
    }

    public int getPendingODRequests() {
        return pendingODRequests;
    }

    public void setPendingODRequests(int pendingODRequests) {
        this.pendingODRequests = pendingODRequests;
    }

    public List<StudentSummaryDTO> getTopPerformers() {
        return topPerformers;
    }

    public void setTopPerformers(List<StudentSummaryDTO> topPerformers) {
        this.topPerformers = topPerformers;
    }

    public List<LeaveRequestDTO> getRecentRequests() {
        return recentRequests;
    }

    public void setRecentRequests(List<LeaveRequestDTO> recentRequests) {
        this.recentRequests = recentRequests;
    }
}
