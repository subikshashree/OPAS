package com.opas.repository;

import com.opas.model.LeaveRequest;
import com.opas.model.Student;
import com.opas.model.RequestStatus;
import com.opas.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStudent(Student student);

    List<LeaveRequest> findByStatus(RequestStatus status);

    // For HOD (Approve OD/Leave for Dept)
    List<LeaveRequest> findByStudentDepartment(String department);

    // For Mentor (Approve Leave for assigned students)
    List<LeaveRequest> findByStudentMentor(User mentor);
}
