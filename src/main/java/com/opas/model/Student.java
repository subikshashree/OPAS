package com.opas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(unique = true, nullable = false)
    private String registerNumber;

    private String department;

    private String year;

    private float cgpa;

    private int totalAttendanceDays;

    private int presentDays;
    
    // Mentor Mapping (Faculty)
    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private User mentor;

    // Parent Mapping
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private User parent;


    public Student() {}

    public Student(Long id, User user, String registerNumber, String department, String year, float cgpa, int totalAttendanceDays, int presentDays, User mentor, User parent) {
        this.id = id;
        this.user = user;
        this.registerNumber = registerNumber;
        this.department = department;
        this.year = year;
        this.cgpa = cgpa;
        this.totalAttendanceDays = totalAttendanceDays;
        this.presentDays = presentDays;
        this.mentor = mentor;
        this.parent = parent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public float getCgpa() {
        return cgpa;
    }

    public void setCgpa(float cgpa) {
        this.cgpa = cgpa;
    }

    public int getTotalAttendanceDays() {
        return totalAttendanceDays;
    }

    public void setTotalAttendanceDays(int totalAttendanceDays) {
        this.totalAttendanceDays = totalAttendanceDays;
    }

    public int getPresentDays() {
        return presentDays;
    }

    public void setPresentDays(int presentDays) {
        this.presentDays = presentDays;
    }

    public User getMentor() {
        return mentor;
    }

    public void setMentor(User mentor) {
        this.mentor = mentor;
    }

    public User getParent() {
        return parent;
    }

    public void setParent(User parent) {
        this.parent = parent;
    }
}
