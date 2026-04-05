package com.opas.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "company_participation")
public class CompanyParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String companyName;

    private String eventType;

    private LocalDate participationDate;

    private String outcome;


    public CompanyParticipation() {}

    public CompanyParticipation(Long id, Student student, String companyName, String eventType, LocalDate participationDate, String outcome) {
        this.id = id;
        this.student = student;
        this.companyName = companyName;
        this.eventType = eventType;
        this.participationDate = participationDate;
        this.outcome = outcome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public LocalDate getParticipationDate() {
        return participationDate;
    }

    public void setParticipationDate(LocalDate participationDate) {
        this.participationDate = participationDate;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }
}
