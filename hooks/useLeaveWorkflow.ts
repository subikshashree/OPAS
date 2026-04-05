import { LeaveType, LeaveStatus, UserRole } from '../types';

/**
 * Antigravity Leave Workflow Engine
 * 
 * Rules:
 *  - SICK Leave (max 8 hrs): Warden only (Hostel students only)
 *  - SPECIAL_PERMISSION: Parent → Warden (if Hostel) → Mentor
 *  - OD: Parent → Warden (if Hostel) → Mentor → HoD
 * 
 * Dayscholar students skip the Warden step entirely.
 */

export function getLeaveWorkflow(type: LeaveType, isHosteler: boolean): UserRole[] {
  switch (type) {
    case 'SICK':
      // Sick leave only applies to hostel students, approved by warden only
      return isHosteler ? [UserRole.WARDEN] : [];
      
    case 'NORMAL':
    case 'SPECIAL_PERMISSION':
      return isHosteler
        ? [UserRole.PARENT, UserRole.WARDEN, UserRole.FACULTY]
        : [UserRole.PARENT, UserRole.FACULTY];
      
    case 'OD':
      return isHosteler
        ? [UserRole.PARENT, UserRole.WARDEN, UserRole.FACULTY, UserRole.HOD]
        : [UserRole.PARENT, UserRole.FACULTY, UserRole.HOD];
      
    default:
      return [];
  }
}

export function getNextPendingStatus(type: LeaveType, isHosteler: boolean, currentApprovalCount: number): LeaveStatus {
  const workflow = getLeaveWorkflow(type, isHosteler);
  
  if (currentApprovalCount >= workflow.length) return 'APPROVED';
  
  const nextRole = workflow[currentApprovalCount];
  switch (nextRole) {
    case UserRole.PARENT: return 'PENDING_PARENT';
    case UserRole.WARDEN: return 'PENDING_WARDEN';
    case UserRole.FACULTY: return 'PENDING_MENTOR';
    case UserRole.HOD: return 'PENDING_HOD';
    default: return 'APPROVED';
  }
}

export function canUserApprove(userRole: UserRole, leaveStatus: LeaveStatus): boolean {
  switch (leaveStatus) {
    case 'PENDING_PARENT': return userRole === UserRole.PARENT;
    case 'PENDING_WARDEN': return userRole === UserRole.WARDEN;
    case 'PENDING_MENTOR': return userRole === UserRole.FACULTY;
    case 'PENDING_HOD': return userRole === UserRole.HOD;
    default: return false;
  }
}

export function getWorkflowSteps(type: LeaveType, isHosteler: boolean) {
  const roles = getLeaveWorkflow(type, isHosteler);
  return roles.map(role => {
    switch (role) {
      case UserRole.PARENT: return { role, label: 'Parent', statusKey: 'PENDING_PARENT' as LeaveStatus };
      case UserRole.WARDEN: return { role, label: 'Warden', statusKey: 'PENDING_WARDEN' as LeaveStatus };
      case UserRole.FACULTY: return { role, label: 'Mentor', statusKey: 'PENDING_MENTOR' as LeaveStatus };
      case UserRole.HOD: return { role, label: 'HoD', statusKey: 'PENDING_HOD' as LeaveStatus };
      default: return { role, label: String(role), statusKey: 'APPROVED' as LeaveStatus };
    }
  });
}
