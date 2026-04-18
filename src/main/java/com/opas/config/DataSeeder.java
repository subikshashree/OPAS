package com.opas.config;

import com.opas.model.OpasLeave;
import com.opas.model.Role;
import com.opas.model.User;
import com.opas.repository.OpasLeaveRepository;
import com.opas.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the H2 database with all the mock users and leave requests
 * that were previously hardcoded in the React frontend's constants.tsx.
 * Only seeds if the database is empty (first boot).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final OpasLeaveRepository opasLeaveRepository;

    public DataSeeder(UserRepository userRepository, OpasLeaveRepository opasLeaveRepository) {
        this.userRepository = userRepository;
        this.opasLeaveRepository = opasLeaveRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 1) {
            System.out.println("[DataSeeder] Database already seeded. Skipping...");
            return;
        }
        System.out.println("[DataSeeder] Seeding database with initial data...");
        seedUsers();
        seedLeaves();
        System.out.println("[DataSeeder] ✅ Seeding complete!");
    }

    private void seedUsers() {
        // Students
        createUser("alex.j@college.edu", "Alex Johnson", Role.STUDENT, "Computer Science",
                "CS2024001", true, "HOSTEL", "B-312", "Block B", null,
                "+91 98765 43210", "https://picsum.photos/seed/alex/100/100",
                "3001", "2001", null);

        createUser("britt.s@college.edu", "Brittany Smith", Role.STUDENT, "Computer Science",
                "CS2024002", false, "DAYSCHOLAR", null, null, "Route 7A",
                "+91 98765 43211", "https://picsum.photos/seed/brittany/100/100",
                "3001", "2002", null);

        createUser("carlos.d@college.edu", "Carlos Diaz", Role.STUDENT, "Computer Science",
                "CS2024003", true, "HOSTEL", "A-105", "Block A", null,
                "+91 98765 43212", "https://picsum.photos/seed/carlos/100/100",
                "3001", "2003", null);

        createUser("david.w@college.edu", "David Wilson", Role.STUDENT, "Computer Science",
                "CS2024004", true, "HOSTEL", "B-210", "Block B", null,
                "+91 98765 43213", "https://picsum.photos/seed/david_w/100/100",
                "3001", "2004", null);

        // Faculty / Mentor
        User faculty = createUser("s.smith@college.edu", "Dr. Sarah Smith", Role.FACULTY, "Computer Science",
                null, false, null, null, null, null,
                "+91 90000 10001", "https://picsum.photos/seed/sarah/100/100",
                null, null, null);
        faculty.setMenteeIds("1001,1002,1003,1004");
        userRepository.save(faculty);

        // Parents
        createUser("robert.j@gmail.com", "Robert Johnson", Role.PARENT, null,
                null, false, null, null, null, null,
                "+91 80000 10001", "https://picsum.photos/seed/robert/100/100",
                null, null, null);

        createUser("linda.s@gmail.com", "Linda Smith", Role.PARENT, null,
                null, false, null, null, null, null,
                "+91 80000 10002", "https://picsum.photos/seed/linda/100/100",
                null, null, null);

        createUser("maria.d@gmail.com", "Maria Diaz", Role.PARENT, null,
                null, false, null, null, null, null,
                "+91 80000 10003", "https://picsum.photos/seed/maria/100/100",
                null, null, null);

        createUser("james.w@gmail.com", "James Wilson", Role.PARENT, null,
                null, false, null, null, null, null,
                "+91 80000 10004", "https://picsum.photos/seed/james/100/100",
                null, null, null);

        // Warden
        User warden = createUser("d.miller@college.edu", "Mr. David Miller", Role.WARDEN, null,
                null, false, null, null, null, null,
                "+91 90000 20001", "https://picsum.photos/seed/warden_david/100/100",
                null, null, null);
        warden.setHostelName("Boys Hostel - Block A & B");
        userRepository.save(warden);

        // HOD
        createUser("e.chen@college.edu", "Dr. Emily Chen", Role.HOD, "Computer Science",
                null, false, null, null, null, null,
                "+91 90000 30001", "https://picsum.photos/seed/emily/100/100",
                null, null, null);

        // Admin (skip if already exists from first Google login)
        if (userRepository.findByEmail("admin@college.edu").isEmpty()) {
            createUser("admin@college.edu", "System Administrator", Role.ADMIN, null,
                    null, false, null, null, null, null,
                    "+91 90000 99999", "https://picsum.photos/seed/admin/100/100",
                    null, null, null);
        }
    }

    private User createUser(String email, String name, Role role, String department,
                            String studentId, boolean isHosteler, String residentialType,
                            String roomNumber, String hostelBlock, String busNumber,
                            String phone, String avatar,
                            String mentorId, String parentId, String wardenId) {
        if (userRepository.findByEmail(email).isPresent()) return userRepository.findByEmail(email).get();
        
        User user = new User();
        user.setUsername(email);
        user.setEmail(email);
        user.setPassword("$2a$10$dummyhashforseededusers");
        user.setName(name);
        user.setRole(role);
        user.setDepartment(department);
        user.setStudentId(studentId);
        user.setIsHosteler(isHosteler);
        user.setResidentialType(residentialType);
        user.setRoomNumber(roomNumber);
        user.setHostelBlock(hostelBlock);
        user.setBusNumber(busNumber);
        user.setPhone(phone);
        user.setAvatar(avatar);
        user.setStatus("ACTIVE");
        user.setMentorId(mentorId);
        user.setParentId(parentId);
        user.setWardenId(wardenId);
        return userRepository.save(user);
    }

    private void seedLeaves() {
        if (opasLeaveRepository.count() > 0) return;

        createLeave("lr1", "1001", "CS2024001", "Alex Johnson", "Computer Science",
                "HOSTEL", "2024-10-25", "2024-10-25", "SICK",
                "Fever and body ache", "Pending", "[]",
                "2024-10-25T08:00:00Z");

        createLeave("lr2", "1003", "CS2024003", "Carlos Diaz", "Computer Science",
                "HOSTEL", "2024-10-28", "2024-10-29", "SPECIAL_PERMISSION",
                "Family function - Sister wedding", "Pending", "[]",
                "2024-10-24T10:00:00Z");

        createLeave("lr3", "1004", "CS2024004", "David Wilson", "Computer Science",
                "HOSTEL", "2024-10-30", "2024-10-30", "OD",
                "Inter-college Technical Symposium Paper Presentation", "Pending", "[]",
                "2024-10-23T09:00:00Z");

        createLeave("lr4", "1001", "CS2024001", "Alex Johnson", "Computer Science",
                "HOSTEL", "2024-10-20", "2024-10-21", "SPECIAL_PERMISSION",
                "Medical checkup at hometown hospital", "Pending",
                "[{\"role\":\"PARENT\",\"approverId\":\"2001\",\"approverName\":\"Robert Johnson\",\"timestamp\":\"2024-10-18T08:30:00Z\",\"approved\":true},{\"role\":\"WARDEN\",\"approverId\":\"4001\",\"approverName\":\"Mr. David Miller\",\"timestamp\":\"2024-10-18T11:00:00Z\",\"approved\":true}]",
                "2024-10-18T07:00:00Z");

        createLeave("lr5", "1002", "CS2024002", "Brittany Smith", "Computer Science",
                "DAYSCHOLAR", "2024-10-26", "2024-10-26", "OD",
                "Hackathon at IIT Madras", "Approved",
                "[{\"role\":\"PARENT\",\"approverId\":\"2002\",\"approverName\":\"Linda Smith\",\"timestamp\":\"2024-10-22T11:00:00Z\",\"approved\":true},{\"role\":\"FACULTY\",\"approverId\":\"3001\",\"approverName\":\"Dr. Sarah Smith\",\"timestamp\":\"2024-10-22T14:00:00Z\",\"approved\":true}]",
                "2024-10-22T10:00:00Z");
    }

    private void createLeave(String id, String userId, String studentId, String studentName,
                             String department, String residentialType,
                             String startDate, String endDate, String type,
                             String reason, String status, String approvalsJson,
                             String appliedAt) {
        OpasLeave leave = new OpasLeave();
        leave.setId(id);
        leave.setUserId(userId);
        leave.setStudentId(studentId);
        leave.setStudentName(studentName);
        leave.setStudentDepartment(department);
        leave.setResidentialType(residentialType);
        leave.setStartDate(startDate);
        leave.setEndDate(endDate);
        leave.setType(type);
        leave.setReason(reason);
        leave.setStatus(status);
        leave.setApprovalsJson(approvalsJson);
        leave.setAppliedAt(appliedAt);
        opasLeaveRepository.save(leave);
    }
}
