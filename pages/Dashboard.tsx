import React from 'react';
import { useAuth } from '../App';
import { UserRole } from '../types';
import StudentDashboard from './dashboards/StudentDashboard';
import MentorDashboard from './dashboards/MentorDashboard';
import HoDDashboard from './dashboards/HoDDashboard';
import ParentDashboard from './dashboards/ParentDashboard';
import WardenDashboard from './dashboards/WardenDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const primaryRole = user.roles[0];

  switch (primaryRole) {
    case UserRole.STUDENT:
      return <StudentDashboard />;
    case UserRole.FACULTY:
      return <MentorDashboard />;
    case UserRole.PARENT:
      return <ParentDashboard />;
    case UserRole.WARDEN:
      return <WardenDashboard />;
    case UserRole.HOD:
      return <HoDDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    default:
      return <StudentDashboard />;
  }
};

export default Dashboard;
