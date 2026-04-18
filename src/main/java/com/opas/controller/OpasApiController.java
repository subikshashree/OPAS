package com.opas.controller;

import com.opas.model.User;
import com.opas.model.Role;
import com.opas.model.OpasLeave;
import com.opas.model.Department;
import com.opas.model.Message;
import com.opas.repository.UserRepository;
import com.opas.repository.OpasLeaveRepository;
import com.opas.repository.DepartmentRepository;
import com.opas.repository.MessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Open API Controller for OPAS React Frontend Integration.
 * These endpoints are whitelisted in SecurityConfig so the React
 * frontend can call them without JWT authentication.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/opas")
public class OpasApiController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    OpasLeaveRepository opasLeaveRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    MessageRepository messageRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ── LOGIN / REGISTER via Email ──────────────────────────────────
    /**
     * POST /api/opas/auth/login
     * Body: { "email": "...", "name": "...", "avatar": "..." }
     * 
     * If user with this email exists → return their full record.
     * If not → auto-register them as STUDENT and return.
     */
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> loginOrRegister(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").trim().toLowerCase();
        String nameHint = body.getOrDefault("name", "");
        String avatarHint = body.getOrDefault("avatar", "");

        if (email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            return ResponseEntity.ok(userToMap(existingUser.get()));
        }

        // Auto-register as new STUDENT
        User newUser = new User();
        String numericId = String.valueOf(100000 + new Random().nextInt(900000));
        newUser.setId(null); // Let DB auto-generate the Long id
        newUser.setUsername(email); // Use email as username
        newUser.setEmail(email);
        newUser.setPassword("$2a$10$dummy"); // BCrypt placeholder (not used for Google auth)
        newUser.setRole(Role.STUDENT);
        newUser.setName(nameHint.isEmpty() ? email.split("@")[0] : nameHint);
        newUser.setAvatar(avatarHint.isEmpty()
            ? "https://ui-avatars.com/api/?name=" + nameHint + "&background=random"
            : avatarHint);
        newUser.setDepartment("Computer Science");
        newUser.setStatus("ACTIVE");
        newUser.setStudentId(numericId);

        User saved = userRepository.save(newUser);
        return ResponseEntity.ok(userToMap(saved));
    }

    // ── GET ALL USERS (for Admin Directory) ─────────────────────────
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> all = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : all) {
            result.add(userToMap(u));
        }
        return ResponseEntity.ok(result);
    }

    // ── GET USER BY ID ──────────────────────────────────────────────
    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(userToMap(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    // ── GET USER BY EMAIL ───────────────────────────────────────────
    @GetMapping("/users/email/{email}")
    public ResponseEntity<Map<String, Object>> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user.isPresent()) {
            return ResponseEntity.ok(userToMap(user.get()));
        }
        return ResponseEntity.notFound().build();
    }

    // ── UPDATE USER (Admin role changes, relationship assignment) ───
    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = opt.get();

        // Update fields that are present in the body
        if (body.containsKey("name")) user.setName((String) body.get("name"));
        if (body.containsKey("role")) user.setRole(Role.valueOf((String) body.get("role")));
        if (body.containsKey("department")) user.setDepartment((String) body.get("department"));
        if (body.containsKey("phone")) user.setPhone((String) body.get("phone"));
        if (body.containsKey("avatar")) user.setAvatar((String) body.get("avatar"));
        if (body.containsKey("status")) user.setStatus((String) body.get("status"));
        if (body.containsKey("mentorId")) user.setMentorId((String) body.get("mentorId"));
        if (body.containsKey("parentId")) user.setParentId((String) body.get("parentId"));
        if (body.containsKey("wardenId")) user.setWardenId((String) body.get("wardenId"));
        if (body.containsKey("wardId")) user.setWardId((String) body.get("wardId"));
        if (body.containsKey("menteeIds")) user.setMenteeIds((String) body.get("menteeIds"));
        if (body.containsKey("isHosteler")) user.setIsHosteler((Boolean) body.get("isHosteler"));
        if (body.containsKey("residentialType")) user.setResidentialType((String) body.get("residentialType"));
        if (body.containsKey("roomNumber")) user.setRoomNumber((String) body.get("roomNumber"));
        if (body.containsKey("hostelBlock")) user.setHostelBlock((String) body.get("hostelBlock"));
        if (body.containsKey("busNumber")) user.setBusNumber((String) body.get("busNumber"));
        if (body.containsKey("hostelName")) user.setHostelName((String) body.get("hostelName"));

        User saved = userRepository.save(user);
        return ResponseEntity.ok(userToMap(saved));
    }

    // ══════════════════════════════════════════════════════════════════
    // ── LEAVE ENDPOINTS (full CRUD for React frontend) ─────────────
    // ══════════════════════════════════════════════════════════════════

    /**
     * GET /api/opas/leaves — Return all leaves as flat JSON matching frontend schema.
     */
    @GetMapping("/leaves")
    public ResponseEntity<List<Map<String, Object>>> getAllLeaves() {
        List<OpasLeave> all = opasLeaveRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        for (OpasLeave leave : all) {
            result.add(leaveToMap(leave));
        }
        return ResponseEntity.ok(result);
    }

    /**
     * POST /api/opas/leaves — Create a new leave request.
     */
    @PostMapping("/leaves")
    public ResponseEntity<Map<String, Object>> createLeave(@RequestBody Map<String, Object> body) {
        OpasLeave leave = new OpasLeave();
        leave.setId((String) body.getOrDefault("id", "leave_" + System.currentTimeMillis()));
        leave.setUserId(String.valueOf(body.getOrDefault("userId", "")));
        leave.setStudentId(String.valueOf(body.getOrDefault("studentId", "")));
        leave.setStudentName((String) body.getOrDefault("studentName", ""));
        leave.setStudentDepartment((String) body.getOrDefault("studentDepartment", ""));
        leave.setResidentialType((String) body.getOrDefault("residentialType", ""));
        leave.setStartDate((String) body.getOrDefault("startDate", ""));
        leave.setStartTime((String) body.getOrDefault("startTime", ""));
        leave.setEndDate((String) body.getOrDefault("endDate", ""));
        leave.setEndTime((String) body.getOrDefault("endTime", ""));
        leave.setType((String) body.getOrDefault("type", "NORMAL"));
        leave.setReason((String) body.getOrDefault("reason", ""));
        leave.setStatus((String) body.getOrDefault("status", "Pending"));
        leave.setMentorId(body.get("mentorId") != null ? String.valueOf(body.get("mentorId")) : null);
        leave.setParentId(body.get("parentId") != null ? String.valueOf(body.get("parentId")) : null);
        leave.setWardenId(body.get("wardenId") != null ? String.valueOf(body.get("wardenId")) : null);
        leave.setIsHosteler(body.get("isHosteler") instanceof Boolean ? (Boolean) body.get("isHosteler") : false);
        leave.setAppliedAt((String) body.getOrDefault("appliedAt", new java.util.Date().toString()));

        // Convert approvals array to JSON string
        Object approvals = body.get("approvals");
        if (approvals != null) {
            try {
                leave.setApprovalsJson(objectMapper.writeValueAsString(approvals));
            } catch (Exception e) {
                leave.setApprovalsJson("[]");
            }
        } else {
            leave.setApprovalsJson("[]");
        }

        OpasLeave saved = opasLeaveRepository.save(leave);
        return ResponseEntity.ok(leaveToMap(saved));
    }

    /**
     * PUT /api/opas/leaves/{id} — Update leave status and approvals.
     */
    @PutMapping("/leaves/{id}")
    public ResponseEntity<Map<String, Object>> updateLeave(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        Optional<OpasLeave> opt = opasLeaveRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        OpasLeave leave = opt.get();

        if (body.containsKey("status")) leave.setStatus((String) body.get("status"));
        if (body.containsKey("reason")) leave.setReason((String) body.get("reason"));

        if (body.containsKey("approvals")) {
            try {
                leave.setApprovalsJson(objectMapper.writeValueAsString(body.get("approvals")));
            } catch (Exception e) { /* keep existing */ }
        }

        OpasLeave saved = opasLeaveRepository.save(leave);
        return ResponseEntity.ok(leaveToMap(saved));
    }

    /**
     * DELETE /api/opas/leaves/{id}
     */
    @DeleteMapping("/leaves/{id}")
    public ResponseEntity<Void> deleteLeave(@PathVariable String id) {
        Optional<OpasLeave> opt = opasLeaveRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        opasLeaveRepository.delete(opt.get());
        return ResponseEntity.ok().build();
    }

    // ══════════════════════════════════════════════════════════════════
    // ── DEPARTMENT ENDPOINTS
    // ══════════════════════════════════════════════════════════════════

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(@RequestBody Department incoming) {
        if (incoming.getDepartmentId() == null || incoming.getDepartmentId().isEmpty()) {
            incoming.setDepartmentId("DEP-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase());
        }
        if (incoming.getCreatedAt() == null || incoming.getCreatedAt().isEmpty()) {
            incoming.setCreatedAt(java.time.Instant.now().toString());
        }
        Department saved = departmentRepository.save(incoming);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable String id, @RequestBody Department incoming) {
        Optional<Department> opt = departmentRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        Department existing = opt.get();
        if (incoming.getDepartmentName() != null) existing.setDepartmentName(incoming.getDepartmentName());
        if (incoming.getHodId() != null) existing.setHodId(incoming.getHodId());
        
        return ResponseEntity.ok(departmentRepository.save(existing));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable String id) {
        if (!departmentRepository.existsById(id)) return ResponseEntity.notFound().build();
        departmentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ══════════════════════════════════════════════════════════════════
    // ── MESSAGE ENDPOINTS
    // ══════════════════════════════════════════════════════════════════

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages(
            @RequestParam(required = false) String toId,
            @RequestParam(required = false) String fromId) {
        if (toId != null) {
            return ResponseEntity.ok(messageRepository.findByToId(toId));
        } else if (fromId != null) {
            return ResponseEntity.ok(messageRepository.findByFromId(fromId));
        }
        return ResponseEntity.ok(messageRepository.findAll());
    }

    @PostMapping("/messages")
    public ResponseEntity<Message> createMessage(@RequestBody Message msg) {
        if (msg.getId() == null || msg.getId().isEmpty()) {
            msg.setId("msg_" + System.currentTimeMillis());
        }
        if (msg.getTimestamp() == null || msg.getTimestamp().isEmpty()) {
            msg.setTimestamp(java.time.Instant.now().toString());
        }
        Message saved = messageRepository.save(msg);
        return ResponseEntity.ok(saved);
    }

    // ── HELPER: Convert OpasLeave to frontend-compatible Map ──
    private Map<String, Object> leaveToMap(OpasLeave leave) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", leave.getId());
        m.put("userId", leave.getUserId());
        m.put("studentId", leave.getStudentId());
        m.put("studentName", leave.getStudentName());
        m.put("studentDepartment", leave.getStudentDepartment());
        m.put("residentialType", leave.getResidentialType());
        m.put("startDate", leave.getStartDate());
        m.put("startTime", leave.getStartTime());
        m.put("endDate", leave.getEndDate());
        m.put("endTime", leave.getEndTime());
        m.put("type", leave.getType());
        m.put("reason", leave.getReason());
        m.put("status", leave.getStatus());
        m.put("mentorId", leave.getMentorId());
        m.put("parentId", leave.getParentId());
        m.put("wardenId", leave.getWardenId());
        m.put("isHosteler", leave.getIsHosteler());
        m.put("appliedAt", leave.getAppliedAt());

        // Parse approvals JSON back to array
        try {
            if (leave.getApprovalsJson() != null && !leave.getApprovalsJson().isEmpty()) {
                List<Map<String, Object>> approvals = objectMapper.readValue(
                    leave.getApprovalsJson(), new TypeReference<List<Map<String, Object>>>() {});
                m.put("approvals", approvals);
            } else {
                m.put("approvals", List.of());
            }
        } catch (Exception e) {
            m.put("approvals", List.of());
        }

        return m;
    }

    // ── HELPER: Convert JPA User entity to a flat Map matching React frontend schema ──
    private Map<String, Object> userToMap(User user) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", String.valueOf(user.getId()));
        m.put("name", user.getName() != null ? user.getName() : user.getUsername());
        m.put("email", user.getEmail());
        
        // Map the single Role enum to the frontend's roles[] array
        String roleName = user.getRole() != null ? user.getRole().name() : "STUDENT";
        // Frontend uses FACULTY for both FACULTY and MENTOR
        if (roleName.equals("MENTOR")) roleName = "FACULTY";
        m.put("roles", List.of(roleName));
        
        m.put("avatar", user.getAvatar());
        m.put("permissions", List.of()); // Permissions are computed on frontend
        m.put("status", user.getStatus() != null ? user.getStatus() : "ACTIVE");
        m.put("phone", user.getPhone());
        m.put("studentId", user.getStudentId());
        m.put("isHosteler", user.isIsHosteler());
        m.put("residentialType", user.getResidentialType());
        m.put("roomNumber", user.getRoomNumber());
        m.put("hostelBlock", user.getHostelBlock());
        m.put("busNumber", user.getBusNumber());
        m.put("department", user.getDepartment());
        m.put("mentorId", user.getMentorId());
        m.put("parentId", user.getParentId());
        m.put("wardenId", user.getWardenId());
        m.put("wardId", user.getWardId());
        m.put("hostelName", user.getHostelName());
        
        // menteeIds stored as comma-separated string; convert to array
        String menteeIdsStr = user.getMenteeIds();
        if (menteeIdsStr != null && !menteeIdsStr.isEmpty()) {
            m.put("menteeIds", Arrays.asList(menteeIdsStr.split(",")));
        } else {
            m.put("menteeIds", List.of());
        }
        
        return m;
    }
}
