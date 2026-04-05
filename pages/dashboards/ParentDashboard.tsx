import React, { useState } from 'react';
import { useAuth } from '../../App';
import { UserRole } from '../../types';
import { MOCK_USERS_LIST, MOCK_ATTENDANCE, MOCK_PLACEMENT, MOCK_LEAVE_REQUESTS } from '../../constants';
import { GlassCard, GlassButton, GlassBadge, FloatingSphere } from '../../components/ui';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ward' | 'attendance' | 'placement' | 'leaves' | 'interact'>('ward');

  if (!user) return null;

  const ward = MOCK_USERS_LIST.find(u => u.id === user.wardId);
  const mentor = ward ? MOCK_USERS_LIST.find(u => u.id === ward.mentorId) : null;
  const attendance = ward ? (MOCK_ATTENDANCE[ward.id] || []) : [];
  const placement = ward ? MOCK_PLACEMENT[ward.id] : null;
  const leaveQueue = MOCK_LEAVE_REQUESTS.filter(lr => lr.status === 'PENDING_PARENT' && lr.studentId === user.wardId);

  const totalDays = attendance.length;
  const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
  const attendancePct = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;

  const tabs = [
    { id: 'ward' as const, label: 'Ward Info', icon: '👁️' },
    { id: 'attendance' as const, label: 'Attendance', icon: '📅' },
    { id: 'placement' as const, label: 'Placements', icon: '🏢' },
    { id: 'leaves' as const, label: 'Leave Auth', icon: '⏳' },
    { id: 'interact' as const, label: 'Mentor Chat', icon: '💬' },
  ];

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <FloatingSphere size={180} color="bg-emerald-300" delay={0} className="-top-10 -left-20" />

      {/* Hero */}
      <GlassCard variant="gradient" glowColor="blue" className="p-8 md:p-10">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <GlassBadge variant="success" className="mb-2">Parent Portal</GlassBadge>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Welcome, {user.name}</h1>
            <p className="text-slate-500 font-medium mt-1">Monitoring: <span className="text-indigo-600 font-bold">{ward?.name || 'N/A'}</span> • {ward?.department}</p>
          </div>
          {leaveQueue.length > 0 && (
            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-300 px-5 py-3 rounded-2xl backdrop-blur-md">
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>
              <span className="font-bold text-amber-700 text-sm">{leaveQueue.length} Pending Approval(s)</span>
            </div>
          )}
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

      {/* ── Ward Info ── */}
      {activeTab === 'ward' && ward && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard variant="light" className="p-8 flex flex-col items-center text-center">
            <img src={ward.avatar} className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl object-cover mb-4" alt="" />
            <h2 className="text-2xl font-extrabold text-slate-800">{ward.name}</h2>
            <p className="text-slate-500 text-sm">{ward.studentId} • {ward.email}</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <GlassBadge variant="info">{ward.department}</GlassBadge>
              <GlassBadge variant={ward.isHosteler ? 'warning' : 'default'}>
                {ward.isHosteler ? `Hostel ${ward.roomNumber}` : `Day - Bus ${ward.busNumber}`}
              </GlassBadge>
            </div>
          </GlassCard>

          <GlassCard variant="light" className="p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/30 rounded-xl border border-white/40">
                <span className="text-sm font-bold text-slate-500">Attendance</span>
                <span className={`text-xl font-black ${attendancePct >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>{attendancePct}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/30 rounded-xl border border-white/40">
                <span className="text-sm font-bold text-slate-500">Mentor</span>
                <span className="text-sm font-bold text-slate-700">{mentor?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/30 rounded-xl border border-white/40">
                <span className="text-sm font-bold text-slate-500">Companies Attended</span>
                <span className="text-xl font-black text-slate-800">{placement?.companiesAttended || 0}</span>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Attendance ── */}
      {activeTab === 'attendance' && (
        <GlassCard variant="light" className="p-0 overflow-hidden">
          <div className="p-6 border-b border-white/40 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">{ward?.name}'s Attendance Ledger</h2>
            <GlassBadge variant={attendancePct >= 75 ? 'success' : 'danger'}>{attendancePct}%</GlassBadge>
          </div>
          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-[#f4f3ef]/30 text-xs uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50 sticky top-0">
                <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Subject</th><th className="px-6 py-4">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {attendance.map((rec, i) => (
                  <tr key={i} className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-slate-700">{rec.date}</td>
                    <td className="px-6 py-3 text-sm text-slate-600">{rec.subject}</td>
                    <td className="px-6 py-3"><GlassBadge variant={rec.status === 'PRESENT' ? 'success' : rec.status === 'ABSENT' ? 'danger' : 'info'}>{rec.status}</GlassBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ── Placement ── */}
      {activeTab === 'placement' && placement && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard variant="light" className="p-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Drives</h2>
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
            <h2 className="text-lg font-bold text-slate-800 mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white/30 rounded-xl border border-white/40">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Companies Attended</span>
                <p className="text-3xl font-black text-slate-800 mt-1">{placement.companiesAttended}</p>
              </div>
              {placement.placedCompany && (
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/50">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Placed At</span>
                  <p className="text-2xl font-black text-emerald-700 mt-1">🎉 {placement.placedCompany}</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Leave Authorization ── */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          {leaveQueue.length === 0 ? (
            <GlassCard variant="light" className="p-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-extrabold text-slate-800">No Pending Authorizations</h3>
              <p className="text-slate-500 mt-2">Your ward has no leave requests requiring your approval.</p>
            </GlassCard>
          ) : leaveQueue.map(lr => (
            <GlassCard key={lr.id} variant="light" className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <GlassBadge variant={lr.type === 'OD' ? 'info' : 'warning'}>{lr.type.replace('_', ' ')}</GlassBadge>
                  <h3 className="font-bold text-lg text-slate-800">{lr.studentName}</h3>
                </div>
                <p className="text-sm text-slate-600">{lr.reason}</p>
                <p className="text-xs text-slate-500">📅 {lr.startDate} to {lr.endDate}</p>
              </div>
              <div className="flex gap-3">
                <GlassButton variant="ghost" className="text-rose-600 hover:bg-rose-50 border border-rose-200">Deny</GlassButton>
                <GlassButton variant="primary" className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-none">Authorize</GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── Interaction Portal ── */}
      {activeTab === 'interact' && (
        <GlassCard variant="light" className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
            <span className="p-2 bg-indigo-500/10 rounded-xl">💬</span> Mentor Communication
          </h2>
          <div className="bg-white/30 border border-white/40 rounded-2xl p-6 text-center">
            {mentor ? (
              <>
                <img src={mentor.avatar} className="w-16 h-16 rounded-2xl border-2 border-white shadow-md object-cover mx-auto mb-4" alt="" />
                <h3 className="font-bold text-lg text-slate-800">{mentor.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{mentor.email} • {mentor.phone}</p>
                <GlassButton variant="primary" className="mx-auto">Send Message</GlassButton>
              </>
            ) : (
              <p className="text-slate-400">No mentor assigned to your ward.</p>
            )}
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default ParentDashboard;
