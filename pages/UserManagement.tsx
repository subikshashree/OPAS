import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS_LIST } from '../constants';
import { GlassCard, GlassBadge, FloatingSphere, GlassButton } from '../components/ui';

const ROLES = [
  UserRole.STUDENT,
  UserRole.FACULTY, // Re-labeled to Mentor in UI
  UserRole.PARENT,
  UserRole.HOD,
  UserRole.WARDEN,
  UserRole.ADMIN
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  // Store the selected role for each user ID
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>({});

  useEffect(() => {
    // In a real app, this would be a GET request to the database
    const savedUsers = localStorage.getItem('opas_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(MOCK_USERS_LIST);
      localStorage.setItem('opas_users', JSON.stringify(MOCK_USERS_LIST));
    }
  }, []);

  const handleRoleChange = (userId: string, role: string) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: role as UserRole }));
  };

  const handleUpdate = async (userId: string) => {
    const newRole = selectedRoles[userId];
    if (!newRole) return; // No change selected

    // Simulate PUT /api/admin/update-user-role
    try {
      console.log(`[API MOCK] PUT /api/admin/update-user-role payload:`, { user_id: userId, role: newRole });
      
      const updatedUsers = users.map(u => {
        if (u.id === userId) {
          return { ...u, roles: [newRole] }; // Update primary role
        }
        return u;
      });

      setUsers(updatedUsers);
      localStorage.setItem('opas_users', JSON.stringify(updatedUsers));
      
      alert('User role updated successfully!');
      
      // Clear the dropdown selection after save
      const nextRoles = { ...selectedRoles };
      delete nextRoles[userId];
      setSelectedRoles(nextRoles);

    } catch (e) {
      alert('Error updating user role');
    }
  };

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FloatingSphere size={250} color="bg-rose-400" delay={0} className="-top-20 -left-20" />
      
      <GlassCard variant="gradient" glowColor="purple" className="p-8 md:p-10 relative z-10">
        <GlassBadge variant="danger" className="mb-3">Administrator Privileges</GlassBadge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">User Management</h1>
        <p className="text-slate-500 font-medium mt-1">Global directory and role assignment registry.</p>
      </GlassCard>

      <GlassCard variant="light" className="p-0 overflow-hidden relative z-10">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-[#f4f3ef]/30 text-xs uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Assign Role</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {users.map(user => {
                const currentPrimaryRole = user.roles[0];
                return (
                  <tr key={user.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <GlassBadge variant={
                        currentPrimaryRole === UserRole.ADMIN ? 'danger' : 
                        currentPrimaryRole === UserRole.FACULTY ? 'info' : 
                        currentPrimaryRole === UserRole.STUDENT ? 'success' : 'warning'
                      }>
                        {currentPrimaryRole === UserRole.FACULTY ? 'MENTOR' : currentPrimaryRole}
                      </GlassBadge>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        className="glass-input cursor-pointer appearance-none text-sm w-40"
                        value={selectedRoles[user.id] || currentPrimaryRole}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        {ROLES.map(r => (
                          <option key={r} value={r}>
                            {r === UserRole.FACULTY ? 'Mentor' : r.charAt(0) + r.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <GlassButton 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleUpdate(user.id)}
                        disabled={!selectedRoles[user.id] || selectedRoles[user.id] === currentPrimaryRole}
                      >
                        Update
                      </GlassButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default UserManagement;
