package com.opas.dto;

import lombok.Data;

@Data
public class StudentSummaryDTO {
    private Long id;
    private String name;
    private String registerNumber;
    private String department;
    private float cgpa;
    private int attendancePercentage;
}
