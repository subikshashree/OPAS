package com.opas.repository;

import com.opas.model.Task;
import com.opas.model.Student;
import com.opas.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStudent(Student student);

    List<Task> findByMentor(User mentor);
}
