package com.opas.service.impl;

import com.opas.dto.TaskDTO;
import com.opas.model.Task;
import com.opas.model.TaskStatus;
import com.opas.model.User;
import com.opas.model.Student;
import com.opas.repository.TaskRepository;
import com.opas.repository.StudentRepository;
import com.opas.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public Task createTask(TaskDTO taskDTO, User mentor) {
        Student student = studentRepository.findById(taskDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStudent(student);
        task.setMentor(mentor);
        task.setDueDate(taskDTO.getDueDate());
        task.setStatus(TaskStatus.PENDING);

        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long taskId, TaskDTO taskDTO) {
        Task task = getTaskById(taskId);
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        if (taskDTO.getStatus() != null) {
            task.setStatus(taskDTO.getStatus());
        }
        if (taskDTO.getDueDate() != null) {
            task.setDueDate(taskDTO.getDueDate());
        }
        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    @Override
    public List<Task> getTasksByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return taskRepository.findByStudent(student);
    }

    @Override
    public List<Task> getTasksByMentor(User mentor) {
        return taskRepository.findByMentor(mentor);
    }

    @Override
    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public Task markTaskAsCompleted(Long taskId) {
        Task task = getTaskById(taskId);
        task.setStatus(TaskStatus.COMPLETED);
        return taskRepository.save(task);
    }
}
