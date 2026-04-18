package com.opas.repository;

import com.opas.model.OpasLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OpasLeaveRepository extends JpaRepository<OpasLeave, Long> {
    Optional<OpasLeave> findById(String id);
    List<OpasLeave> findByUserId(String userId);
    List<OpasLeave> findByStudentId(String studentId);
    List<OpasLeave> findByStatus(String status);
    void deleteById(String id);
}
