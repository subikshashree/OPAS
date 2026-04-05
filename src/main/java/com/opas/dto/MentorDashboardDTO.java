package com.opas.dto;

import java.util.List;

public class MentorDashboardDTO {
    private int assignedStudentsCount;
    private int pendingLeaveRequests;
    private int pendingTaskCompletions;
    private List<StudentSummaryDTO> assignedStudents;
    private List<LeaveRequestDTO> recentLeaveRequests;
    private List<TaskDTO> recentTasks;


    public int getAssignedStudentsCount() {
        return assignedStudentsCount;
    }

    public void setAssignedStudentsCount(int assignedStudentsCount) {
        this.assignedStudentsCount = assignedStudentsCount;
    }

    public int getPendingLeaveRequests() {
        return pendingLeaveRequests;
    }

    public void setPendingLeaveRequests(int pendingLeaveRequests) {
        this.pendingLeaveRequests = pendingLeaveRequests;
    }

    public int getPendingTaskCompletions() {
        return pendingTaskCompletions;
    }

    public void setPendingTaskCompletions(int pendingTaskCompletions) {
        this.pendingTaskCompletions = pendingTaskCompletions;
    }

    public List<StudentSummaryDTO> getAssignedStudents() {
        return assignedStudents;
    }

    public void setAssignedStudents(List<StudentSummaryDTO> assignedStudents) {
        this.assignedStudents = assignedStudents;
    }

    public List<LeaveRequestDTO> getRecentLeaveRequests() {
        return recentLeaveRequests;
    }

    public void setRecentLeaveRequests(List<LeaveRequestDTO> recentLeaveRequests) {
        this.recentLeaveRequests = recentLeaveRequests;
    }

    public List<TaskDTO> getRecentTasks() {
        return recentTasks;
    }

    public void setRecentTasks(List<TaskDTO> recentTasks) {
        this.recentTasks = recentTasks;
    }
}
