package com.opas.service;

import com.opas.dto.TaskDTO;
import com.opas.model.Task;
import com.opas.model.User;
import java.util.List;

public interface TaskService {
    Task createTask(TaskDTO taskDTO, User mentor);

    Task updateTask(Long taskId, TaskDTO taskDTO);

    void deleteTask(Long taskId);

    List<Task> getTasksByStudent(Long studentId);

    List<Task> getTasksByMentor(User mentor);

    Task getTaskById(Long taskId);

    Task markTaskAsCompleted(Long taskId);
}
