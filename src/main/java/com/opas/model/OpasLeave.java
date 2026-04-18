package com.opas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Flat leave entity that maps directly to the React frontend's LeaveRequest shape.
 * No FK joins — uses string IDs for simplicity so the frontend JSON works as-is.
 */
@Entity
@Table(name = "opas_leaves")
public class OpasLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dbId;

    @Column(unique = true, nullable = false)
    private String id; // frontend-generated ID like "leave_123456"

    private String userId;
    private String studentId;
    private String studentName;
    private String studentDepartment;
    private String residentialType;

    private String startDate;
    private String startTime;
    private String endDate;
    private String endTime;

    private String type;   // SICK, NORMAL, OD, SPECIAL_PERMISSION
    
    @Column(columnDefinition = "TEXT")
    private String reason;

    private String status; // Pending, Approved, Rejected

    private String mentorId;
    private String parentId;
    private String wardenId;
    private Boolean isHosteler = false;

    @Column(columnDefinition = "TEXT")
    private String approvalsJson; // JSON array string of approval objects

    private String appliedAt;

    @PrePersist
    protected void onCreate() {
        if (appliedAt == null) {
            appliedAt = LocalDateTime.now().toString();
        }
        if (status == null) {
            status = "Pending";
        }
        if (id == null) {
            id = "leave_" + System.currentTimeMillis();
        }
    }

    // --- Getters & Setters ---

    public Long getDbId() { return dbId; }
    public void setDbId(Long dbId) { this.dbId = dbId; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentDepartment() { return studentDepartment; }
    public void setStudentDepartment(String studentDepartment) { this.studentDepartment = studentDepartment; }

    public String getResidentialType() { return residentialType; }
    public void setResidentialType(String residentialType) { this.residentialType = residentialType; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMentorId() { return mentorId; }
    public void setMentorId(String mentorId) { this.mentorId = mentorId; }

    public String getParentId() { return parentId; }
    public void setParentId(String parentId) { this.parentId = parentId; }

    public String getWardenId() { return wardenId; }
    public void setWardenId(String wardenId) { this.wardenId = wardenId; }

    public Boolean getIsHosteler() { return isHosteler; }
    public void setIsHosteler(Boolean isHosteler) { this.isHosteler = isHosteler; }

    public String getApprovalsJson() { return approvalsJson; }
    public void setApprovalsJson(String approvalsJson) { this.approvalsJson = approvalsJson; }

    public String getAppliedAt() { return appliedAt; }
    public void setAppliedAt(String appliedAt) { this.appliedAt = appliedAt; }
}
