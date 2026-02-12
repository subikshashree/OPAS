
export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
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

export interface User {
  id: string;
  name: string;
  roles: UserRole[]; // Support for multiple roles
  email: string;
  avatar?: string;
  permissions: Permission[]; // User-level permission overrides
  status: 'ACTIVE' | 'INACTIVE';
  studentId?: string;
  isHosteler?: boolean;
}

export interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'OD';
  studentId: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  type: 'REGULAR' | 'SICK' | 'OD';
  reason: string;
  status: 'PENDING' | 'PARENT_APPROVED' | 'MENTOR_APPROVED' | 'WARDEN_APPROVED' | 'HOD_APPROVED' | 'FINAL_APPROVED' | 'REJECTED';
  approvals: {
    role: UserRole;
    timestamp: string;
    approved: boolean;
    comment?: string;
  }[];
}

export interface AcademicRecord {
  semester: number;
  sgpa: number;
  cgpa: number;
}
