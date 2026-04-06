import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole, LeaveType } from '../types';
import { GlassCard, GlassButton, GlassInput, GlassBadge } from '../components/ui';
import { getWorkflowSteps } from '../hooks/useLeaveWorkflow';

const LeaveForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'SICK' as LeaveType,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    reason: '',
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user?.roles.includes(UserRole.STUDENT)) {
    return (
      <div className="p-8 text-center text-rose-500 font-bold bg-rose-50 rounded-3xl">
        Only students can apply for leave.
      </div>
    );
  }

  const isHosteler = user.isHosteler || false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Build the new LeaveRequest object
    const newLeave = {
      id: 'leave_' + Math.floor(Math.random() * 1000000),
      userId: user.id,             // Internal system ID for reliable matching
      studentId: user.studentId || user.id,
      studentName: user.name,
      wardenId: user.wardenId,     // Embed for routing
      mentorId: user.mentorId,     // Embed for routing
      parentId: user.parentId,     // Embed for routing
      isHosteler: isHosteler,      // Needed for workflow engine
      startDate: formData.startDate,
      startTime: formData.startTime,
      endDate: formData.endDate,
      endTime: formData.endTime,
      type: formData.type,
      reason: formData.reason,
      status: 'Pending',
      approvals: [],
      // Ensure applied time perfectly matches what the user saw
      appliedAt: currentTime.toISOString()
    };

    // Send to Cloud Database
    fetch(`${import.meta.env.VITE_API_URL || '/api/opas'}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLeave),
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to post leave');
      // For immediate fallback viewing in the exact same window
      const existingLeaves = JSON.parse(localStorage.getItem('opas_my_leaves') || '[]');
      localStorage.setItem('opas_my_leaves', JSON.stringify([newLeave, ...existingLeaves]));
      
      // Navigate back to the dashboard leave portal tab
      navigate('/', { state: { targetTab: 'leave' } });
    })
    .catch(err => {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      // Fallback: Optionally surface error toaster here
    });
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <GlassCard variant="light" className="p-0 overflow-hidden border-t border-l border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        <div className="p-8 bg-gradient-to-br from-indigo-500/20 to-purple-600/10 border-b border-white/40">
          <GlassBadge variant="info" className="mb-3">New Submission</GlassBadge>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Leave / OD Request</h1>
          <p className="text-indigo-900/60 font-medium mt-1">Submit your form to trigger the automated approval pipeline.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Leave Type</label>
              <select 
                className="glass-input cursor-pointer appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as LeaveType})}
              >
                <option value="SICK">Sick Leave (Max 8 hrs)</option>
                <option value="NORMAL">Normal / Regular Leave</option>
                <option value="SPECIAL_PERMISSION">Special Permission</option>
                <option value="OD">On Duty (OD)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Residential Status</label>
              <div className="glass-input flex items-center gap-3 cursor-default">
                <GlassBadge variant={isHosteler ? 'info' : 'default'}>
                  {isHosteler ? 'HOSTEL' : 'DAYSCHOLAR'}
                </GlassBadge>
                <span className="text-sm text-slate-600 font-medium">
                  {isHosteler ? `Room ${user.roomNumber} • ${user.hostelBlock}` : `Bus ${user.busNumber}`}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Start Date</label>
                <GlassInput type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">From Time</label>
                <GlassInput type="time" required value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">End Date</label>
                <GlassInput type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">To Time</label>
                <GlassInput type="time" required value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Reason</label>
            <textarea 
              rows={4} required
              placeholder="Provide a detailed reason for your request..."
              className="glass-input resize-none"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          {/* Workflow Visualization removed for simple parallel approval */}

          <div className="flex items-center justify-between mt-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-200">
             <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">System Record Apply Time</p>
                <p className="font-mono text-sm font-bold text-slate-700 tracking-tight">{currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}</p>
             </div>
             <div>
                <p className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest text-right">Time-Synched</p>
                <p className="text-xs text-slate-400 font-medium">Auto-stamped on submit</p>
             </div>
          </div>

          <GlassButton 
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  );
};

export default LeaveForm;
