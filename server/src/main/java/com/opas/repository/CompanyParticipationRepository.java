package com.opas.repository;

import com.opas.model.CompanyParticipation;
import com.opas.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompanyParticipationRepository extends JpaRepository<CompanyParticipation, Long> {
    List<CompanyParticipation> findByStudent(Student student);
}
