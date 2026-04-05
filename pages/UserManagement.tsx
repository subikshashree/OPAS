import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS_LIST } from '../constants';
import { GlassCard, GlassBadge, FloatingSphere, GlassButton } from '../components/ui';
import { useToast } from '../hooks/useToast';

const ROLES = [
  UserRole.STUDENT,
  UserRole.FACULTY,
  UserRole.PARENT,
  UserRole.HOD,
  UserRole.WARDEN,
  UserRole.ADMIN
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>({});
  const { showToast, ToastComponent } = useToast();

  // Modal State
  const [configuringUser, setConfiguringUser] = useState<User | null>(null);
  const [formParent, setFormParent] = useState<string>('');
  const [formMentor, setFormMentor] = useState<string>('');
  const [formWarden, setFormWarden] = useState<string>('');

  useEffect(() => {
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
    if (!newRole) return;

    try {
      const updatedUsers = users.map(u => u.id === userId ? { ...u, roles: [newRole] } : u);
      setUsers(updatedUsers);
      localStorage.setItem('opas_users', JSON.stringify(updatedUsers));
      showToast('User role updated successfully!', 'success');
      
      const nextRoles = { ...selectedRoles };
      delete nextRoles[userId];
      setSelectedRoles(nextRoles);
    } catch (e) {
      showToast('Error updating user role', 'error');
    }
  };

  const handleOpenConfig = (user: User) => {
    setConfiguringUser(user);
    setFormParent(user.parentId || '');
    setFormMentor(user.mentorId || '');
    setFormWarden(user.wardenId || '');
  };

  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringUser) return;

    const oldParentId = configuringUser.parentId;
    const oldMentorId = configuringUser.mentorId;

    const updatedUsers = users.map(u => {
      // 1. Update the target student
      if (u.id === configuringUser.id) {
        return { ...u, parentId: formParent || undefined, mentorId: formMentor || undefined, wardenId: formWarden || undefined };
      }
      
      // 2. Set new mapping on assigned parent
      if (u.id === formParent && formParent) {
        return { ...u, wardId: configuringUser.id };
      }
      // Unlink old parent if changed
      if (oldParentId && u.id === oldParentId && u.id !== formParent) {
        return { ...u, wardId: undefined };
      }

      // 3. Set new mapping on assigned mentor
      if (u.id === formMentor && formMentor) {
        const mentees = u.menteeIds || [];
        return { ...u, menteeIds: mentees.includes(configuringUser.id) ? mentees : [...mentees, configuringUser.id] };
      }
      // Unlink from old mentor
      if (oldMentorId && u.id === oldMentorId && u.id !== formMentor) {
        return { ...u, menteeIds: (u.menteeIds || []).filter(mid => mid !== configuringUser.id) };
      }

      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('opas_users', JSON.stringify(updatedUsers));
    showToast('Student relationships saved successfully!', 'success');
    setConfiguringUser(null);
  };

  // Helper arrays for dropdowns
  const parentCandidates = users.filter(u => u.roles.includes(UserRole.PARENT));
  const mentorCandidates = users.filter(u => u.roles.includes(UserRole.FACULTY));
  const wardenCandidates = users.filter(u => u.roles.includes(UserRole.WARDEN));

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ToastComponent />
      <FloatingSphere size={250} color="bg-rose-400" delay={0} className="-top-20 -left-20" />
      
      <GlassCard variant="gradient" glowColor="purple" className="p-8 md:p-10 relative z-10">
        <GlassBadge variant="danger" className="mb-3">Administrator Privileges</GlassBadge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">User Management</h1>
        <p className="text-slate-500 font-medium mt-1">Global directory, role assignment, and relationship configuration.</p>
      </GlassCard>

      <GlassCard variant="light" className="p-0 overflow-hidden relative z-10">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-[#f4f3ef]/30 text-[11px] uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Assign Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {users.map(user => {
                const currentPrimaryRole = user.roles[0];
                return (
                  <tr key={user.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{user.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 font-mono text-xs px-2 py-1 rounded-md border border-slate-200">{user.id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{user.email}</td>
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
                        className="bg-white/50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 w-36"
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
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                       {currentPrimaryRole === UserRole.STUDENT && (
                        <GlassButton 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => handleOpenConfig(user)}
                        >
                          Configure
                        </GlassButton>
                       )}
                      <GlassButton 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleUpdate(user.id)}
                        disabled={!selectedRoles[user.id] || selectedRoles[user.id] === currentPrimaryRole}
                      >
                        Save Role
                      </GlassButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Configuration Modal */}
      {configuringUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 border border-white p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200 relative">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Configure Connections</h2>
            <p className="text-sm font-medium text-slate-500 mt-1 mb-6">Mapping guardians and faculty for <strong className="text-indigo-600">{configuringUser.name}</strong> (<span className="font-mono">{configuringUser.id}</span>)</p>
            
            <form onSubmit={handleConfigSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Assign Parent</label>
                <select
                  value={formParent}
                  onChange={e => setFormParent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                >
                  <option value="">-- No Parent Assigned --</option>
                  {parentCandidates.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Assign Mentor</label>
                <select
                  value={formMentor}
                  onChange={e => setFormMentor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                >
                  <option value="">-- No Mentor Assigned --</option>
                  {mentorCandidates.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Assign Warden</label>
                <select
                  value={formWarden}
                  onChange={e => setFormWarden(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                >
                  <option value="">-- No Warden Assigned --</option>
                  {wardenCandidates.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <GlassButton variant="secondary" onClick={() => setConfiguringUser(null)} className="flex-1 justify-center">Cancel</GlassButton>
                <GlassButton variant="primary" type="submit" className="flex-1 justify-center">Save Links</GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
