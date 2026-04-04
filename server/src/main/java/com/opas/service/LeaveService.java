package com.opas.service;

import com.opas.dto.ApprovalDTO;
import com.opas.dto.LeaveRequestDTO;
import com.opas.model.LeaveRequest;
import java.util.List;

public interface LeaveService {
    LeaveRequest applyLeave(LeaveRequestDTO leaveRequestDTO);

    LeaveRequest approveLeave(ApprovalDTO approvalDTO);

    List<LeaveRequest> getStudentLeaves(Long studentId);

    List<LeaveRequest> getAllPendingRequests();
}
