import React from 'react';
import { UserRole, User, Permission, LeaveRequest, Task, AttendanceRecord, StudentProfile, HostelStudent, DepartmentStats, MentorAnalysis } from './types';

// ─── Permission Matrix ─────────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: ['VIEW_ACADEMICS', 'SUBMIT_REQUESTS'],
  [UserRole.FACULTY]: ['MARK_ATTENDANCE', 'APPROVE_LEAVE', 'VIEW_ACADEMICS'],
  [UserRole.PARENT]: ['VIEW_ACADEMICS', 'APPROVE_LEAVE'],
  [UserRole.WARDEN]: ['APPROVE_LEAVE'],
  [UserRole.HOD]: ['APPROVE_LEAVE', 'VIEW_ACADEMICS', 'MARK_ATTENDANCE'],
  [UserRole.ADMIN]: ['MANAGE_USERS', 'VIEW_SYSTEM_LOGS', 'APPROVE_LEAVE', 'MARK_ATTENDANCE'],
};

// ─── Mock Users ─────────────────────────────────────────────────────
export const MOCK_USERS_LIST: User[] = [
  {
    id: '1001', name: 'Alex Johnson', roles: [UserRole.STUDENT],
    email: 'alex.j@college.edu', studentId: 'CS2024001',
    isHosteler: true, residentialType: 'HOSTEL',
    roomNumber: 'B-312', hostelBlock: 'Block B',
    department: 'Computer Science', mentorId: '3001', parentId: '2001',
    phone: '+91 98765 43210',
    avatar: 'https://picsum.photos/seed/alex/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.STUDENT], status: 'ACTIVE'
  },
  {
    id: '1002', name: 'Brittany Smith', roles: [UserRole.STUDENT],
    email: 'britt.s@college.edu', studentId: 'CS2024002',
    isHosteler: false, residentialType: 'DAYSCHOLAR',
    busNumber: 'Route 7A', department: 'Computer Science',
    mentorId: '3001', parentId: '2002', phone: '+91 98765 43211',
    avatar: 'https://picsum.photos/seed/brittany/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.STUDENT], status: 'ACTIVE'
  },
  {
    id: '1003', name: 'Carlos Diaz', roles: [UserRole.STUDENT],
    email: 'carlos.d@college.edu', studentId: 'CS2024003',
    isHosteler: true, residentialType: 'HOSTEL',
    roomNumber: 'A-105', hostelBlock: 'Block A',
    department: 'Computer Science', mentorId: '3001', parentId: '2003',
    phone: '+91 98765 43212',
    avatar: 'https://picsum.photos/seed/carlos/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.STUDENT], status: 'ACTIVE'
  },
  {
    id: '1004', name: 'David Wilson', roles: [UserRole.STUDENT],
    email: 'david.w@college.edu', studentId: 'CS2024004',
    isHosteler: true, residentialType: 'HOSTEL',
    roomNumber: 'B-210', hostelBlock: 'Block B',
    department: 'Computer Science', mentorId: '3001', parentId: '2004',
    phone: '+91 98765 43213',
    avatar: 'https://picsum.photos/seed/david_w/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.STUDENT], status: 'ACTIVE'
  },
  {
    id: '3001', name: 'Dr. Sarah Smith', roles: [UserRole.FACULTY],
    email: 's.smith@college.edu', department: 'Computer Science',
    menteeIds: ['1001', '1002', '1003', '1004'], phone: '+91 90000 10001',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.FACULTY], status: 'ACTIVE'
  },
  {
    id: '2001', name: 'Robert Johnson', roles: [UserRole.PARENT],
    email: 'robert.j@gmail.com', wardId: '1001', phone: '+91 80000 10001',
    avatar: 'https://picsum.photos/seed/robert/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.PARENT], status: 'ACTIVE'
  },
  {
    id: '2002', name: 'Linda Smith', roles: [UserRole.PARENT],
    email: 'linda.s@gmail.com', wardId: '1002', phone: '+91 80000 10002',
    avatar: 'https://picsum.photos/seed/linda/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.PARENT], status: 'ACTIVE'
  },
  {
    id: '2003', name: 'Maria Diaz', roles: [UserRole.PARENT],
    email: 'maria.d@gmail.com', wardId: '1003', phone: '+91 80000 10003',
    avatar: 'https://picsum.photos/seed/maria/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.PARENT], status: 'ACTIVE'
  },
  {
    id: '2004', name: 'James Wilson', roles: [UserRole.PARENT],
    email: 'james.w@gmail.com', wardId: '1004', phone: '+91 80000 10004',
    avatar: 'https://picsum.photos/seed/james/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.PARENT], status: 'ACTIVE'
  },
  {
    id: '4001', name: 'Mr. David Miller', roles: [UserRole.WARDEN],
    email: 'd.miller@college.edu', hostelName: 'Boys Hostel - Block A & B',
    phone: '+91 90000 20001',
    avatar: 'https://picsum.photos/seed/warden_david/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.WARDEN], status: 'ACTIVE'
  },
  {
    id: '5001', name: 'Dr. Emily Chen', roles: [UserRole.HOD, UserRole.FACULTY],
    email: 'e.chen@college.edu', department: 'Computer Science',
    phone: '+91 90000 30001',
    avatar: 'https://picsum.photos/seed/emily/100/100',
    permissions: [...ROLE_PERMISSIONS[UserRole.HOD], ...ROLE_PERMISSIONS[UserRole.FACULTY]],
    status: 'ACTIVE'
  },
  {
    id: '9001', name: 'System Administrator', roles: [UserRole.ADMIN],
    email: 'admin@college.edu', phone: '+91 90000 99999',
    avatar: 'https://picsum.photos/seed/admin/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.ADMIN], status: 'ACTIVE'
  }
];

