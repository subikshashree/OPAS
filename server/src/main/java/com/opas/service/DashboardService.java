package com.opas.service;

import com.opas.dto.*;
import com.opas.model.User;

public interface DashboardService {
    HODDashboardDTO getHODDashboard(User hod);

    MentorDashboardDTO getMentorDashboard(User mentor);

    ParentDashboardDTO getParentDashboard(User parent);

    StudentDashboardDTO getStudentDashboard(User student);
}
