import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { UserRole } from '../../types';
import { MOCK_USERS_LIST, MOCK_DEPARTMENT_STATS, MOCK_LEAVE_REQUESTS } from '../../constants';
import { GlassCard, GlassBadge, FloatingSphere } from '../../components/ui';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState<any[]>(MOCK_USERS_LIST);
  const API_BASE = import.meta.env.VITE_API_URL || '/api/opas';

  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setAllUsers(data); })
      .catch(console.error);
  }, [API_BASE]);

  const handleResTypeChange = async (userId: string, type: string) => {
    const isHosteler = type === 'HOSTEL';
    setAllUsers(prev => prev.map(u => String(u.id) === String(userId) ? { ...u, isHosteler, residentialType: type } : u));
    try {
      await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHosteler, residentialType: type })
      });
    } catch (e) { console.error('Failed to update Res Type', e); }
  };

  if (!user) return null;

  const totalUsers = allUsers.length;
  const students = allUsers.filter(u => u.roles.includes(UserRole.STUDENT));
  const faculty = allUsers.filter(u => u.roles.includes(UserRole.FACULTY));
  const parents = allUsers.filter(u => u.roles.includes(UserRole.PARENT));
  const pendingLeaves = MOCK_LEAVE_REQUESTS.filter(lr => !['APPROVED', 'REJECTED'].includes(lr.status));
  const departments = MOCK_DEPARTMENT_STATS;

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FloatingSphere size={250} color="bg-rose-300" delay={0} className="-top-20 -left-20" />
      <FloatingSphere size={120} color="bg-indigo-400" delay={2} className="top-40 -right-10" />

      {/* Hero */}
      <GlassCard variant="gradient" glowColor="purple" className="p-8 md:p-10">
        <div className="relative z-10">
          <GlassBadge variant="danger" className="mb-3">Admin Console</GlassBadge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            System <span className="text-gradient">Control Panel</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Full administrative oversight across all modules and entities.</p>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, icon: '👥', color: 'text-slate-800' },
          { label: 'Students', value: students.length, icon: '🎓', color: 'text-indigo-600' },
          { label: 'Faculty', value: faculty.length, icon: '👨‍🏫', color: 'text-purple-600' },
          { label: 'Parents', value: parents.length, icon: '👨‍👩‍👦', color: 'text-emerald-600' },
          { label: 'Departments', value: departments.length, icon: '🏢', color: 'text-blue-600' },
          { label: 'Pending Leaves', value: pendingLeaves.length, icon: '⏳', color: 'text-amber-600' },
        ].map(s => (
          <GlassCard key={s.label} variant="light" className="text-center hover:-translate-y-1 transition-all">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* User Directory & Department Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* All Users */}
        <GlassCard variant="light" className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/40">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-indigo-500/10 rounded-xl">👥</span> User Directory
            </h2>
          </div>
          <div className="max-h-[400px] overflow-y-auto no-scrollbar divide-y divide-white/40">
            {allUsers.map((u, i) => (
              <motion.div 
                key={u.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-white/30 transition-colors"
              >
                <img src={u.avatar} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {u.roles.includes(UserRole.STUDENT) && (
                    <select 
                      value={u.residentialType || (u.isHosteler ? 'HOSTEL' : 'DAYSCHOLAR')}
                      onChange={(e) => handleResTypeChange(u.id, e.target.value)}
                      className="text-xs bg-indigo-50/50 border border-indigo-200 text-indigo-700 rounded-lg px-2 py-1 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                    >
                      <option value="DAYSCHOLAR">Day Scholar</option>
                      <option value="HOSTEL">Hosteler</option>
                    </select>
                  )}
                  {u.roles.map((r: any) => (
                    <GlassBadge key={r} variant={
                      r === UserRole.ADMIN ? 'danger' :
                      r === UserRole.HOD ? 'warning' :
                      r === UserRole.FACULTY ? 'info' :
                      r === UserRole.PARENT ? 'success' : 'default'
                    }>{r}</GlassBadge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Departments Table */}
        <GlassCard variant="light" className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/40">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-purple-500/10 rounded-xl">🏢</span> Department Analytics
            </h2>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-[#f4f3ef]/30 text-[10px] uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50">
                <tr>
                  <th className="px-5 py-3">Dept</th>
                  <th className="px-5 py-3">Stu</th>
                  <th className="px-5 py-3">Fac</th>
                  <th className="px-5 py-3">Att%</th>
                  <th className="px-5 py-3">Place%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {departments.map((d, i) => (
                  <motion.tr 
                    key={d.name} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="hover:bg-white/30 transition-colors"
                  >
                    <td className="px-5 py-3 font-bold text-slate-800 text-sm">{d.name}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">{d.totalStudents}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">{d.totalFaculty}</td>
                    <td className="px-5 py-3"><span className={`font-bold text-sm ${d.avgAttendance >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{d.avgAttendance}%</span></td>
                    <td className="px-5 py-3"><span className={`font-bold text-sm ${d.placementRate >= 60 ? 'text-emerald-600' : 'text-rose-600'}`}>{d.placementRate}%</span></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Pending Leaves */}
      {pendingLeaves.length > 0 && (
        <GlassCard variant="light" className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/40">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <span className="p-2 bg-amber-500/10 rounded-xl">⏳</span> System-Wide Pending Leaves
            </h2>
          </div>
          <div className="divide-y divide-white/40">
            {pendingLeaves.map(lr => (
              <div key={lr.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/20 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <GlassBadge variant={lr.type === 'OD' ? 'info' : lr.type === 'SICK' ? 'danger' : 'warning'}>{lr.type.replace('_', ' ')}</GlassBadge>
                    <span className="font-bold text-slate-800">{lr.studentName}</span>
                  </div>
                  <p className="text-xs text-slate-500">Status: <span className="font-bold text-indigo-600">{lr.status.replace('_', ' ')}</span> • {lr.startDate}</p>
                </div>
                <GlassBadge variant="default">{lr.residentialType}</GlassBadge>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default AdminDashboard;
