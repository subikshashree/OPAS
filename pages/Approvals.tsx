import React, { useState } from 'react';
import { useAuth } from '../App';
import { UserRole, LeaveRequest } from '../types';
import { GlassCard, GlassButton, GlassBadge, FloatingSphere } from '../components/ui';
import { useToast } from '../hooks/useToast';
import { canUserApprove, getNextPendingStatus } from '../hooks/useLeaveWorkflow';
import { getMentorInsight } from '../geminiService';

const InsightBox: React.FC<{ req: any }> = ({ req }) => {
  const [insight, setInsight] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Note: In a real app we'd fetch actual student attendance/cgpa
    getMentorInsight(req.studentName, 85, 8.5, req.reason).then(res => {
      setInsight(res);
      setLoading(false);
    });
  }, [req]);

  return (
    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3 mt-3 shadow-inner">
      <div className="text-xl mt-1">✨</div>
      <div className="text-sm text-slate-700">
        <span className="font-bold text-indigo-600 block text-[10px] uppercase tracking-wider mb-1">AI Recommendation</span>
        {loading ? <span className="animate-pulse">Analyzing student profile...</span> : <span className="font-medium">{insight}</span>}
      </div>
    </div>
  );
};



const Approvals: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const { showToast, ToastComponent } = useToast();
  const API_BASE = import.meta.env.VITE_API_URL || '/api/opas';

  React.useEffect(() => {
    fetch(`${API_BASE}/leaves`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          showToast('Failed to parse Cloud leaves', 'error');
        }
      })
      .catch(err => {
        showToast('Cloud API Unreachable', 'error');
      });
  }, [API_BASE]);

  const handleAction = async (id: string, approved: boolean) => {
    const reqToUpdate = requests.find(r => r.id === id);
    if (!reqToUpdate) return;

    let newStatus = reqToUpdate.status;
    let newApprovals = reqToUpdate.approvals || [];
    const role = user?.roles[0] || UserRole.ADMIN;

    if (!approved) {
      newStatus = 'Rejected' as any;
    } else {
      newApprovals = [...newApprovals, { role, approverId: user?.id || '', approverName: user?.name || '', timestamp: new Date().toISOString(), approved: true }];
      
      const hasParent = newApprovals.some(a => a.role === UserRole.PARENT);
      const hasFaculty = newApprovals.some(a => a.role === UserRole.FACULTY);
      const hasWarden = newApprovals.some(a => a.role === UserRole.WARDEN);
      
      if (hasParent && hasFaculty) {
         newStatus = 'Approved' as any;
      }
    }

    // Optimistic UI update
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, approvals: newApprovals } : r));

    try {
      const res = await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, approvals: newApprovals })
      });
      if (!res.ok) throw new Error();
      showToast(`Request ${approved ? 'Authorized' : 'Terminated'} successfully! Workflow updated.`, approved ? 'success' : 'error');
    } catch (e) {
      showToast('Cloud API rejected operation. Reverting state.', 'error');
      // Revert optimistic update
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: reqToUpdate.status, approvals: reqToUpdate.approvals } : r));
    }
  };

  const filteredRequests = requests.filter(req => {
    // 1. Relationship check
    const isMyStudent = (() => {
      if (!user) return false;
      const rUserId = String((req as any).userId);
      const rStudentId = String(req.studentId);
      
      if (user.roles.includes(UserRole.PARENT)) {
        return true; // Demo mode: let any parent test approval flows
      }
      if (user.roles.includes(UserRole.FACULTY)) {
        return true; // Demo mode
      }
      if (user.roles.includes(UserRole.WARDEN)) {
        return true; // Demo mode
      }
      return true; // HOD and Admin see everything filtered by status
    })();

    if (!isMyStudent) return false;

    // 2. Status check
    const alreadyApproved = req.approvals?.some((a: any) => a.role === user?.roles[0]);
    return req.status === 'Pending' && !alreadyApproved;
  });

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 relative z-10">
      <ToastComponent />
      <FloatingSphere size={250} color="bg-rose-400" delay={0} className="-top-20 -left-20 mix-blend-multiply opacity-20" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/20 p-6 rounded-3xl border border-white/40 backdrop-blur-md shadow-sm">
        <div>
           <GlassBadge variant="info" className="mb-2">Operational Queue</GlassBadge>
           <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Authorization Queue</h1>
        </div>
        <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border border-amber-500/30 rounded-2xl font-bold flex items-center gap-3 backdrop-blur-md shadow-inner">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          {filteredRequests.length} Actions Required
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredRequests.length > 0 ? filteredRequests.map((req, i) => (
          <GlassCard key={req.id} variant="light" className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] transition-all delay-75" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                 <GlassBadge variant={req.type === 'OD' ? 'info' : req.type === 'SICK' ? 'danger' : 'default'} className="px-3 py-1 text-sm border-2">
                   {req.type}
                 </GlassBadge>
                 <h3 className="font-bold text-xl text-slate-800">{req.studentName}</h3>
                 <span className="text-slate-400 text-xs font-black uppercase tracking-widest bg-slate-100/50 px-2 py-1 rounded-md">{req.studentId}</span>
              </div>
              
              <div className="bg-white/40 border border-white/50 p-4 rounded-xl shadow-inner mt-2">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">Reason Log</p>
                <p className="text-slate-700 font-medium">{req.reason}</p>
              </div>

              {user?.roles.includes(UserRole.FACULTY) && (
                <InsightBox req={req} />
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-indigo-50/50 px-3 py-1.5 rounded-lg">
                  <span className="text-indigo-400">📅</span> {req.startDate} to {req.endDate}
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-indigo-50/50 px-3 py-1.5 rounded-lg">
                  <span className="text-indigo-400">⏱️</span> Applied 2 hours ago
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/50">
              <GlassButton 
                variant="ghost"
                onClick={() => handleAction(req.id, false)}
                className="w-full sm:w-auto text-rose-600 hover:bg-rose-50 hover:text-rose-700 border border-transparent hover:border-rose-200"
              >
                Reject Request
              </GlassButton>
              <GlassButton 
                variant="primary"
                onClick={() => handleAction(req.id, true)}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-none shadow-[0_5px_20px_rgba(16,185,129,0.3)]"
              >
                Authorize
              </GlassButton>
            </div>
          </GlassCard>
        )) : (
          <GlassCard variant="light" className="p-16 text-center border-dashed border-2 border-indigo-200">
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Queue is Empty</h3>
            <p className="text-slate-500 font-medium">There are no pending authorization requests in your node.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default Approvals;
