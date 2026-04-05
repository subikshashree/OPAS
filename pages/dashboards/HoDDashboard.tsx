import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { UserRole } from '../../types';
import { MOCK_DEPARTMENT_STATS, MOCK_USERS_LIST } from '../../constants';
import { GlassCard, GlassBadge, FloatingSphere } from '../../components/ui';

const HoDDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();

  const activeTab = tab || 'dashboard';

  if (!user) return null;

  const dept = user.department || 'Computer Science';
  const deptStats = MOCK_DEPARTMENT_STATS.find(d => d.name === dept) || MOCK_DEPARTMENT_STATS[0];
  const allDepts = MOCK_DEPARTMENT_STATS;

  const deptStudents = MOCK_USERS_LIST.filter(u => u.roles.includes(UserRole.STUDENT) && u.department === dept);
  const deptFaculty = MOCK_USERS_LIST.filter(u => u.roles.includes(UserRole.FACULTY) && u.department === dept);

  const tabs = [
    { id: 'dashboard', label: 'Department Dashboard' },
    { id: 'attendance-report', label: 'Students & Faculty' },
    { id: 'placements-report', label: 'Institution Overview' },
    { id: 'leave-report', label: 'Leave Reports' },
  ];

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FloatingSphere size={220} color="bg-indigo-400" delay={0} className="-top-16 -right-16" />

      {/* Hero */}
      <GlassCard variant="gradient" glowColor="blue" className="p-8 md:p-10">
        <div className="relative z-10">
          <GlassBadge variant="info" className="mb-3">Head of Department</GlassBadge>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-1">
            <span className="text-gradient">{dept}</span> Department
          </h1>
          <p className="text-slate-500 font-medium">{user.name} • {user.email}</p>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-md overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button key={t.id} onClick={() => navigate(`/hod/${t.id}`)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${
              activeTab === t.id ? 'bg-white/60 shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Students', value: deptStats.totalStudents, icon: '🎓' },
            { label: 'Faculty', value: deptStats.totalFaculty, icon: '👨‍🏫' },
            { label: 'Avg Attendance', value: `${deptStats.avgAttendance}%`, icon: '📅' },
            { label: 'Avg CGPA', value: deptStats.avgCgpa.toFixed(2), icon: '📈' },
            { label: 'Placement Rate', value: `${deptStats.placementRate}%`, icon: '🏢' },
          ].map(s => (
            <GlassCard key={s.label} variant="light" className="text-center hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-slate-800">{s.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</div>
            </GlassCard>
          ))}
        </div>
      )}

      {activeTab === 'attendance-report' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard variant="light" className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="p-2 bg-indigo-500/10 rounded-xl">🎓</span> Department Students
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
              {deptStudents.map(s => (
                <div key={s.id} className="flex items-center gap-4 p-4 bg-white/30 rounded-2xl border border-white/40 hover:bg-white/50 transition-colors">
                  <img src={s.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm object-cover" alt="" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.studentId} • {s.email}</p>
                  </div>
                  <GlassBadge variant={s.isHosteler ? 'info' : 'default'}>{s.isHosteler ? 'Hostel' : 'Day'}</GlassBadge>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard variant="light" className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="p-2 bg-purple-500/10 rounded-xl">👨‍🏫</span> Faculty Members
            </h2>
            <div className="space-y-3">
              {deptFaculty.map(f => (
                <div key={f.id} className="flex items-center gap-4 p-4 bg-white/30 rounded-2xl border border-white/40 hover:bg-white/50 transition-colors">
                  <img src={f.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm object-cover" alt="" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.email}</p>
                  </div>
                  <GlassBadge variant="success">Active</GlassBadge>
                </div>
              ))}
              {deptFaculty.length === 0 && <p className="text-slate-400 text-sm">No faculty data available.</p>}
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === 'placements-report' && (
        <GlassCard variant="light" className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/40">
            <h2 className="text-lg font-bold text-slate-800">Institution-Wide Department Overview</h2>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-[#f4f3ef]/30 text-xs uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50">
                <tr>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4">Faculty</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Placement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {allDepts.map(d => (
                  <tr key={d.name} className={`hover:bg-white/30 transition-colors ${d.name === dept ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-6 py-4 font-bold text-slate-800">{d.name} {d.name === dept && '★'}</td>
                    <td className="px-6 py-4 text-slate-700">{d.totalStudents}</td>
                    <td className="px-6 py-4 text-slate-700">{d.totalFaculty}</td>
                    <td className="px-6 py-4"><span className={`font-bold ${d.avgAttendance >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{d.avgAttendance}%</span></td>
                    <td className="px-6 py-4 font-bold text-slate-700">{d.avgCgpa}</td>
                    <td className="px-6 py-4"><span className={`font-bold ${d.placementRate >= 60 ? 'text-emerald-600' : 'text-rose-600'}`}>{d.placementRate}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {activeTab === 'leave-report' && (
        <GlassCard variant="light" className="p-12 text-center text-slate-500 font-bold">
          <p className="text-2xl mb-4">📋</p>
          <p>Leave Reports will be displayed here.</p>
        </GlassCard>
      )}
    </div>
  );
};

export default HoDDashboard;
