package com.opas.repository;

import com.opas.model.Approval;
import com.opas.model.LeaveRequest;
import com.opas.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByRequest(LeaveRequest request);

    List<Approval> findByApprover(User approver);
}
