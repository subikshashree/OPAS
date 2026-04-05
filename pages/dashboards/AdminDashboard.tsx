import React from 'react';
import { useAuth } from '../../App';
import { UserRole } from '../../types';
import { MOCK_USERS_LIST, MOCK_DEPARTMENT_STATS, MOCK_LEAVE_REQUESTS } from '../../constants';
import { GlassCard, GlassBadge, FloatingSphere } from '../../components/ui';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const totalUsers = MOCK_USERS_LIST.length;
  const students = MOCK_USERS_LIST.filter(u => u.roles.includes(UserRole.STUDENT));
  const faculty = MOCK_USERS_LIST.filter(u => u.roles.includes(UserRole.FACULTY));
  const parents = MOCK_USERS_LIST.filter(u => u.roles.includes(UserRole.PARENT));
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
            {MOCK_USERS_LIST.map(u => (
              <div key={u.id} className="flex items-center gap-4 p-4 hover:bg-white/30 transition-colors">
                <img src={u.avatar} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {u.roles.map(r => (
                    <GlassBadge key={r} variant={
                      r === UserRole.ADMIN ? 'danger' :
                      r === UserRole.HOD ? 'warning' :
                      r === UserRole.FACULTY ? 'info' :
                      r === UserRole.PARENT ? 'success' : 'default'
                    }>{r}</GlassBadge>
                  ))}
                </div>
              </div>
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
                {departments.map(d => (
                  <tr key={d.name} className="hover:bg-white/30 transition-colors">
                    <td className="px-5 py-3 font-bold text-slate-800 text-sm">{d.name}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">{d.totalStudents}</td>
                    <td className="px-5 py-3 text-sm text-slate-700">{d.totalFaculty}</td>
                    <td className="px-5 py-3"><span className={`font-bold text-sm ${d.avgAttendance >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{d.avgAttendance}%</span></td>
                    <td className="px-5 py-3"><span className={`font-bold text-sm ${d.placementRate >= 60 ? 'text-emerald-600' : 'text-rose-600'}`}>{d.placementRate}%</span></td>
                  </tr>
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
