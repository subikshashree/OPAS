import React, { useState } from 'react';
import { User, UserRole, Permission } from '../types';
import { MOCK_USERS_LIST, ROLE_PERMISSIONS } from '../constants';
import { GlassCard, GlassButton, GlassToggle, GlassBadge, GlassInput } from '../components/ui';

const ALL_ROLES = Object.values(UserRole);
const ALL_PERMISSIONS: Permission[] = [
  'VIEW_ACADEMICS', 
  'MARK_ATTENDANCE', 
  'APPROVE_LEAVE', 
  'MANAGE_USERS', 
  'VIEW_SYSTEM_LOGS', 
  'SUBMIT_REQUESTS'
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS_LIST);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    roles: [],
    permissions: [],
    status: 'ACTIVE'
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        roles: [],
        permissions: [],
        status: 'ACTIVE'
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleRole = (role: UserRole) => {
    const currentRoles = formData.roles || [];
    const newRoles = currentRoles.includes(role) 
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    
    const suggestedPerms = Array.from(new Set(newRoles.flatMap(r => ROLE_PERMISSIONS[r])));
    
    setFormData({ 
      ...formData, 
      roles: newRoles,
      permissions: suggestedPerms
    });
  };

  const handleTogglePermission = (perm: Permission) => {
    const currentPerms = formData.permissions || [];
    const newPerms = currentPerms.includes(perm)
      ? currentPerms.filter(p => p !== perm)
      : [...currentPerms, perm];
    setFormData({ ...formData, permissions: newPerms });
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u));
    } else {
      const newUser: User = {
        id: `u${Date.now()}`,
        name: formData.name!,
        email: formData.email!,
        roles: formData.roles || [UserRole.STUDENT],
        permissions: formData.permissions || ROLE_PERMISSIONS[UserRole.STUDENT],
        status: formData.status || 'ACTIVE',
        avatar: `https://picsum.photos/seed/${formData.name}/100/100`
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleVariant = (role: UserRole) => {
    switch(role) {
      case UserRole.ADMIN: return 'danger';
      case UserRole.HOD: return 'warning';
      case UserRole.FACULTY: return 'info';
      case UserRole.PARENT: return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Identity Matrix</h1>
          <p className="text-slate-500 font-medium mt-1">Configure RBAC roles and system parameters.</p>
        </div>
        <GlassButton 
          variant="primary"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2"
        >
          <span>➕</span> Add Identity
        </GlassButton>
      </div>

      <GlassCard variant="light" className="p-0 overflow-hidden">
        <div className="p-4 border-b border-white/40 bg-white/20 backdrop-blur-md">
          <div className="max-w-md">
            <GlassInput 
              type="text" 
              placeholder="Query by name or designation..." 
              icon={<span>🔍</span>}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-[#f4f3ef]/30 backdrop-blur-md text-xs uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50">
              <tr>
                <th className="px-6 py-5">Node Identity</th>
                <th className="px-6 py-5">Clearance Levels</th>
                <th className="px-6 py-5">State</th>
                <th className="px-6 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-md object-cover" alt="" />
                      <div>
                        <p className="font-bold text-slate-800 tracking-tight">{user.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map(role => (
                        <GlassBadge key={role} variant={getRoleVariant(role) as any}>
                          {role}
                        </GlassBadge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'ACTIVE' ? (
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                         <span className="text-xs font-bold text-slate-700">ONLINE</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                         <span className="text-xs font-bold text-slate-500">OFFLINE</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenModal(user)}
                      className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-white/60 rounded-xl transition-all shadow-sm"
                      title="Edit User"
                    >
                      Config
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-rose-400 hover:text-rose-600 hover:bg-white/60 rounded-xl transition-all shadow-sm"
                      title="Delete User"
                    >
                      Purge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="w-full max-w-2xl">
            <GlassCard variant="light" className="flex flex-col max-h-[90vh] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-white/60">
              <div className="p-6 border-b border-white/40 flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{editingUser ? 'Modify Node' : 'Initialize Node'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors">
                   <div className="w-8 h-8 flex items-center justify-center bg-white/40 rounded-full cursor-pointer hover:bg-white/80">✕</div>
                </button>
              </div>
              
              <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Designated Name</label>
                    <GlassInput 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Comms Vector</label>
                    <GlassInput 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Clearance Levels</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ALL_ROLES.map(role => {
                      const isActive = formData.roles?.includes(role);
                      return (
                        <div
                          key={role}
                          onClick={() => handleToggleRole(role)}
                          className={`flex items-center gap-3 p-3 text-sm font-bold cursor-pointer transition-all rounded-2xl ${isActive ? 'bg-indigo-500/80 text-white shadow-[var(--shadow-glass-glow-purple)]' : 'glass-button text-slate-700'}`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-white' : 'border-slate-400'}`}>
                             {isActive && <div className="w-2 h-2 rounded-full bg-white"></div>}
                          </div>
                          {role}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/40">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Procedural Overrides</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/20 p-5 rounded-3xl border border-white/50 inset-shadow-sm">
                    {ALL_PERMISSIONS.map(perm => (
                      <div key={perm} className="flex items-center justify-between p-2 bg-white/40 rounded-xl hover:bg-white/60 transition-colors">
                        <span className="text-xs font-bold text-slate-700">{perm.replace(/_/g, ' ')}</span>
                        <GlassToggle 
                          checked={formData.permissions?.includes(perm) || false}
                          onChange={() => handleTogglePermission(perm)}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/40 bg-white/20 flex justify-end gap-4 rounded-b-3xl">
                <GlassButton 
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Abort
                </GlassButton>
                <GlassButton 
                  variant="primary"
                  onClick={handleSave}
                >
                  {editingUser ? 'Commit Changes' : 'Initialize Entity'}
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