// ─── Academic Data ──────────────────────────────────────────────────
export const MOCK_ACADEMIC_DATA = [
  { semester: 1, sgpa: 8.5, cgpa: 8.5 },
  { semester: 2, sgpa: 8.2, cgpa: 8.35 },
  { semester: 3, sgpa: 8.9, cgpa: 8.53 },
  { semester: 4, sgpa: 9.1, cgpa: 8.67 },
];

// ─── Attendance Records ─────────────────────────────────────────────
const generateAttendance = (studentId: string): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const subjects = ['Operating Systems', 'Data Structures', 'DBMS', 'Networks', 'Maths'];
  for (let d = 1; d <= 25; d++) {
    const status = Math.random() > 0.15 ? 'PRESENT' : (Math.random() > 0.5 ? 'ABSENT' : 'OD');
    records.push({
      date: `2024-10-${String(d).padStart(2, '0')}`,
      status: status as any,
      subject: subjects[d % subjects.length],
      studentId,
    });
  }
  return records;
};

export const MOCK_ATTENDANCE: Record<string, AttendanceRecord[]> = {
  '1001': generateAttendance('1001'),
  '1002': generateAttendance('1002'),
  '1003': generateAttendance('1003'),
  '1004': generateAttendance('1004'),
};

// ─── Tasks ──────────────────────────────────────────────────────────
export const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'DSA Assignment - Graphs', description: 'Solve 10 problems on BFS/DFS', assignedBy: '3001', assignedByName: 'Dr. Sarah Smith', assignedTo: '1001', deadline: '2026-11-01', status: 'PENDING' },
  { id: 't2', title: 'DBMS Mini Project', description: 'Design ER diagram for Hospital DB', assignedBy: '3001', assignedByName: 'Dr. Sarah Smith', assignedTo: '1001', deadline: '2026-10-28', status: 'COMPLETED', submittedAt: '2026-10-26' },
  { id: 't3', title: 'OS Lab Record', description: 'Complete lab records up to Exp 8', assignedBy: '3001', assignedByName: 'Dr. Sarah Smith', assignedTo: '1001', deadline: '2026-04-01', status: 'OVERDUE' },
  { id: 't4', title: 'Research Paper Review', description: 'Review IEEE paper on ML algorithms', assignedBy: '3001', assignedByName: 'Dr. Sarah Smith', assignedTo: '1002', deadline: '2026-11-05', status: 'PENDING' },
  { id: 't5', title: 'Seminar Presentation', description: 'Prepare PPT on Cloud Computing', assignedBy: '3001', assignedByName: 'Dr. Sarah Smith', assignedTo: '1003', deadline: '2026-11-10', status: 'PENDING' },
  { id: 't6', title: 'Coding Contest Prep', description: 'Solve 20 leetcode problems', assignedBy: '3001', assignedByName: 'Dr. Sarah Smith', assignedTo: '1004', deadline: '2026-10-30', status: 'COMPLETED', submittedAt: '2026-10-29' },
];

