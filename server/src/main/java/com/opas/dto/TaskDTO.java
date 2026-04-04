package com.opas.dto;

import com.opas.model.TaskStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private Long studentId;
    private String studentName;
    private Long mentorId;
    private String mentorName;
    private TaskStatus status;
    private LocalDate dueDate;
}
