package com.opas.service.impl;

import com.opas.dto.*;
import com.opas.model.*;
import com.opas.repository.*;
import com.opas.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.List;
import java.util.ArrayList;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private AcademicRecordRepository academicRecordRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public HODDashboardDTO getHODDashboard(User hod) {
        // Assuming HOD is associated with a department.
        // For this prototype, we might need a way to link HOD to Dept.
        // Let's assume HOD can see all students or filter by a specific department if
        // we had that field on User or a separate Faculty entity.
        // For now, let's fetch students based on a hardcoded department or all students
        // if not specified.
        // Ideally, we'd have `hod.getDepartment()`. Let's assume the HOD user has a
        // department field or we match by some logic.
        // Since User/Faculty model doesn't explicitly store Dept for HOD login easily
        // without extra query,
        // let's fetch ALL students for now or specific ones if we had data.
        // Better: Let's fetch students where department matches something.
        // Since we don't have department in User, let's just get all students for the
        // demo or filter by 'CSE' as default.

        List<Student> students = studentRepository.findAll(); // In real app, filter by HOD's dept

        HODDashboardDTO dto = new HODDashboardDTO();
        dto.setTotalStudents(students.size());

        List<LeaveRequest> requests = leaveRequestRepository.findAll(); // In real app, filter by Dept

        int pendingLeave = 0;
        int pendingOD = 0;
        for (LeaveRequest req : requests) {
            if (req.getStatus() == RequestStatus.PENDING) {
                if (req.getLeaveType() == LeaveType.OD)
                    pendingOD++;
                else
                    pendingLeave++;
            }
        }
        dto.setPendingLeaveRequests(pendingLeave);
        dto.setPendingODRequests(pendingOD);

        // Top Performers (Dummy logic or sorting by CGPA)
        List<StudentSummaryDTO> topPerformers = students.stream()
                .sorted((s1, s2) -> Float.compare(s2.getCgpa(), s1.getCgpa()))
                .limit(5)
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList());
        dto.setTopPerformers(topPerformers);

        // Recent Requests
        List<LeaveRequestDTO> recentRequests = requests.stream()
                .sorted((r1, r2) -> r2.getRequestedAt().compareTo(r1.getRequestedAt()))
                .limit(10)
                .map(this::convertToLeaveRequestDTO)
                .collect(Collectors.toList());
        dto.setRecentRequests(recentRequests);

        return dto;
    }

    @Override
    public MentorDashboardDTO getMentorDashboard(User mentor) {
        List<Student> assignedStudents = studentRepository.findByMentor(mentor);

        MentorDashboardDTO dto = new MentorDashboardDTO();
        dto.setAssignedStudentsCount(assignedStudents.size());

        List<LeaveRequest> myStudentsRequests = leaveRequestRepository.findByStudentMentor(mentor);
        long pendingLeaves = myStudentsRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.PENDING)
                .count();
        dto.setPendingLeaveRequests((int) pendingLeaves);

        List<Task> tasks = taskRepository.findByMentor(mentor);
        long pendingTasks = tasks.stream()
                .filter(t -> t.getStatus() != TaskStatus.COMPLETED)
                .count();
        dto.setPendingTaskCompletions((int) pendingTasks);

        dto.setAssignedStudents(assignedStudents.stream()
                .map(this::convertToSummaryDTO)
                .collect(Collectors.toList()));

        dto.setRecentLeaveRequests(myStudentsRequests.stream()
                .sorted((r1, r2) -> r2.getRequestedAt().compareTo(r1.getRequestedAt()))
                .limit(5)
                .map(this::convertToLeaveRequestDTO)
                .collect(Collectors.toList()));

        dto.setRecentTasks(tasks.stream()
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .limit(5)
                .map(this::convertToTaskDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    @Override
    public ParentDashboardDTO getParentDashboard(User parent) {
        List<Student> students = studentRepository.findByParent(parent);
        Student student = students.isEmpty() ? null : students.get(0); // Handle case where no student mapped

        if (student == null)
            return new ParentDashboardDTO();

        ParentDashboardDTO dto = new ParentDashboardDTO();
        dto.setStudentName(student.getUser().getUsername()); // Or proper name
        dto.setRegisterNumber(student.getRegisterNumber());
        dto.setCgpa(student.getCgpa());
        // dto.setAttendancePercentage(student.getAttendancePercentage()); // usage of
        // calculated getter if exists

        // If simple calculation needed:
        if (student.getTotalAttendanceDays() > 0) {
            dto.setAttendancePercentage((int) ((student.getPresentDays() * 100.0) / student.getTotalAttendanceDays()));
        } else {
            dto.setAttendancePercentage(0);
        }

        dto.setAcademicHistory(academicRecordRepository.findByStudent(student));

        List<Task> tasks = taskRepository.findByStudent(student);
        dto.setRecentTasks(tasks.stream()
                .limit(5)
                .map(this::convertToTaskDTO)
                .collect(Collectors.toList()));

        List<LeaveRequest> requests = leaveRequestRepository.findByStudent(student);
        dto.setRecentLeaveRequests(requests.stream()
                .limit(5)
                .map(this::convertToLeaveRequestDTO)
                .collect(Collectors.toList()));

        return dto;
    }

    @Override
    public StudentDashboardDTO getStudentDashboard(User user) {
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Student record not found"));

        StudentDashboardDTO dto = new StudentDashboardDTO();
        dto.setName(student.getUser().getUsername());
        dto.setRegisterNumber(student.getRegisterNumber());

        dto.setDepartment(student.getDepartment());
        dto.setCgpa(student.getCgpa());

        if (student.getTotalAttendanceDays() > 0) {
            dto.setAttendancePercentage(
                    (float) ((student.getPresentDays() * 100.0) / student.getTotalAttendanceDays()));
        } else {
            dto.setAttendancePercentage(0f);
        }

        dto.setAcademicHistory(academicRecordRepository.findByStudent(student));

        return dto;
    }

    // Converters

    private StudentSummaryDTO convertToSummaryDTO(Student student) {
        StudentSummaryDTO dto = new StudentSummaryDTO();
        dto.setId(student.getId());
        dto.setName(student.getUser().getUsername());
        dto.setRegisterNumber(student.getRegisterNumber());
        dto.setDepartment(student.getDepartment());
        dto.setCgpa(student.getCgpa());
        if (student.getTotalAttendanceDays() > 0) {
            dto.setAttendancePercentage((int) ((student.getPresentDays() * 100.0) / student.getTotalAttendanceDays()));
        }
        return dto;
    }

    private LeaveRequestDTO convertToLeaveRequestDTO(LeaveRequest request) {
        LeaveRequestDTO dto = new LeaveRequestDTO();
        dto.setId(request.getId());
        dto.setStudentId(request.getStudent().getId());
        dto.setStudentName(request.getStudent().getUser().getUsername());
        dto.setRegisterNumber(request.getStudent().getRegisterNumber());
        dto.setStartDate(request.getStartDate());
        dto.setEndDate(request.getEndDate());
        dto.setReason(request.getReason());
        dto.setLeaveType(request.getLeaveType());
        dto.setStatus(request.getStatus());
        return dto;
    }

    private TaskDTO convertToTaskDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStudentId(task.getStudent().getId());
        dto.setStudentName(task.getStudent().getUser().getUsername());
        dto.setMentorId(task.getMentor().getId());
        dto.setMentorName(task.getMentor().getUsername());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());
        return dto;
    }
}
