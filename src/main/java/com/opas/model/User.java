package com.opas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private boolean isActive = true;

    private LocalDateTime createdAt;

    // --- NEW OPAS V2 FRONTEND INTEGRATION FIELDS ---
    private String name;
    private String studentId;
    private Boolean isHosteler = false;
    private String residentialType;
    private String roomNumber;
    private String hostelBlock;
    private String department;
    private String avatar;
    private String status = "ACTIVE";
    private String phone;
    private String busNumber;
    private String hostelName;
    private String mentorId;
    private String parentId;
    private String wardenId;
    private String wardId;
    
    @Column(columnDefinition = "TEXT")
    private String menteeIds;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }


    public User() {}

    public User(Long id, String username, String password, String email, Role role, boolean isActive, LocalDateTime createdAt, String name, String studentId, Boolean isHosteler, String residentialType, String roomNumber, String hostelBlock, String department, String avatar, String status, String phone, String busNumber, String hostelName, String mentorId, String parentId, String wardenId, String wardId, String menteeIds) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.name = name;
        this.studentId = studentId;
        this.isHosteler = isHosteler;
        this.residentialType = residentialType;
        this.roomNumber = roomNumber;
        this.hostelBlock = hostelBlock;
        this.department = department;
        this.avatar = avatar;
        this.status = status;
        this.phone = phone;
        this.busNumber = busNumber;
        this.hostelName = hostelName;
        this.mentorId = mentorId;
        this.parentId = parentId;
        this.wardenId = wardenId;
        this.wardId = wardId;
        this.menteeIds = menteeIds;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Boolean isIsHosteler() {
        return isHosteler;
    }

    public void setIsHosteler(Boolean isHosteler) {
        this.isHosteler = isHosteler;
    }

    public String getResidentialType() {
        return residentialType;
    }

    public void setResidentialType(String residentialType) {
        this.residentialType = residentialType;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getHostelBlock() {
        return hostelBlock;
    }

    public void setHostelBlock(String hostelBlock) {
        this.hostelBlock = hostelBlock;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public String getHostelName() {
        return hostelName;
    }

    public void setHostelName(String hostelName) {
        this.hostelName = hostelName;
    }

    public String getMentorId() {
        return mentorId;
    }

    public void setMentorId(String mentorId) {
        this.mentorId = mentorId;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getWardenId() {
        return wardenId;
    }

    public void setWardenId(String wardenId) {
        this.wardenId = wardenId;
    }

    public String getWardId() {
        return wardId;
    }

    public void setWardId(String wardId) {
        this.wardId = wardId;
    }

    public String getMenteeIds() {
        return menteeIds;
    }

    public void setMenteeIds(String menteeIds) {
        this.menteeIds = menteeIds;
    }
}
