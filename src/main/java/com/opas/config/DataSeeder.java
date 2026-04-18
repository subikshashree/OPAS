package com.opas.config;

import com.opas.model.Department;
import com.opas.model.Message;
import com.opas.model.OpasLeave;
import com.opas.model.Role;
import com.opas.model.User;
import com.opas.repository.DepartmentRepository;
import com.opas.repository.MessageRepository;
import com.opas.repository.OpasLeaveRepository;
import com.opas.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Seeds the H2 database with all mock users and leave requests on first boot.
 * Uses a two-pass approach: create all users first, then link mentor/parent IDs
 * using actual DB-generated IDs.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final OpasLeaveRepository opasLeaveRepository;
    private final DepartmentRepository departmentRepository;
    private final MessageRepository messageRepository;

    // Maps logical key -> actual DB id for cross-referencing
    private final Map<String, String> idMap = new HashMap<>();

    public DataSeeder(UserRepository userRepository, OpasLeaveRepository opasLeaveRepository, DepartmentRepository departmentRepository, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.opasLeaveRepository = opasLeaveRepository;
        this.departmentRepository = departmentRepository;
        this.messageRepository = messageRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 1) {
            System.out.println("[DataSeeder] Database already seeded. Skipping...");
            return;
        }
        System.out.println("[DataSeeder] Seeding database with initial data...");
        seedUsers();
        linkRelationships();
        seedLeaves();
        seedDepartments();
        seedMessages();
        System.out.println("[DataSeeder] ✅ Seeding complete! " + userRepository.count() + " users, " + opasLeaveRepository.count() + " leaves, " + departmentRepository.count() + " departments.");
    }

    // ════════════════════════════════════════════════════════════════
    // PASS 1: Create all users without relationships
    // ════════════════════════════════════════════════════════════════
    private void seedUsers() {
        // Students
        save("student_alex", "alex.j@college.edu", "Alex Johnson", Role.STUDENT, "Computer Science",
                "CS2024001", true, "HOSTEL", "B-312", "Block B", null,
                "+91 98765 43210", "https://picsum.photos/seed/alex/100/100");

        save("student_britt", "britt.s@college.edu", "Brittany Smith", Role.STUDENT, "Computer Science",
                "CS2024002", false, "DAYSCHOLAR", null, null, "Route 7A",
                "+91 98765 43211", "https://picsum.photos/seed/brittany/100/100");

        save("student_carlos", "carlos.d@college.edu", "Carlos Diaz", Role.STUDENT, "Computer Science",
                "CS2024003", true, "HOSTEL", "A-105", "Block A", null,
                "+91 98765 43212", "https://picsum.photos/seed/carlos/100/100");

        save("student_david", "david.w@college.edu", "David Wilson", Role.STUDENT, "Computer Science",
                "CS2024004", true, "HOSTEL", "B-210", "Block B", null,
                "+91 98765 43213", "https://picsum.photos/seed/david_w/100/100");

        // Faculty / Mentor
        User faculty = save("faculty_sarah", "s.smith@college.edu", "Dr. Sarah Smith", Role.FACULTY, "Computer Science",
                null, false, null, null, null, null,
                "+91 90000 10001", "https://picsum.photos/seed/sarah/100/100");

        // Parents
        save("parent_robert", "robert.j@gmail.com", "Robert Johnson", Role.PARENT, null,
                null, false, null, null, null, null,
                "+91 80000 10001", "https://picsum.photos/seed/robert/100/100");

        save("parent_linda", "linda.s@gmail.com", "Linda Smith", Role.PARENT, null,
                null, false, null, null, null, null,
                "+91 80000 10002", "https://picsum.photos/seed/linda/100/100");

        save("parent_maria", "maria.d@gmail.com", "Maria Diaz", Role.PARENT, null,
                null, false, null, null, null, null,
                "+91 80000 10003", "https://picsum.photos/seed/maria/100/100");

        save("parent_james", "james.w@gmail.com", "James Wilson", Role.PARENT, null,
                null, false, null, null, null, null,
                "+91 80000 10004", "https://picsum.photos/seed/james/100/100");

        // Warden
        User warden = save("warden_david", "d.miller@college.edu", "Mr. David Miller", Role.WARDEN, null,
                null, false, null, null, null, null,
                "+91 90000 20001", "https://picsum.photos/seed/warden_david/100/100");
        warden.setHostelName("Boys Hostel - Block A & B");
        userRepository.save(warden);

        // HOD
        save("hod_emily", "e.chen@college.edu", "Dr. Emily Chen", Role.HOD, "Computer Science",
                null, false, null, null, null, null,
                "+91 90000 30001", "https://picsum.photos/seed/emily/100/100");

        // Admin
        if (userRepository.findByEmail("admin@college.edu").isEmpty()) {
            save("admin", "admin@college.edu", "System Administrator", Role.ADMIN, null,
                    null, false, null, null, null, null,
                    "+91 90000 99999", "https://picsum.photos/seed/admin/100/100");
        }
    }

    // ════════════════════════════════════════════════════════════════
    // PASS 2: Link mentor/parent/warden IDs using actual DB IDs
    // ════════════════════════════════════════════════════════════════
    private void linkRelationships() {
        String facultyId = idMap.get("faculty_sarah");
        String wardenId = idMap.get("warden_david");

        // Link students to their mentor, parent, and warden
        linkStudent("student_alex", facultyId, idMap.get("parent_robert"), wardenId);
        linkStudent("student_britt", facultyId, idMap.get("parent_linda"), null); // day scholar, no warden
        linkStudent("student_carlos", facultyId, idMap.get("parent_maria"), wardenId);
        linkStudent("student_david", facultyId, idMap.get("parent_james"), wardenId);

        // Set faculty mentee IDs
        User faculty = userRepository.findById(Long.parseLong(facultyId)).orElse(null);
        if (faculty != null) {
            faculty.setMenteeIds(
                idMap.get("student_alex") + "," +
                idMap.get("student_britt") + "," +
                idMap.get("student_carlos") + "," +
                idMap.get("student_david")
            );
            userRepository.save(faculty);
        }

        // Set parent wardIds
        linkParentWard("parent_robert", "student_alex");
        linkParentWard("parent_linda", "student_britt");
        linkParentWard("parent_maria", "student_carlos");
        linkParentWard("parent_james", "student_david");
    }

    private void linkStudent(String studentKey, String mentorId, String parentId, String wardenId) {
        String dbId = idMap.get(studentKey);
        if (dbId == null) return;
        User student = userRepository.findById(Long.parseLong(dbId)).orElse(null);
        if (student == null) return;
        student.setMentorId(mentorId);
        student.setParentId(parentId);
        student.setWardenId(wardenId);
        userRepository.save(student);
    }

    private void linkParentWard(String parentKey, String studentKey) {
        String parentDbId = idMap.get(parentKey);
        String studentDbId = idMap.get(studentKey);
        if (parentDbId == null || studentDbId == null) return;
        User parent = userRepository.findById(Long.parseLong(parentDbId)).orElse(null);
        if (parent != null) {
            parent.setWardId(studentDbId);
            userRepository.save(parent);
        }
    }

    // ════════════════════════════════════════════════════════════════
    // Helper: Create user and track its DB ID
    // ════════════════════════════════════════════════════════════════
    private User save(String key, String email, String name, Role role, String department,
                      String studentId, boolean isHosteler, String residentialType,
                      String roomNumber, String hostelBlock, String busNumber,
                      String phone, String avatar) {
        if (userRepository.findByEmail(email).isPresent()) {
            User existing = userRepository.findByEmail(email).get();
            idMap.put(key, String.valueOf(existing.getId()));
            return existing;
        }

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
        User saved = userRepository.save(user);
        idMap.put(key, String.valueOf(saved.getId()));
        return saved;
    }

    // ════════════════════════════════════════════════════════════════
    // Seed Leave Requests
    // ════════════════════════════════════════════════════════════════
    private void seedLeaves() {
        if (opasLeaveRepository.count() > 0) return;

        String alexId = idMap.get("student_alex");
        String carlosId = idMap.get("student_carlos");
        String davidId = idMap.get("student_david");
        String brittId = idMap.get("student_britt");
        String robertId = idMap.get("parent_robert");
        String lindaId = idMap.get("parent_linda");
        String wardenDbId = idMap.get("warden_david");
        String facultyId = idMap.get("faculty_sarah");

        createLeave("lr1", alexId, "CS2024001", "Alex Johnson", "Computer Science",
                "HOSTEL", "2024-10-25", "2024-10-25", "SICK",
                "Fever and body ache", "Pending", "[]",
                "2024-10-25T08:00:00Z");

        createLeave("lr2", carlosId, "CS2024003", "Carlos Diaz", "Computer Science",
                "HOSTEL", "2024-10-28", "2024-10-29", "SPECIAL_PERMISSION",
                "Family function - Sister wedding", "Pending", "[]",
                "2024-10-24T10:00:00Z");

        createLeave("lr3", davidId, "CS2024004", "David Wilson", "Computer Science",
                "HOSTEL", "2024-10-30", "2024-10-30", "OD",
                "Inter-college Technical Symposium Paper Presentation", "Pending", "[]",
                "2024-10-23T09:00:00Z");

        createLeave("lr4", alexId, "CS2024001", "Alex Johnson", "Computer Science",
                "HOSTEL", "2024-10-20", "2024-10-21", "SPECIAL_PERMISSION",
                "Medical checkup at hometown hospital", "Pending",
                "[{\"role\":\"PARENT\",\"approverId\":\"" + robertId + "\",\"approverName\":\"Robert Johnson\",\"timestamp\":\"2024-10-18T08:30:00Z\",\"approved\":true},{\"role\":\"WARDEN\",\"approverId\":\"" + wardenDbId + "\",\"approverName\":\"Mr. David Miller\",\"timestamp\":\"2024-10-18T11:00:00Z\",\"approved\":true}]",
                "2024-10-18T07:00:00Z");

        createLeave("lr5", brittId, "CS2024002", "Brittany Smith", "Computer Science",
                "DAYSCHOLAR", "2024-10-26", "2024-10-26", "OD",
                "Hackathon at IIT Madras", "Approved",
                "[{\"role\":\"PARENT\",\"approverId\":\"" + lindaId + "\",\"approverName\":\"Linda Smith\",\"timestamp\":\"2024-10-22T11:00:00Z\",\"approved\":true},{\"role\":\"FACULTY\",\"approverId\":\"" + facultyId + "\",\"approverName\":\"Dr. Sarah Smith\",\"timestamp\":\"2024-10-22T14:00:00Z\",\"approved\":true}]",
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

    // ════════════════════════════════════════════════════════════════
    // Seed Departments
    // ════════════════════════════════════════════════════════════════
    private void seedDepartments() {
        if (departmentRepository.count() > 0) return;
        
        createDept("DEP-CS101", "Computer Science", idMap.get("hod_emily"));
        createDept("DEP-IT102", "Information Technology", null);
        createDept("DEP-ECE03", "Electronics", null);
        createDept("DEP-MECH4", "Mechanical", null);
    }
    
    private void createDept(String id, String name, String hod) {
        Department d = new Department();
        d.setDepartmentId(id);
        d.setDepartmentName(name);
        d.setHodId(hod);
        d.setCreatedAt("2024-10-01T10:00:00Z");
        departmentRepository.save(d);
    }

    // ════════════════════════════════════════════════════════════════
    // Seed Messages
    // ════════════════════════════════════════════════════════════════
    private void seedMessages() {
        if (messageRepository.count() > 0) return;
        
        String wardenId = idMap.get("warden_david");
        String parentId = idMap.get("parent_robert");
        if (wardenId != null && parentId != null) {
            Message msg = new Message();
            msg.setId("msg_sys_1");
            msg.setFromId("SYSTEM");
            msg.setFromName("System Broadcast");
            msg.setToId(wardenId);
            msg.setToName("Mr. David Miller");
            msg.setContent("Emergency mock drill scheduled for Hostels A and B at 4:00 PM tomorrow. Please ensure all students are informed and prepared.");
            msg.setTimestamp("2024-10-25T08:30:00Z");
            messageRepository.save(msg);
            
            Message msg2 = new Message();
            msg2.setId("msg_sys_2");
            msg2.setFromId("SYSTEM");
            msg2.setFromName("College Administration");
            msg2.setToId(parentId);
            msg2.setToName("Robert Johnson");
            msg2.setContent("Dear Parent, the upcoming semester examinations will begin on Dec 1st. The schedule has been mailed to your registered email.");
            msg2.setTimestamp("2024-10-24T14:15:00Z");
            messageRepository.save(msg2);
        }
    }
}