// ─── Placement Data ─────────────────────────────────────────────────
export const MOCK_PLACEMENT: Record<string, { companiesAttended: number; placedCompany?: string; upcomingCompanies: { name: string; date: string; role: string }[]; improvementAreas: string[] }> = {
  '1001': {
    companiesAttended: 5,
    upcomingCompanies: [
      { name: 'Google', date: '2026-11-15', role: 'SDE Intern' },
      { name: 'Microsoft', date: '2026-11-20', role: 'SWE Intern' },
      { name: 'Amazon', date: '2026-12-01', role: 'SDE-1' },
    ],
    improvementAreas: ['System Design', 'SQL Optimization', 'Communication Skills'],
  },
  '1002': {
    companiesAttended: 3, placedCompany: 'Infosys',
    upcomingCompanies: [{ name: 'TCS', date: '2026-11-18', role: 'Developer' }],
    improvementAreas: ['DSA Practice', 'Problem Solving Speed'],
  },
  '1003': {
    companiesAttended: 2,
    upcomingCompanies: [
      { name: 'Wipro', date: '2024-11-12', role: 'Graduate Trainee' },
      { name: 'Cognizant', date: '2024-11-25', role: 'Full Stack Dev' },
    ],
    improvementAreas: ['Aptitude', 'Group Discussion', 'Core Java'],
  },
  '1004': {
    companiesAttended: 4,
    upcomingCompanies: [{ name: 'Zoho', date: '2024-11-22', role: 'Member Technical Staff' }],
    improvementAreas: ['Advanced DSA', 'Operating Systems'],
  },
};

// ─── Leave Requests ─────────────────────────────────────────────────
export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr1', studentId: '1001', studentName: 'Alex Johnson', studentDepartment: 'Computer Science',
    residentialType: 'HOSTEL', startDate: '2024-10-25', endDate: '2024-10-25',
    type: 'SICK', reason: 'Fever and body ache',
    status: 'PENDING_WARDEN', createdAt: '2024-10-25T08:00:00Z', approvals: [],
  },
  {
    id: 'lr2', studentId: '1003', studentName: 'Carlos Diaz', studentDepartment: 'Computer Science',
    residentialType: 'HOSTEL', startDate: '2024-10-28', endDate: '2024-10-29',
    type: 'SPECIAL_PERMISSION', reason: 'Family function - Sister wedding',
    status: 'PENDING_PARENT', createdAt: '2024-10-24T10:00:00Z', approvals: [],
  },
  {
    id: 'lr3', studentId: '1004', studentName: 'David Wilson', studentDepartment: 'Computer Science',
    residentialType: 'HOSTEL', startDate: '2024-10-30', endDate: '2024-10-30',
    type: 'OD', reason: 'Inter-college Technical Symposium Paper Presentation',
    status: 'PENDING_PARENT', createdAt: '2024-10-23T09:00:00Z', approvals: [],
  },
  {
    id: 'lr4', studentId: '1001', studentName: 'Alex Johnson', studentDepartment: 'Computer Science',
    residentialType: 'HOSTEL', startDate: '2024-10-20', endDate: '2024-10-21',
    type: 'SPECIAL_PERMISSION', reason: 'Medical checkup at hometown hospital',
    status: 'PENDING_MENTOR', createdAt: '2024-10-18T07:00:00Z',
    approvals: [
      { role: UserRole.PARENT, approverId: '2001', approverName: 'Robert Johnson', timestamp: '2024-10-18T08:30:00Z', approved: true },
      { role: UserRole.WARDEN, approverId: '4001', approverName: 'Mr. David Miller', timestamp: '2024-10-18T11:00:00Z', approved: true },
    ],
  },
  {
    id: 'lr5', studentId: '1002', studentName: 'Brittany Smith', studentDepartment: 'Computer Science',
    residentialType: 'DAYSCHOLAR', startDate: '2024-10-26', endDate: '2024-10-26',
    type: 'OD', reason: 'Hackathon at IIT Madras',
    status: 'PENDING_HOD', createdAt: '2024-10-22T10:00:00Z',
    approvals: [
      { role: UserRole.PARENT, approverId: '2002', approverName: 'Linda Smith', timestamp: '2024-10-22T11:00:00Z', approved: true },
      { role: UserRole.FACULTY, approverId: '3001', approverName: 'Dr. Sarah Smith', timestamp: '2024-10-22T14:00:00Z', approved: true },
    ],
  },
];

// ─── Hostel Students ────────────────────────────────────────────────
export const MOCK_HOSTEL_STUDENTS: HostelStudent[] = [
  { studentId: '1001', name: 'Alex Johnson', department: 'Computer Science', roomNumber: 'B-312', block: 'Block B', phone: '+91 98765 43210', avatar: 'https://picsum.photos/seed/alex/100/100' },
  { studentId: '1003', name: 'Carlos Diaz', department: 'Computer Science', roomNumber: 'A-105', block: 'Block A', phone: '+91 98765 43212', avatar: 'https://picsum.photos/seed/carlos/100/100' },
  { studentId: '1004', name: 'David Wilson', department: 'Computer Science', roomNumber: 'B-210', block: 'Block B', phone: '+91 98765 43213', avatar: 'https://picsum.photos/seed/david_w/100/100' },
];

