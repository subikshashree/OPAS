
import React from 'react';
import { UserRole, User, Permission } from './types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.STUDENT]: ['VIEW_ACADEMICS', 'SUBMIT_REQUESTS'],
  [UserRole.FACULTY]: ['MARK_ATTENDANCE', 'APPROVE_LEAVE', 'VIEW_ACADEMICS'],
  [UserRole.PARENT]: ['VIEW_ACADEMICS', 'APPROVE_LEAVE'],
  [UserRole.WARDEN]: ['APPROVE_LEAVE'],
  [UserRole.HOD]: ['APPROVE_LEAVE', 'VIEW_ACADEMICS'],
  [UserRole.ADMIN]: ['MANAGE_USERS', 'VIEW_SYSTEM_LOGS', 'APPROVE_LEAVE', 'MARK_ATTENDANCE'],
};

export const MOCK_USERS_LIST: User[] = [
  {
    id: 's1',
    name: 'Alex Johnson',
    roles: [UserRole.STUDENT],
    email: 'alex.j@college.edu',
    studentId: 'CS2024001',
    isHosteler: true,
    avatar: 'https://picsum.photos/seed/alex/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.STUDENT],
    status: 'ACTIVE'
  },
  {
    id: 'f1',
    name: 'Dr. Sarah Smith',
    roles: [UserRole.FACULTY],
    email: 's.smith@college.edu',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.FACULTY],
    status: 'ACTIVE'
  },
  {
    id: 'p1',
    name: 'Robert Johnson',
    roles: [UserRole.PARENT],
    email: 'robert.j@gmail.com',
    avatar: 'https://picsum.photos/seed/robert/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.PARENT],
    status: 'ACTIVE'
  },
  {
    id: 'w1',
    name: 'Mr. David Miller',
    roles: [UserRole.WARDEN],
    email: 'd.miller@college.edu',
    avatar: 'https://picsum.photos/seed/david/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.WARDEN],
    status: 'ACTIVE'
  },
  {
    id: 'h1',
    name: 'Dr. Emily Chen',
    roles: [UserRole.HOD, UserRole.FACULTY],
    email: 'e.chen@college.edu',
    avatar: 'https://picsum.photos/seed/emily/100/100',
    permissions: [...ROLE_PERMISSIONS[UserRole.HOD], ...ROLE_PERMISSIONS[UserRole.FACULTY]],
    status: 'ACTIVE'
  },
  {
    id: 'a1',
    name: 'System Administrator',
    roles: [UserRole.ADMIN],
    email: 'admin@college.edu',
    avatar: 'https://picsum.photos/seed/admin/100/100',
    permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
    status: 'ACTIVE'
  }
];

export const MOCK_ACADEMIC_DATA = [
  { semester: 1, sgpa: 8.5, cgpa: 8.5 },
  { semester: 2, sgpa: 8.2, cgpa: 8.35 },
  { semester: 3, sgpa: 8.9, cgpa: 8.53 },
  { semester: 4, sgpa: 9.1, cgpa: 8.67 },
];

export const NAV_ITEMS = {
  [UserRole.STUDENT]: [
    { label: 'Dashboard', icon: '📊', path: '/' },
    { label: 'Apply Leave', icon: '📝', path: '/leave' },
    { label: 'OD Requests', icon: '🏃', path: '/od' },
    { label: 'Profile', icon: '👤', path: '/profile' }
  ],
  [UserRole.FACULTY]: [
    { label: 'Mentor Dashboard', icon: '📊', path: '/' },
    { label: 'Attendance', icon: '✅', path: '/attendance' },
    { label: 'Approvals', icon: '⌛', path: '/approvals' }
  ],
  [UserRole.PARENT]: [
    { label: 'Ward Progress', icon: '👁️', path: '/' },
    { label: 'Pending Approvals', icon: '⌛', path: '/approvals' }
  ],
  [UserRole.WARDEN]: [
    { label: 'Hostel Overview', icon: '🏠', path: '/' },
    { label: 'Leave Requests', icon: '🚪', path: '/approvals' }
  ],
  [UserRole.HOD]: [
    { label: 'Dept. Dashboard', icon: '🏢', path: '/' },
    { label: 'OD Approvals', icon: '🎓', path: '/approvals' }
  ],
  [UserRole.ADMIN]: [
    { label: 'Admin Console', icon: '⚙️', path: '/' },
    { label: 'User Management', icon: '👥', path: '/users' }
  ]
};
