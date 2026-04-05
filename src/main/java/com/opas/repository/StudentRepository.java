package com.opas.repository;

import com.opas.model.Student;
import com.opas.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);

    Optional<Student> findByRegisterNumber(String registerNumber);

    // For HOD
    List<Student> findByDepartment(String department);

    // For Mentor
    List<Student> findByMentor(User mentor);

    // For Parent
    List<Student> findByParent(User parent);
}
