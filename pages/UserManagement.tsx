
import React, { useState } from 'react';
import { User, UserRole, Permission } from '../types';
import { MOCK_USERS_LIST, ROLE_PERMISSIONS } from '../constants';

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

  // Form State
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
    
    // Auto-suggest permissions based on roles
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

  const getRoleColor = (role: UserRole) => {
    switch(role) {
      case UserRole.ADMIN: return 'bg-red-100 text-red-700 border-red-200';
      case UserRole.HOD: return 'bg-purple-100 text-purple-700 border-purple-200';
      case UserRole.FACULTY: return 'bg-blue-100 text-blue-700 border-blue-200';
      case UserRole.WARDEN: return 'bg-amber-100 text-amber-700 border-amber-200';
      case UserRole.PARENT: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-500">Configure RBAC roles and granular permissions for the system.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center gap-2"
        >
          <span>➕</span> Add New User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-9 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Roles</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-full border shadow-sm" alt="" />
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map(role => (
                      <span key={role} className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleColor(role)}`}>
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleOpenModal(user)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit User"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete User"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                  <input 
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                  <input 
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Assigned Roles</label>
                <div className="grid grid-cols-3 gap-2">
                  {ALL_ROLES.map(role => (
                    <button
                      key={role}
                      onClick={() => handleToggleRole(role)}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.roles?.includes(role) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'}`}
                    >
                      <input type="checkbox" checked={formData.roles?.includes(role)} readOnly className="rounded" />
                      <span className="text-sm font-bold">{role}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase">Granular Permission Overrides</label>
                  <span className="text-[10px] text-blue-500 font-bold italic">Auto-suggested based on roles</span>
                </div>
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border">
                  {ALL_PERMISSIONS.map(perm => (
                    <label key={perm} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-10 h-6 rounded-full relative transition-colors ${formData.permissions?.includes(perm) ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={formData.permissions?.includes(perm)}
                          onChange={() => handleTogglePermission(perm)}
                        />
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.permissions?.includes(perm) ? 'translate-x-4' : ''}`}></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{perm.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
