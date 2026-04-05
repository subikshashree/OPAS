import React, { useState } from 'react';
import { useAuth } from '../../App';
import { UserRole } from '../../types';
import { MOCK_USERS_LIST, MOCK_MENTOR_ANALYSIS, MOCK_TASKS, MOCK_LEAVE_REQUESTS } from '../../constants';
import { GlassCard, GlassButton, GlassBadge, FloatingSphere } from '../../components/ui';

const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'mentees' | 'tasks' | 'leaves' | 'analysis'>('mentees');

  if (!user) return null;

  const mentees = MOCK_USERS_LIST.filter(u => u.roles.includes(UserRole.STUDENT) && u.mentorId === user.id);
  const allTasks = MOCK_TASKS.filter(t => t.assignedBy === user.id);
  const leaveQueue = MOCK_LEAVE_REQUESTS.filter(lr => lr.status === 'PENDING_MENTOR');
  const analysis = MOCK_MENTOR_ANALYSIS;

  const pendingTasks = allTasks.filter(t => t.status === 'PENDING').length;
  const completedTasks = allTasks.filter(t => t.status === 'COMPLETED').length;

  const tabs = [
    { id: 'mentees' as const, label: 'Mentee Details', icon: '👥' },
    { id: 'tasks' as const, label: 'Task Status', icon: '📋' },
    { id: 'leaves' as const, label: 'Leave Approval', icon: '⏳' },
    { id: 'analysis' as const, label: 'Analysis', icon: '📊' },
  ];

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FloatingSphere size={200} color="bg-purple-400" delay={1} className="-top-20 -right-20" />

      {/* Hero */}
      <GlassCard variant="gradient" glowColor="purple" className="p-8 md:p-10">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={user.avatar} className="w-20 h-20 rounded-3xl border-4 border-white shadow-xl object-cover" alt="" />
            <div>
              <GlassBadge variant="info" className="mb-2">Mentor Portal</GlassBadge>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{user.name}</h1>
              <p className="text-slate-500 font-medium mt-1">{user.department} • {mentees.length} Mentees</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-white/30 px-4 py-3 rounded-2xl border border-white/50 backdrop-blur-md">
              <p className="text-xl font-black text-slate-800">{mentees.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Mentees</p>
            </div>
            <div className="text-center bg-white/30 px-4 py-3 rounded-2xl border border-white/50 backdrop-blur-md">
              <p className="text-xl font-black text-amber-600">{pendingTasks}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
            </div>
            <div className="text-center bg-white/30 px-4 py-3 rounded-2xl border border-white/50 backdrop-blur-md">
              <p className="text-xl font-black text-rose-600">{leaveQueue.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Leaves</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-md overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white/60 shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
            }`}
          >
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* ── Mentee Details ── */}
      {activeTab === 'mentees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentees.map(mentee => (
            <GlassCard key={mentee.id} variant="light" className="flex items-center gap-6 hover:-translate-y-1 transition-all">
              <img src={mentee.avatar} className="w-16 h-16 rounded-2xl border-2 border-white shadow-md object-cover" alt="" />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800">{mentee.name}</h3>
                <p className="text-xs text-slate-500">{mentee.studentId} • {mentee.email}</p>
                <div className="flex gap-2 mt-2">
                  <GlassBadge variant={mentee.isHosteler ? 'info' : 'default'}>
                    {mentee.residentialType || (mentee.isHosteler ? 'Hostel' : 'Dayscholar')}
                  </GlassBadge>
                  {mentee.isHosteler && <GlassBadge variant="default">Room {mentee.roomNumber}</GlassBadge>}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── Task Status ── */}
      {activeTab === 'tasks' && (
        <GlassCard variant="light" className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/40 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Task Overview ({allTasks.length} Total)</h2>
            <div className="flex gap-3">
              <GlassBadge variant="success">{completedTasks} Done</GlassBadge>
              <GlassBadge variant="warning">{pendingTasks} Pending</GlassBadge>
            </div>
          </div>
          <div className="divide-y divide-white/40">
            {allTasks.map(task => {
              const mentee = MOCK_USERS_LIST.find(u => u.id === task.assignedTo);
              return (
                <div key={task.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/20 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <GlassBadge variant={task.status === 'COMPLETED' ? 'success' : task.status === 'OVERDUE' ? 'danger' : 'warning'}>{task.status}</GlassBadge>
                      <h3 className="font-bold text-slate-800">{task.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500">Assigned to: <span className="font-semibold">{mentee?.name}</span> • Due: {task.deadline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* ── Leave Approval Queue ── */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          {leaveQueue.length === 0 ? (
            <GlassCard variant="light" className="p-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-extrabold text-slate-800">No Pending Approvals</h3>
              <p className="text-slate-500 mt-2">All leave requests have been processed.</p>
            </GlassCard>
          ) : leaveQueue.map(lr => (
            <GlassCard key={lr.id} variant="light" className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <GlassBadge variant={lr.type === 'OD' ? 'info' : lr.type === 'SICK' ? 'danger' : 'warning'}>{lr.type.replace('_', ' ')}</GlassBadge>
                  <h3 className="font-bold text-lg text-slate-800">{lr.studentName}</h3>
                </div>
                <div className="bg-white/30 border border-white/40 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Reason</p>
                  <p className="text-slate-700 font-medium">{lr.reason}</p>
                </div>
                <p className="text-xs text-slate-500">📅 {lr.startDate} to {lr.endDate}</p>
                {/* Approval trail */}
                <div className="flex items-center gap-2 flex-wrap">
                  {lr.approvals.map((a, i) => (
                    <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold">✓ {a.approverName}</span>
                  ))}
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold animate-pulse">⏳ Your Approval</span>
                </div>
              </div>
              <div className="flex gap-3">
                <GlassButton variant="ghost" className="text-rose-600 hover:bg-rose-50 border border-rose-200">Reject</GlassButton>
                <GlassButton variant="primary" className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-none shadow-[0_5px_20px_rgba(16,185,129,0.3)]">Approve</GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── Analysis & Interaction ── */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <GlassCard variant="light" className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/40">
              <h2 className="text-lg font-bold text-slate-800">Mentee Performance Analysis</h2>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-[#f4f3ef]/30 text-xs uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Attendance</th>
                    <th className="px-6 py-4">CGPA</th>
                    <th className="px-6 py-4">Tasks</th>
                    <th className="px-6 py-4">Concerns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40">
                  {analysis.map(a => (
                    <tr key={a.menteeId} className="hover:bg-white/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{a.menteeName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white/50 rounded-full overflow-hidden border border-white/60">
                            <div className={`h-full ${a.attendance < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${a.attendance}%` }}></div>
                          </div>
                          <span className={`text-xs font-black ${a.attendance < 75 ? 'text-rose-600' : 'text-slate-600'}`}>{a.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">{a.cgpa}</td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-600 font-bold">{a.completedTasks}✓</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span className="text-amber-600 font-bold">{a.pendingTasks}⏳</span>
                      </td>
                      <td className="px-6 py-4">
                        {a.complaints.length === 0 ? (
                          <span className="text-xs text-emerald-500 font-bold">None</span>
                        ) : (
                          <div className="space-y-1">
                            {a.complaints.map((c, i) => (
                              <span key={i} className="block text-xs text-rose-600 font-medium">⚠ {c}</span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
