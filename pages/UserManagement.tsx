import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS_LIST } from '../constants';
import { GlassCard, GlassBadge, FloatingSphere, GlassButton } from '../components/ui';
import { useToast } from '../hooks/useToast';

const API_BASE = import.meta.env.VITE_API_URL || '/api/opas';

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
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, UserRole>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const { showToast, ToastComponent } = useToast();

  // Modal State
  const [configuringUser, setConfiguringUser] = useState<User | null>(null);
  const [formParent, setFormParent] = useState<string>('');
  const [formMentor, setFormMentor] = useState<string>('');
  const [formWarden, setFormWarden] = useState<string>('');
  const [formDepartment, setFormDepartment] = useState<string>('');

  const fetchInitialData = async () => {
    setIsSyncing(true);
    try {
      const [uRes, dRes] = await Promise.all([
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/departments`)
      ]);
      if (uRes.ok) setUsers(await uRes.json());
      if (dRes.ok) setDepartments(await dRes.json());
    } catch (e) {
      showToast('Cloud API Unreachable', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleRoleChange = (userId: string, role: string) => {
    setSelectedRoles(prev => ({ ...prev, [userId]: role as UserRole }));
  };

  const handleUpdate = async (userId: string) => {
    const newRole = selectedRoles[userId];
    if (!newRole) return;

    setIsSyncing(true);
    try {
      // ─── 1. Update Cloud Backend ───────────────────────────────
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
        showToast('User role updated in Cloud!', 'success');
      } else {
        showToast('Cloud update rejected', 'error');
      }

      const nextRoles = { ...selectedRoles };
      delete nextRoles[userId];
      setSelectedRoles(nextRoles);
    } catch (e) {
      showToast('Backend unavailable', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOpenConfig = (user: User) => {
    setConfiguringUser(user);
    setFormParent(user.parentId || '');
    setFormMentor(user.mentorId || '');
    setFormWarden(user.wardenId || '');
    setFormDepartment(user.department || '');
  };

  const handleConfigSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringUser) return;

    setIsSyncing(true);
    try {
      // ─── 1. Update Cloud Backend for the student ──────────────
      const res = await fetch(`${API_BASE}/users/${configuringUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          parentId: formParent || null, 
          mentorId: formMentor || null, 
          wardenId: formWarden || null,
          department: formDepartment || null
        }),
      });

      if (res.ok) {
        // Handle symmetric updates strictly in API to maintain DB integrity
        if (formParent) {
          await fetch(`${API_BASE}/users/${formParent}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wardId: configuringUser.id })
          });
        }
        if (formMentor) {
          const m = users.find(u => u.id === formMentor);
          if (m) {
            const mList = m.menteeIds || [];
            if (!mList.includes(configuringUser.id)) {
              await fetch(`${API_BASE}/users/${formMentor}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ menteeIds: [...mList, configuringUser.id].join(',') })
              });
            }
          }
        }
        await fetchInitialData();
        showToast('Relationships synced to Cloud!', 'success');
      } else {
        showToast('Cloud update failed', 'error');
      }
    } catch (e) {
      showToast('API unreachable', 'error');
    } finally {
      setIsSyncing(false);
      setConfiguringUser(null);
    }
  };

  const parentCandidates = users.filter(u => u.roles.includes(UserRole.PARENT));
  const mentorCandidates = users.filter(u => u.roles.includes(UserRole.FACULTY));
  const wardenCandidates = users.filter(u => u.roles.includes(UserRole.WARDEN));

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ToastComponent />
      <FloatingSphere size={250} color="bg-rose-400" delay={0} className="-top-20 -left-20" />
      
      <GlassCard variant="gradient" glowColor="purple" className="p-8 md:p-10 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <GlassBadge variant="danger" className="mb-3">Global Directory (Cloud)</GlassBadge>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">User Management</h1>
            <p className="text-slate-500 font-medium mt-1">Role assignment and relationship configuration synced to MongoDB.</p>
          </div>
          <GlassButton variant="secondary" size="sm" onClick={fetchInitialData} disabled={isSyncing}>
            {isSyncing ? 'Syncing...' : 'Refresh'}
          </GlassButton>
        </div>
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
                const resolveName = (id?: string) => {
                  if (!id) return '';
                  const found = users.find(u => u.id === id);
                  return found ? found.name : id;
                };

                return (
                  <tr key={user.id} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{user.name}</div>
                      {currentPrimaryRole === UserRole.PARENT && user.wardId && (
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5 tracking-wide">
                          ↳ Guardian of: {resolveName(user.wardId)}
                        </div>
                      )}
                      {currentPrimaryRole === UserRole.STUDENT && (user.mentorId || user.parentId) && (
                        <div className="text-[10px] text-indigo-500 font-bold mt-0.5 tracking-wide">
                          {user.mentorId && <span>↳ Mentor: {resolveName(user.mentorId)} </span>}
                          {user.parentId && <span className="ml-1">↳ Parent: {resolveName(user.parentId)}</span>}
                        </div>
                      )}
                      {currentPrimaryRole === UserRole.FACULTY && user.menteeIds && user.menteeIds.length > 0 && (
                        <div className="text-[10px] text-purple-600 font-bold mt-0.5 tracking-wide">
                          ↳ Mentoring {user.menteeIds.length} Student(s)
                        </div>
                      )}
                    </td>
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
                        disabled={isSyncing}
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
                          disabled={isSyncing}
                        >
                          Configure
                        </GlassButton>
                       )}
                      <GlassButton 
                        variant="primary" 
                        size="sm" 
                        onClick={() => handleUpdate(user.id)}
                        disabled={isSyncing || !selectedRoles[user.id] || selectedRoles[user.id] === currentPrimaryRole}
                      >
                        {isSyncing ? '...' : 'Save Role'}
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
            <p className="text-sm font-medium text-slate-500 mt-1 mb-6">Mapping guardians and faculty for <strong className="text-indigo-600">{configuringUser.name}</strong></p>
            
            <form onSubmit={handleConfigSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Assign Department</label>
                <select
                  value={formDepartment}
                  onChange={e => setFormDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                >
                  <option value="">-- No Department Assigned --</option>
                  {departments.map(d => (
                    <option key={d.departmentId} value={d.departmentName}>{d.departmentName}</option>
                  ))}
                </select>
              </div>

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
                <GlassButton variant="primary" type="submit" className="flex-1 justify-center" disabled={isSyncing}>
                  {isSyncing ? 'Syncing...' : 'Save Links'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
