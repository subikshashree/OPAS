package com.opas.dto;

import com.opas.model.RequestStatus;
import lombok.Data;

@Data
public class ApprovalDTO {
    private Long requestId;
    private Long approverId;
    private RequestStatus status;
    private String comments;
}
