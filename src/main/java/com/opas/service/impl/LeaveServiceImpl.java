package com.opas.service.impl;

import com.opas.dto.ApprovalDTO;
import com.opas.dto.LeaveRequestDTO;
import com.opas.model.*;
import com.opas.repository.ApprovalRepository;
import com.opas.repository.LeaveRequestRepository;
import com.opas.repository.StudentRepository;
import com.opas.repository.UserRepository;
import com.opas.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

    @Autowired
    LeaveRequestRepository leaveRequestRepository;

    @Autowired
    ApprovalRepository approvalRepository;

    @Autowired
    StudentRepository studentRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public LeaveRequest applyLeave(LeaveRequestDTO leaveRequestDTO) {
        Student student = studentRepository.findById(leaveRequestDTO.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setStudent(student);
        leaveRequest.setStartDate(leaveRequestDTO.getStartDate());
        leaveRequest.setEndDate(leaveRequestDTO.getEndDate());
        leaveRequest.setReason(leaveRequestDTO.getReason());
        leaveRequest.setLeaveType(leaveRequestDTO.getLeaveType());
        // Status defaults to PENDING in @PrePersist

        return leaveRequestRepository.save(leaveRequest);
    }

    @Override
    public LeaveRequest approveLeave(ApprovalDTO approvalDTO) {
        LeaveRequest request = leaveRequestRepository.findById(approvalDTO.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

        User approver = userRepository.findById(approvalDTO.getApproverId())
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        // Create Approval record
        Approval approval = new Approval();
        approval.setRequest(request);
        approval.setApprover(approver);
        approval.setStatus(approvalDTO.getStatus());
        approval.setComments(approvalDTO.getComments());
        if (request.getLeaveType() == LeaveType.OD) {
            approval.setRequestType(RequestType.OD);
        } else {
            approval.setRequestType(RequestType.LEAVE);
        }

        approvalRepository.save(approval);

        // Update Request Status
        request.setStatus(approvalDTO.getStatus());
        return leaveRequestRepository.save(request);
    }

    @Override
    public List<LeaveRequest> getStudentLeaves(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return leaveRequestRepository.findByStudent(student);
    }

    @Override
    public List<LeaveRequest> getAllPendingRequests() {
        return leaveRequestRepository.findByStatus(RequestStatus.PENDING);
    }
}
