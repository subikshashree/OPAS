import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { UserRole, LeaveRequest } from '../../types';
import { MOCK_USERS_LIST, MOCK_MENTOR_ANALYSIS, MOCK_TASKS } from '../../constants';
import { GlassCard, GlassButton, GlassBadge, FloatingSphere } from '../../components/ui';
import { useToast } from '../../hooks/useToast';
import { getNextPendingStatus } from '../../hooks/useLeaveWorkflow';

const MentorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  
  const activeTab = tab || 'mentees';
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

  const mentees = allUsers.filter(u => u.roles.includes(UserRole.STUDENT) && (String(u.mentorId) === String(user.id) || user.menteeIds?.includes(u.id)));
  // Find all parents connected to those mentees
  const parents = allUsers.filter(u => mentees.some(m => String(m.id) === String(u.wardId)) && u.roles.includes(UserRole.PARENT));

  const allTasks = MOCK_TASKS.filter(t => String(t.assignedBy) === String(user.id));
  // In Demo Mode, allow the Mentor to see ALL pending mentor leaves to reduce testing friction
  const leaveQueue = allLeaves.filter(lr => lr.status === 'Pending' && !lr.approvals?.some((a: any) => a.role === 'FACULTY'));
  
  const pipelineQueue: any[] = []; // Removed for simple workflow
  const analysis = MOCK_MENTOR_ANALYSIS;

  const pendingTasks = allTasks.filter(t => t.status === 'PENDING').length;
  const completedTasks = allTasks.filter(t => t.status === 'COMPLETED').length;

  const handleAction = async (id: string, approved: boolean) => {
    const req = allLeaves.find(lr => lr.id === id);
    if (!req) return;
    let newStatus = req.status;
    let newApprovals = req.approvals || [];
    if (!approved) {
      newStatus = 'Rejected';
    } else {
      newApprovals = [...newApprovals, { role: UserRole.FACULTY, timestamp: new Date().toISOString(), approved: true }];
      const hasParent = newApprovals.some((a: any) => a.role === UserRole.PARENT);
      const hasFaculty = newApprovals.some((a: any) => a.role === UserRole.FACULTY);
      const hasWarden = newApprovals.some((a: any) => a.role === UserRole.WARDEN);
      if (hasParent && hasFaculty && hasWarden) newStatus = 'Approved';
    }
    setAllLeaves(prev => prev.map(lr => lr.id === id ? { ...lr, status: newStatus, approvals: newApprovals } : lr));
    try {
      await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, approvals: newApprovals })
      });
    } catch (e) { console.warn('Cloud update failed'); }
    showToast(approved ? 'Leave application approved!' : 'Leave application rejected!', approved ? 'success' : 'error');
  };

  const tabs = [
    { id: 'mentees' as const, label: 'Mentee Details', icon: '👥' },
    { id: 'tasks' as const, label: 'Task Status', icon: '📋' },
    { id: 'leaves' as const, label: 'Leave Approval', icon: '⏳' },
    { id: 'analysis' as const, label: 'Analysis', icon: '📊' },
    { id: 'interact' as const, label: 'Parent Messages', icon: '💬' },
  ];

  return (
    <div className="space-y-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ToastComponent />
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
        {tabs.map(t => (
          <button key={t.id} onClick={() => navigate(`/mentor/${t.id}`)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              activeTab === t.id ? 'bg-white/60 shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-800 hover:bg-white/30'
            }`}
          >
            <span>{t.icon}</span>{t.label}
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
                <GlassButton 
                  onClick={() => handleAction(lr.id, false)}
                  variant="ghost" 
                  className="text-rose-600 hover:bg-rose-50 border border-rose-200"
                >
                  Reject
                </GlassButton>
                <GlassButton 
                  onClick={() => handleAction(lr.id, true)}
                  variant="primary" 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-none shadow-[0_5px_20px_rgba(16,185,129,0.3)]"
                >
                  Approve
                </GlassButton>
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

      {/* ── Parent Interaction ── */}
      {activeTab === 'interact' && (
        <GlassCard variant="light" className="p-0 overflow-hidden flex h-[500px]">
          {/* Sidebar logic - List all parents. Simplified to first parent for demo */}
          <div className="w-1/3 border-r border-white/40 bg-white/20 p-4 space-y-2 overflow-y-auto no-scrollbar">
            <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest pl-2 mb-4">Student Parents</h3>
            {parents.map(p => (
              <div key={p.id} className="p-3 bg-white/40 rounded-xl hover:bg-white/60 cursor-pointer transition-colors flex items-center gap-3">
                <img src={p.avatar} className="w-10 h-10 rounded-full border border-white" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{p.name}</p>
                </div>
              </div>
            ))}
            {parents.length === 0 && <p className="text-sm text-slate-400 pl-2">No parents found.</p>}
          </div>

          {/* Chat Pane */}
          {parents.length > 0 ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-white/40 bg-white/10">
              <h2 className="font-bold text-slate-800">Chat with {parents[0].name}</h2>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar flex flex-col">
              {JSON.parse(localStorage.getItem('opas_messages') || '[]')
                .filter((m: any) => (m.sender_id === user.id && m.receiver_id === parents[0].id) || (m.sender_id === parents[0].id && m.receiver_id === user.id))
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
                id="mentorMessageInput"
                placeholder="Type your reply..."
                className="flex-1 bg-white/50 border border-white/60 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const msgs = JSON.parse(localStorage.getItem('opas_messages') || '[]');
                    msgs.push({
                      id: Date.now().toString(),
                      sender_id: user.id,
                      receiver_id: parents[0].id,
                      text: e.currentTarget.value.trim(),
                      timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('opas_messages', JSON.stringify(msgs));
                    e.currentTarget.value = '';
                    window.dispatchEvent(new Event('storage'));
                  }
                }}
              />
              <GlassButton variant="primary" onClick={() => {
                const input = document.getElementById('mentorMessageInput') as HTMLInputElement;
                if (input && input.value.trim()) {
                  const msgs = JSON.parse(localStorage.getItem('opas_messages') || '[]');
                  msgs.push({
                    id: Date.now().toString(),
                    sender_id: user.id,
                    receiver_id: parents[0].id,
                    text: input.value.trim(),
                    timestamp: new Date().toISOString()
                  });
                  localStorage.setItem('opas_messages', JSON.stringify(msgs));
                  input.value = '';
                  window.dispatchEvent(new Event('storage'));
                }
              }}>Send</GlassButton>
            </div>
          </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              No conversations available.
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};

export default MentorDashboard;