// ─── Department Stats ───────────────────────────────────────────────
export const MOCK_DEPARTMENT_STATS: DepartmentStats[] = [
  { name: 'Computer Science', totalStudents: 120, totalFaculty: 15, avgAttendance: 87, avgCgpa: 8.2, placementRate: 72 },
  { name: 'Electronics', totalStudents: 90, totalFaculty: 12, avgAttendance: 82, avgCgpa: 7.8, placementRate: 65 },
  { name: 'Mechanical', totalStudents: 110, totalFaculty: 14, avgAttendance: 79, avgCgpa: 7.5, placementRate: 58 },
  { name: 'Civil', totalStudents: 80, totalFaculty: 10, avgAttendance: 84, avgCgpa: 7.9, placementRate: 55 },
];

export const MOCK_DEPARTMENTS: any[] = [
  { department_id: 'DEP-CS', department_name: 'Computer Science', hod_id: 'HOD001', created_at: '2020-05-12T10:00:00Z' },
  { department_id: 'DEP-EC', department_name: 'Electronics', hod_id: 'HOD002', created_at: '2020-05-12T10:00:00Z' },
  { department_id: 'DEP-ME', department_name: 'Mechanical', hod_id: 'HOD003', created_at: '2020-05-12T10:00:00Z' },
  { department_id: 'DEP-CV', department_name: 'Civil', hod_id: 'HOD004', created_at: '2020-05-12T10:00:00Z' },
];

// ─── Mentor Analysis ────────────────────────────────────────────────
export const MOCK_MENTOR_ANALYSIS: MentorAnalysis[] = [
  { menteeId: '1001', menteeName: 'Alex Johnson', attendance: 85, cgpa: 8.67, pendingTasks: 1, completedTasks: 1, complaints: ['Irregular sleep schedule'] },
  { menteeId: '1002', menteeName: 'Brittany Smith', attendance: 92, cgpa: 8.1, pendingTasks: 1, completedTasks: 0, complaints: [] },
  { menteeId: '1003', menteeName: 'Carlos Diaz', attendance: 71, cgpa: 7.4, pendingTasks: 1, completedTasks: 0, complaints: ['Low attendance', 'Missed 2 internal exams'] },
  { menteeId: '1004', menteeName: 'David Wilson', attendance: 88, cgpa: 8.3, pendingTasks: 0, completedTasks: 1, complaints: [] },
];

// ─── Navigation Items ───────────────────────────────────────────────
export const NAV_ITEMS = {
  [UserRole.STUDENT]: [
    { label: 'Dashboard', icon: '📊', path: '/' },
    { label: 'Leave / OD', icon: '📝', path: '/leave' },
    { label: 'Profile', icon: '👤', path: '/profile' },
  ],
  [UserRole.FACULTY]: [
    { label: 'Dashboard', icon: '📊', path: '/' },
    { label: 'Mentees', icon: '👥', path: '/mentees' },
    { label: 'Tasks', icon: '📋', path: '/tasks' },
    { label: 'Leave Queue', icon: '⏳', path: '/approvals' },
  ],
  [UserRole.PARENT]: [
    { label: 'Ward Info', icon: '👁️', path: '/' },
    { label: 'Attendance', icon: '📅', path: '/ward-attendance' },
    { label: 'Placements', icon: '🏢', path: '/ward-placement' },
    { label: 'Leave Auth', icon: '⏳', path: '/approvals' },
  ],
  [UserRole.WARDEN]: [
    { label: 'Overview', icon: '🏠', path: '/' },
    { label: 'Students', icon: '👥', path: '/hostel-students' },
    { label: 'Leave Queue', icon: '🚪', path: '/approvals' },
  ],
  [UserRole.HOD]: [
    { label: 'Department', icon: '🏢', path: '/' },
    { label: 'Students', icon: '🎓', path: '/dept-students' },
    { label: 'Faculty', icon: '👨‍🏫', path: '/dept-faculty' },
    { label: 'OD Queue', icon: '⏳', path: '/approvals' },
  ],
  [UserRole.ADMIN]: [
    { label: 'Console', icon: '⚙️', path: '/' },
    { label: 'Users', icon: '👥', path: '/users' },
    { label: 'Departments', icon: '🏢', path: '/departments' },
  ],
};
