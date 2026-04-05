
export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',   // Also used as MENTOR
  PARENT = 'PARENT',
  WARDEN = 'WARDEN',
  HOD = 'HOD',
  ADMIN = 'ADMIN'
}

export type Permission = 
  | 'VIEW_ACADEMICS' 
  | 'MARK_ATTENDANCE' 
  | 'APPROVE_LEAVE' 
  | 'MANAGE_USERS' 
  | 'VIEW_SYSTEM_LOGS' 
  | 'SUBMIT_REQUESTS';

export type ResidentialType = 'HOSTEL' | 'DAYSCHOLAR';

export type LeaveType = 'SICK' | 'SPECIAL_PERMISSION' | 'OD' | 'NORMAL';

export type LeaveStatus = 
  | 'PENDING_PARENT' 
  | 'PENDING_WARDEN' 
  | 'PENDING_MENTOR' 
  | 'PENDING_HOD' 
  | 'APPROVED' 
  | 'REJECTED';

export type TaskStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE';

export interface User {
  id: string;
  name: string;
  roles: UserRole[];
  email: string;
  avatar?: string;
  permissions: Permission[];
  status: 'ACTIVE' | 'INACTIVE';
  phone?: string;
  // Student-specific
  studentId?: string;
  isHosteler?: boolean;
  residentialType?: ResidentialType;
  roomNumber?: string;      // required if HOSTEL
  hostelBlock?: string;      // place/block for hostel
  busNumber?: string;        // required if DAYSCHOLAR
  department?: string;
  mentorId?: string;
  parentId?: string;
  // Mentor (FACULTY) specific
  menteeIds?: string[];
  // Parent specific
  wardId?: string;
  // Warden specific
  hostelName?: string;
}

export interface StudentProfile {
  userId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    department: string;
    mentorName: string;
    parentName: string;
    parentPhone: string;
    residentialType: ResidentialType;
    roomNumber?: string;
    hostelBlock?: string;
    busNumber?: string;
  };
  attendance: AttendanceSummary;
  placement: PlacementInfo;
  tasks: Task[];
  academics: AcademicRecord[];
}

export interface AttendanceSummary {
  overallPercentage: number;
  totalWorkingDays: number;
  daysPresent: number;
  daysAbsent: number;
  records: AttendanceRecord[];
}

export interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'OD';
  subject?: string;
  studentId: string;
}

export interface PlacementInfo {
  companiesAttended: number;
  placedCompany?: string;
  upcomingCompanies: { name: string; date: string; role: string }[];
  improvementAreas: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedByName: string;
  assignedTo: string;
  deadline: string;
  status: TaskStatus;
  submittedAt?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentDepartment?: string;
  residentialType: ResidentialType;
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  approvals: LeaveApproval[];
}

export interface LeaveApproval {
  role: UserRole;
  approverId: string;
  approverName: string;
  timestamp: string;
  approved: boolean;
  comment?: string;
}

export interface AcademicRecord {
  semester: number;
  sgpa: number;
  cgpa: number;
}

export interface Department {
  department_id: string;
  department_name: string;
  hod_id: string;
  created_at: string;
}

export interface DepartmentStats {
  name: string;
  totalStudents: number;
  totalFaculty: number;
  avgAttendance: number;
  avgCgpa: number;
  placementRate: number;
}

export interface MentorAnalysis {
  menteeId: string;
  menteeName: string;
  attendance: number;
  cgpa: number;
  pendingTasks: number;
  completedTasks: number;
  complaints: string[];
}

export interface HostelStudent {
  studentId: string;
  name: string;
  department: string;
  roomNumber: string;
  block: string;
  phone: string;
  avatar: string;
}
