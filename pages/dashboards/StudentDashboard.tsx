import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';
import { UserRole, LeaveRequest } from '../../types';
import { MOCK_ACADEMIC_DATA, MOCK_ATTENDANCE, MOCK_PLACEMENT, MOCK_TASKS, MOCK_USERS_LIST } from '../../constants';
import { GlassCard, GlassButton, GlassBadge, FloatingSphere } from '../../components/ui';
import { getWorkflowSteps } from '../../hooks/useLeaveWorkflow';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'info' | 'attendance' | 'placement' | 'tasks' | 'leave'>(
    location.state?.targetTab || 'info'
  );
  const [showAttendanceDetail, setShowAttendanceDetail] = useState(false);
  const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('opas_my_leaves') || '[]');
    setMyLeaves(saved);
  }, []);

  if (!user) return null;

  const studentId = user.id;
  const attendance = MOCK_ATTENDANCE[studentId] || [];
  const tasks = MOCK_TASKS.filter(t => t.assignedTo === studentId);
  const placement = MOCK_PLACEMENT[studentId];
  const mentor = MOCK_USERS_LIST.find(u => u.id === user.mentorId);
  const parent = MOCK_USERS_LIST.find(u => u.id === user.parentId);

  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const absentDays = attendance.filter(a => a.status === 'ABSENT').length;
  const attendancePct = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const overdueTasks = tasks.filter(t => t.status === 'OVERDUE');

  const tabs = [
    { id: 'info' as const, label: 'Personal Info', icon: '👤' },
    { id: 'attendance' as const, label: 'Attendance', icon: '📅' },
    { id: 'placement' as const, label: 'Placements', icon: '🏢' },
    { id: 'tasks' as const, label: 'Tasks', icon: '📋' },
    { id: 'leave' as const, label: 'Leave Portal', icon: '📝' },
  ];

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FloatingSphere size={150} color="bg-indigo-400" delay={0} className="-top-10 -left-20" />
      <FloatingSphere size={80} color="bg-cyan-300" delay={2} className="top-20 right-10" />

      {/* Hero */}
      <GlassCard variant="gradient" glowColor="blue" className="p-8 md:p-10">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={user.avatar} className="w-20 h-20 rounded-3xl border-4 border-white shadow-xl object-cover" alt="" />
            <div>
              <GlassBadge variant="info" className="mb-2">Student Portal</GlassBadge>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                Welcome, <span className="text-gradient">{user.name}</span>
              </h1>
              <p className="text-slate-500 font-medium mt-1">{user.studentId} • {user.department}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/leave"><GlassButton variant="primary" size="lg">Apply Leave</GlassButton></Link>
          </div>
        </div>
      </GlassCard>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-md overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white/60 shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
            }`}
          >
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* ── Personal Info Tab ── */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard variant="light" className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="p-2 bg-indigo-500/10 rounded-xl">📇</span> Profile Details
            </h2>
            <div className="space-y-4">
              {[
                ['Full Name', user.name],
                ['Email', user.email],
                ['Phone', user.phone || 'N/A'],
                ['Department', user.department || 'N/A'],
                ['Student ID', user.studentId || 'N/A'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center p-3 bg-white/30 rounded-xl border border-white/40">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
                  <span className="font-semibold text-slate-700 text-sm">{value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard variant="light" className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="p-2 bg-purple-500/10 rounded-xl">🔗</span> Academic Links
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-white/30 rounded-xl border border-white/40">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mentor</span>
                <p className="font-bold text-slate-800 mt-1">{mentor?.name || 'Not Assigned'}</p>
                <p className="text-xs text-slate-500">{mentor?.email}</p>
              </div>
              <div className="p-4 bg-white/30 rounded-xl border border-white/40">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent / Guardian</span>
                <p className="font-bold text-slate-800 mt-1">{parent?.name || 'Not Linked'}</p>
                <p className="text-xs text-slate-500">{parent?.phone}</p>
              </div>
              <div className="p-4 bg-white/30 rounded-xl border border-white/40">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Status</span>
                <div className="flex items-center gap-3 mt-1">
                  <GlassBadge variant={user.isHosteler ? 'info' : 'default'}>
                    {user.residentialType || (user.isHosteler ? 'HOSTEL' : 'DAYSCHOLAR')}
                  </GlassBadge>
                  <span className="text-sm font-semibold text-slate-700">
                    {user.isHosteler ? `Room ${user.roomNumber} • ${user.hostelBlock}` : `Bus ${user.busNumber}`}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Attendance Tab ── */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatMini title="Overall %" value={`${attendancePct}%`} icon="📊" color={attendancePct >= 75 ? 'text-emerald-600' : 'text-rose-600'} />
            <StatMini title="Working Days" value={String(totalDays)} icon="📅" />
            <StatMini title="Present" value={String(presentDays)} icon="✅" color="text-emerald-600" />
            <StatMini title="Absent" value={String(absentDays)} icon="❌" color="text-rose-600" />
          </div>

          <GlassCard variant="light" className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/40 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Detailed Ledger</h2>
              <GlassBadge variant={attendancePct >= 75 ? 'success' : 'danger'}>
                {attendancePct >= 75 ? 'On Track' : 'Low Attendance'}
              </GlassBadge>
            </div>
            <div className="overflow-x-auto no-scrollbar max-h-[400px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-[#f4f3ef]/30 backdrop-blur-md text-xs uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40">
                  {attendance.map((rec, i) => (
                    <tr key={i} className="hover:bg-white/30 transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-slate-700">{rec.date}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{rec.subject}</td>
                      <td className="px-6 py-3">
                        <GlassBadge variant={rec.status === 'PRESENT' ? 'success' : rec.status === 'ABSENT' ? 'danger' : 'info'}>
                          {rec.status}
                        </GlassBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Placement Tab ── */}
      {activeTab === 'placement' && placement && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatMini title="Companies Attended" value={String(placement.companiesAttended)} icon="🏢" />
            <StatMini title="Upcoming Drives" value={String(placement.upcomingCompanies.length)} icon="📅" />
            <StatMini title="Status" value={placement.placedCompany || 'Not Yet Placed'} icon={placement.placedCompany ? '🎉' : '🔄'} color={placement.placedCompany ? 'text-emerald-600' : 'text-amber-600'} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard variant="light" className="p-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Companies</h2>
              <div className="space-y-3">
                {placement.upcomingCompanies.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-white/40">
                    <div>
                      <p className="font-bold text-slate-800">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.role}</p>
                    </div>
                    <GlassBadge variant="info">{c.date}</GlassBadge>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard variant="light" className="p-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Improvement Areas</h2>
              <div className="space-y-3">
                {placement.improvementAreas.map((area, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-amber-500/5 rounded-xl border border-amber-200/50">
                    <span className="text-amber-500 text-lg">⚡</span>
                    <span className="font-semibold text-slate-700">{area}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* ── Tasks Tab ── */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatMini title="Pending" value={String(pendingTasks.length)} icon="⏳" color="text-amber-600" />
            <StatMini title="Completed" value={String(completedTasks.length)} icon="✅" color="text-emerald-600" />
            <StatMini title="Overdue" value={String(overdueTasks.length)} icon="🔴" color="text-rose-600" />
          </div>

          <GlassCard variant="light" className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/40">
              <h2 className="text-lg font-bold text-slate-800">All Tasks</h2>
            </div>
            <div className="divide-y divide-white/40">
              {tasks.map(task => (
                <div key={task.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/20 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <GlassBadge variant={task.status === 'COMPLETED' ? 'success' : task.status === 'OVERDUE' ? 'danger' : 'warning'}>
                        {task.status}
                      </GlassBadge>
                      <h3 className="font-bold text-slate-800">{task.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">{task.description}</p>
                    <p className="text-xs text-slate-400">Assigned by <span className="font-semibold">{task.assignedByName}</span> • Deadline: <span className="font-semibold">{task.deadline}</span></p>
                  </div>
                  {task.status === 'PENDING' && (
                    <GlassButton variant="primary" size="sm">Submit</GlassButton>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Leave Portal Tab ── */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <GlassCard variant="light" className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="text-2xl">⚙️</span> Approval Workflows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(['SICK', 'NORMAL', 'SPECIAL_PERMISSION', 'OD'] as const).map(type => {
                const steps = getWorkflowSteps(type, user.isHosteler || false);
                return (
                  <div key={type} className="p-5 bg-white/30 rounded-2xl border border-white/40">
                    <GlassBadge variant={type === 'SICK' ? 'danger' : type === 'OD' ? 'info' : 'warning'} className="mb-3">
                      {type.replace('_', ' ')}
                    </GlassBadge>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {steps.map((step, i) => (
                        <React.Fragment key={step.label}>
                          <span className="px-3 py-1 bg-white/50 rounded-lg text-xs font-bold text-indigo-700 border border-indigo-200/50">{step.label}</span>
                          {i < steps.length - 1 && <span className="text-indigo-300">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    {type === 'SICK' && <p className="text-[10px] text-slate-400 mt-2 font-medium">Max 8 hours • Hostel students only</p>}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard variant="light" className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/40 flex items-center justify-between bg-white/10">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><span className="text-2xl">📜</span> My Leave History</h2>
            </div>
            
            <div className="p-4 md:p-6">
              {myLeaves.length === 0 ? (
                <div className="text-center py-10 bg-white/20 rounded-2xl border border-dashed border-slate-300">
                  <p className="text-4xl mb-4">📭</p>
                  <p className="text-slate-500 font-semibold">No leave applications found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myLeaves.map((leave, i) => (
                    <div key={i} className="p-5 bg-white/40 rounded-2xl border border-white/50 hover:bg-white/60 transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <GlassBadge variant={leave.type === 'OD' ? 'info' : leave.type === 'SICK' ? 'danger' : 'warning'}>
                            {leave.type.replace('_', ' ')}
                          </GlassBadge>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(leave.appliedAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium">{leave.reason}</p>
                        <p className="text-xs font-semibold text-indigo-600 bg-indigo-50/50 inline-block px-2 py-1 rounded-md border border-indigo-100">
                          {leave.startDate} to {leave.endDate}
                        </p>
                      </div>

                      <div className="flex flex-col items-end justify-center min-w-[120px]">
                        <GlassBadge variant={leave.status === 'PENDING' ? 'warning' : leave.status === 'APPROVED' ? 'success' : 'danger'} className="text-sm px-4 py-1.5 shadow-sm">
                          {leave.status === 'PENDING' ? '⏳ PENDING' : leave.status}
                        </GlassBadge>
                        <span className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-wider">Current Status</span>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>

          <div className="flex gap-4 pt-2">
            <Link to="/leave" className="flex-1"><GlassButton variant="primary" size="lg" className="w-full shadow-lg shadow-indigo-500/20">New Leave Request</GlassButton></Link>
          </div>
        </div>
      )}
    </div>
  );
};

const StatMini: React.FC<{ title: string; value: string; icon: string; color?: string }> = ({ title, value, icon, color }) => (
  <GlassCard variant="light" className="flex items-center gap-4 hover:-translate-y-0.5 transition-all">
    <div className="p-3 bg-white/40 rounded-2xl text-2xl border border-white/50">{icon}</div>
    <div>
      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{title}</span>
      <div className={`text-2xl font-black tracking-tight ${color || 'text-slate-800'}`}>{value}</div>
    </div>
  </GlassCard>
);

export default StudentDashboard;
