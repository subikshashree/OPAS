import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { MOCK_HOSTEL_STUDENTS } from '../../constants';
import { UserRole } from '../../types';
import { GlassCard, GlassButton, GlassBadge, FloatingSphere } from '../../components/ui';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useToast } from '../../hooks/useToast';

const PIE_COLORS = ['#34d399', '#818cf8', '#f43f5e'];

const WardenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'leaves'>('overview');
  const [allLeaves, setAllLeaves] = useState<any[]>([]);
  const { showToast, ToastComponent } = useToast();

  const API_BASE = import.meta.env.VITE_API_URL || '/api/opas';

  useEffect(() => {
    fetch(`${API_BASE}/leaves`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setAllLeaves(data); })
      .catch(() => showToast('Leaves cloud disconnected', 'error'));
  }, [API_BASE]);

  const handleAction = async (id: string, approved: boolean) => {
    const req = allLeaves.find(l => l.id === id);
    if (!req) return;
    let newStatus = req.status;
    let newApprovals = req.approvals || [];
    if (!approved) {
      newStatus = 'Rejected';
    } else {
      newApprovals = [...newApprovals, { role: UserRole.WARDEN, approverId: user.id, approverName: user.name, timestamp: new Date().toISOString(), approved: true }];
      const hasParent = newApprovals.some((a: any) => a.role === UserRole.PARENT);
      const hasFaculty = newApprovals.some((a: any) => a.role === UserRole.FACULTY);
      const hasWarden = newApprovals.some((a: any) => a.role === UserRole.WARDEN);
      if (hasParent && hasFaculty) newStatus = 'Approved';
    }
    setAllLeaves(prev => prev.map(l => l.id === id ? { ...l, status: newStatus, approvals: newApprovals } : l));
    try {
      await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, approvals: newApprovals })
      });
    } catch (e) { console.warn('Cloud update failed'); }
  };

  if (!user) return null;

  const hostelStudents = MOCK_HOSTEL_STUDENTS;
  const leaveQueue = allLeaves.filter(lr => lr.status === 'Pending' && !lr.approvals?.some((a: any) => a.role === 'WARDEN'));

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: '🏠' },
    { id: 'students' as const, label: 'Student Directory', icon: '👥' },
    { id: 'leaves' as const, label: 'Leave Queue', icon: '🚪' },
  ];

  const studentsOnLeave = allLeaves.filter(lr => lr.status === 'Approved').length;
  const studentsInHostel = Math.max(0, hostelStudents.length - studentsOnLeave - 2);
  
  const residentStatusData = [
    { name: 'In Hostel', value: studentsInHostel },
    { name: 'On Leave', value: studentsOnLeave },
    { name: 'On OD', value: 2 },
  ];

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ToastComponent />
      <FloatingSphere size={200} color="bg-amber-300" delay={0} className="-top-16 -right-16" />

      {/* Hero */}
      <GlassCard variant="gradient" glowColor="purple" className="p-8 md:p-10">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <GlassBadge variant="warning" className="mb-2">Warden Portal</GlassBadge>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">{user.name}</h1>
            <p className="text-slate-500 font-medium mt-1">{user.hostelName || 'Hostel Management'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-white/30 px-6 py-3 rounded-2xl border border-white/50 backdrop-blur-md">
              <p className="text-2xl font-black text-slate-800">{hostelStudents.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Residents</p>
            </div>
            <div className="text-center bg-white/30 px-6 py-3 rounded-2xl border border-white/50 backdrop-blur-md">
              <p className="text-2xl font-black text-rose-600">{leaveQueue.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p>
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

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard variant="light" className="p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="p-2 bg-indigo-500/10 rounded-xl">🏠</span> Block Summary
            </h2>
            <div className="space-y-4">
              {['Block A', 'Block B'].map(block => {
                const count = hostelStudents.filter(s => s.block === block).length;
                return (
                  <div key={block} className="flex items-center justify-between p-4 bg-white/30 rounded-xl border border-white/40">
                    <div>
                      <p className="font-bold text-slate-800">{block}</p>
                      <p className="text-xs text-slate-500">{count} residents</p>
                    </div>
                    <div className="text-2xl font-black text-indigo-600">{count}</div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard variant="light" className="p-8 text-center flex flex-col justify-center">
            <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
              <span className="p-2 bg-pink-500/10 rounded-xl">📍</span> Resident Status
            </h2>
            <div className="h-[200px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={residentStatusData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {residentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard variant="light" className="p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3">
              <span className="p-2 bg-amber-500/10 rounded-xl">⚠️</span> Alerts
            </h2>
            <div className="space-y-3">
              {leaveQueue.length > 0 && (
                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/50 lg:col-span-1">
                  <p className="font-bold text-amber-700 text-sm">{leaveQueue.length} leave request(s) need processing</p>
                  <p className="text-xs text-amber-600 mt-1">Click "Leave Queue" tab to review.</p>
                </div>
              )}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/50">
                <p className="font-bold text-emerald-700 text-sm">All rooms inspected today</p>
                <p className="text-xs text-emerald-600 mt-1">No maintenance issues reported.</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Student Directory ── */}
      {activeTab === 'students' && (
        <GlassCard variant="light" className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/40">
            <h2 className="text-lg font-bold text-slate-800">Hostel Student Directory</h2>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-[#f4f3ef]/30 text-xs uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Block</th>
                  <th className="px-6 py-4">Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {hostelStudents.map(s => (
                  <tr key={s.studentId} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover" alt="" />
                        <span className="font-bold text-slate-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{s.department}</td>
                    <td className="px-6 py-4"><GlassBadge variant="info">{s.roomNumber}</GlassBadge></td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{s.block}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{s.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ── Leave Queue ── */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          {leaveQueue.length === 0 ? (
            <GlassCard variant="light" className="p-12 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-extrabold text-slate-800">No Pending Requests</h3>
              <p className="text-slate-500 mt-2">All hostel leave requests have been processed.</p>
            </GlassCard>
          ) : leaveQueue.map(lr => (
            <GlassCard key={lr.id} variant="light" className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <GlassBadge variant={lr.type === 'SICK' ? 'danger' : lr.type === 'OD' ? 'info' : 'warning'}>{lr.type.replace('_', ' ')}</GlassBadge>
                  <h3 className="font-bold text-lg text-slate-800">{lr.studentName}</h3>
                </div>
                <p className="text-sm text-slate-600">{lr.reason}</p>
                <p className="text-xs text-slate-500">📅 {lr.startDate} to {lr.endDate}</p>
                {lr.type === 'SICK' && <p className="text-xs text-rose-500 font-bold">⏱ Max 8 hours</p>}
              </div>
              <div className="flex gap-3">
                <GlassButton variant="ghost" className="text-rose-600 hover:bg-rose-50 border border-rose-200" onClick={() => handleAction(lr.id, false)}>Reject</GlassButton>
                <GlassButton variant="primary" className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-none" onClick={() => handleAction(lr.id, true)}>Approve</GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default WardenDashboard;
