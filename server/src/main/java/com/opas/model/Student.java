package com.opas.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
