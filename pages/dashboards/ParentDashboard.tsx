import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { UserRole, LeaveRequest } from '../../types';
import { MOCK_USERS_LIST, MOCK_ATTENDANCE, MOCK_PLACEMENT } from '../../constants';
import { GlassCard, GlassButton, GlassBadge, FloatingSphere } from '../../components/ui';
import { useToast } from '../../hooks/useToast';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  
  const activeTab = tab || 'ward';
  const [allLeaves, setAllLeaves] = useState<LeaveRequest[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>(MOCK_USERS_LIST);
  const [refresh, setRefresh] = useState(0);
  const API_BASE = import.meta.env.VITE_API_URL || '/api/opas';

  useEffect(() => {

    // Fetch leaves from cloud
    fetch(`${API_BASE}/leaves`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setAllLeaves(data);
      })
      .catch(() => {
        const saved = JSON.parse(localStorage.getItem('opas_global_leaves') || '[]');
        setAllLeaves(saved);
      });

    // Try fetching from backend to get live students
    fetch(`${API_BASE}/users`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setAllUsers(data);
    }).catch(() => {
      const local = JSON.parse(localStorage.getItem('opas_users') || '[]');
      setAllUsers([...MOCK_USERS_LIST, ...local]);
    });

    const handleStorage = () => setRefresh(prev => prev + 1);
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refresh]);

  if (!user) return null;

  const ward = allUsers.find(u => String(u.id) === String(user.wardId) || String(u.parentId) === String(user.id));
  const mentor = ward ? allUsers.find(u => String(u.id) === String(ward.mentorId)) : null;
  const attendance = ward ? (MOCK_ATTENDANCE[ward.id] || []) : [];
  const placement = ward ? MOCK_PLACEMENT[ward.id] : null;

  // In Demo Mode, allow the Parent to see ALL pending parent leaves so they can test easily
  const leaveQueue = allLeaves.filter(lr => lr.status === 'Pending' && !lr.approvals?.some((a: any) => a.role === 'PARENT'));

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

  const handleAction = async (id: string, approved: boolean) => {
    const req = allLeaves.find(lr => lr.id === id);
    if (!req) return;
    let newStatus = req.status;
    let newApprovals = req.approvals || [];
    if (!approved) {
      newStatus = 'Rejected';
    } else {
      newApprovals = [...newApprovals, { role: UserRole.PARENT, timestamp: new Date().toISOString(), approved: true }];
      const hasParent = newApprovals.some((a: any) => a.role === UserRole.PARENT);
      const hasFaculty = newApprovals.some((a: any) => a.role === UserRole.FACULTY);
      const hasWarden = newApprovals.some((a: any) => a.role === UserRole.WARDEN);
      if (hasParent && hasFaculty) newStatus = 'Approved';
    }
    setAllLeaves(prev => prev.map(lr => lr.id === id ? { ...lr, status: newStatus, approvals: newApprovals } : lr));
    try {
      await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, approvals: newApprovals })
      });
    } catch (e) { console.warn('Cloud update failed'); }
    showToast(approved ? 'Leave application authorized successfully!' : 'Leave application rejected!', approved ? 'success' : 'error');
  };

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ToastComponent />
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
        {tabs.map(t => (
          <button key={t.id} onClick={() => navigate(`/parent/${t.id}`)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === t.id ? 'bg-white/60 shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
            }`}
          >
            <span>{t.icon}</span>{t.label}
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
                <GlassButton variant="ghost" onClick={() => handleAction(lr.id, false)} className="text-rose-600 hover:bg-rose-50 border border-rose-200">Deny</GlassButton>
                <GlassButton variant="primary" onClick={() => handleAction(lr.id, true)} className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-none">Authorize</GlassButton>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ── Interaction Portal ── */}
      {activeTab === 'interact' && mentor && (
        <GlassCard variant="light" className="p-0 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-white/40 flex items-center gap-4 bg-white/20">
            <img src={mentor.avatar} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" alt="" />
            <div>
              <h2 className="font-bold text-slate-800">{mentor.name}</h2>
              <p className="text-xs text-slate-500">Mentor • {mentor.department}</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar flex flex-col">
            {JSON.parse(localStorage.getItem('opas_messages') || '[]')
              .filter((m: any) => (m.sender_id === user.id && m.receiver_id === mentor.id) || (m.sender_id === mentor.id && m.receiver_id === user.id))
              .map((m: any) => (
              <div key={m.id} className={`max-w-[70%] p-3 rounded-2xl ${m.sender_id === user.id ? 'bg-indigo-500 text-white self-end rounded-br-sm' : 'bg-white/80 text-slate-800 self-start rounded-bl-sm border border-white/50 shadow-sm'}`}>
                <p className="text-sm">{m.text}</p>
                <p className={`text-[9px] mt-1 text-right ${m.sender_id === user.id ? 'text-indigo-200' : 'text-slate-400'}`}>{new Date(m.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/40 bg-white/10 flex gap-2">
            <input 
              type="text" 
              id="messageInput"
              placeholder="Type your message..."
              className="flex-1 bg-white/50 border border-white/60 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  const msgs = JSON.parse(localStorage.getItem('opas_messages') || '[]');
                  msgs.push({
                    id: Date.now().toString(),
                    sender_id: user.id,
                    receiver_id: mentor.id,
                    student_id: ward?.id,
                    text: e.currentTarget.value.trim(),
                    timestamp: new Date().toISOString()
                  });
                  localStorage.setItem('opas_messages', JSON.stringify(msgs));
                  e.currentTarget.value = '';
                  // Force re-render via state update on window
                  window.dispatchEvent(new Event('storage'));
                }
              }}
            />
            <GlassButton variant="primary" onClick={() => {
              const input = document.getElementById('messageInput') as HTMLInputElement;
              if (input && input.value.trim()) {
                const msgs = JSON.parse(localStorage.getItem('opas_messages') || '[]');
                msgs.push({
                  id: Date.now().toString(),
                  sender_id: user.id,
                  receiver_id: mentor.id,
                  student_id: ward?.id,
                  text: input.value.trim(),
                  timestamp: new Date().toISOString()
                });
                localStorage.setItem('opas_messages', JSON.stringify(msgs));
                input.value = '';
                window.dispatchEvent(new Event('storage'));
              }
            }}>Send</GlassButton>
          </div>
        </GlassCard>
      )}
      
      {activeTab === 'interact' && !mentor && (
        <GlassCard variant="light" className="p-8 text-center text-slate-500">
          No mentor assigned to this ward.
        </GlassCard>
      )}
    </div>
  );
};

export default ParentDashboard;
