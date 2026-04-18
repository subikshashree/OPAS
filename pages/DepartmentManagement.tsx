import React, { useState, useEffect } from 'react';
import { Department, UserRole } from '../types';
import { MOCK_DEPARTMENTS, MOCK_USERS_LIST } from '../constants';
import { GlassCard, GlassBadge, FloatingSphere, GlassButton } from '../components/ui';
import { useToast } from '../hooks/useToast';

const DepartmentManagement: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_URL || '/api/opas';
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast, ToastComponent } = useToast();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formHod, setFormHod] = useState('');

  // Derived selectors
  const hodCandidates = MOCK_USERS_LIST.filter(u => u.roles.includes(UserRole.HOD) || u.roles.includes(UserRole.FACULTY));

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/departments`);
      if (res.ok) {
        setDepartments(await res.json());
      } else {
        showToast('Failed to load departments', 'error');
      }
    } catch (e) {
      showToast('API unreachable', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormName(dept.departmentName);
    setFormHod(dept.hodId);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingDept(null);
    setFormName('');
    setFormHod('');
    setIsModalOpen(true);
  };

  const calculateTotalStudents = (deptName: string) => {
    // We dynamically count how many students belong to this department from MOCK_USERS_LIST
    return MOCK_USERS_LIST.filter(u => u.roles.includes(UserRole.STUDENT) && u.department === deptName).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return showToast('Department name is required', 'error');

    try {
      if (editingDept) {
        const res = await fetch(`${API_BASE}/departments/${editingDept.departmentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departmentName: formName, hodId: formHod })
        });
        if (res.ok) {
          showToast('Department updated successfully', 'success');
        } else throw new Error();
      } else {
        const res = await fetch(`${API_BASE}/departments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ departmentName: formName, hodId: formHod })
        });
        if (res.ok) {
          showToast('Department created successfully', 'success');
        } else throw new Error();
      }
      
      await fetchDepartments();
      setIsModalOpen(false);
    } catch (e) {
      showToast('Operation failed', 'error');
    }
  };

  const getHodName = (hodId: string) => {
    const user = MOCK_USERS_LIST.find(u => u.id === hodId);
    return user ? user.name : 'Unassigned';
  };

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ToastComponent />
      <FloatingSphere size={250} color="bg-blue-400" delay={0} className="-top-20 -left-20 mix-blend-multiply opacity-20" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/20 p-6 rounded-3xl border border-white/40 backdrop-blur-md shadow-sm relative z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Departments Management</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Add, edit, and assign Heads of Departments</p>
        </div>
        <GlassButton variant="primary" onClick={handleAdd}>
          <span className="mr-2">+</span> Add Department
        </GlassButton>
      </div>

      <GlassCard variant="light" className="p-0 overflow-hidden relative z-10">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-[#f4f3ef]/30 text-[10px] uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50">
              <tr>
                <th className="px-6 py-4">Department Name</th>
                <th className="px-6 py-4">HoD</th>
                <th className="px-6 py-4">Total Students</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Loading departments...</td>
                </tr>
              ) : departments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">No departments found. Create one.</td>
                </tr>
              ) : (
                departments.map(dept => (
                  <tr key={dept.departmentId} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                          {dept.departmentName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-800">{dept.departmentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <GlassBadge variant={dept.hodId ? "info" : "danger"}>
                        {getHodName(dept.hodId)}
                      </GlassBadge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {calculateTotalStudents(dept.departmentName)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <GlassButton variant="secondary" onClick={() => handleEdit(dept)} className="py-1.5 px-4 text-xs">
                        Edit
                      </GlassButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/90 border border-white p-8 rounded-3xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200 relative">
            <h2 className="text-xl font-bold text-slate-800 mb-6">{editingDept ? 'Edit Department' : 'Create New Department'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                  placeholder="e.g. Artificial Intelligence"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assign HoD</label>
                <select
                  value={formHod}
                  onChange={e => setFormHod(e.target.value)}
                  className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
                >
                  <option value="">-- Unassigned --</option>
                  {hodCandidates.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <GlassButton variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1 justify-center">Cancel</GlassButton>
                <GlassButton variant="primary" type="submit" className="flex-1 justify-center">Save Settings</GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
