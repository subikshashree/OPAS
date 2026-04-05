import React, { useState } from 'react';
import { useAuth } from '../App';
import { UserRole, LeaveType } from '../types';
import { GlassCard, GlassButton, GlassInput, GlassBadge } from '../components/ui';
import { getWorkflowSteps } from '../hooks/useLeaveWorkflow';

const LeaveForm: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'SICK' as LeaveType,
    startDate: '',
    endDate: '',
    reason: '',
  });

  if (!user?.roles.includes(UserRole.STUDENT)) {
    return (
      <div className="p-8 text-center text-rose-500 font-bold bg-rose-50 rounded-3xl">
        Only students can apply for leave.
      </div>
    );
  }

  const isHosteler = user.isHosteler || false;
  const workflowSteps = getWorkflowSteps(formData.type, isHosteler);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${formData.type.replace('_', ' ')} request submitted successfully!\nWorkflow: ${workflowSteps.map(s => s.label).join(' → ')}`);
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
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Start Date</label>
              <GlassInput type="date" required value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">End Date</label>
              <GlassInput type="date" required value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
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

          {/* Workflow Visualization */}
          <div className="mt-6 p-5 bg-indigo-500/5 rounded-2xl border border-indigo-200/50 flex flex-col gap-3">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Approval Pipeline</h4>
            {workflowSteps.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">
                {formData.type === 'SICK' && !isHosteler 
                  ? '⚠ Sick leave is only for Hostel students. Dayscholar sick leaves are handled through the office.' 
                  : 'No approvals required.'}
              </p>
            ) : (
              <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm font-semibold text-slate-600 flex-wrap">
                <span className="px-3 py-1 bg-blue-50/50 rounded-lg text-blue-700 font-bold text-[10px] uppercase">You Submit</span>
                {workflowSteps.map((step, i) => (
                  <React.Fragment key={step.label}>
                    <span className="text-indigo-300">→</span>
                    <span className="px-3 py-1 bg-white/40 rounded-lg shadow-sm border border-white/50 text-indigo-700">{step.label}</span>
                  </React.Fragment>
                ))}
                <span className="text-indigo-300">→</span>
                <span className="px-3 py-1 bg-emerald-50/50 rounded-lg text-emerald-700 font-bold text-[10px] uppercase">✓ Approved</span>
              </div>
            )}
            {formData.type === 'SICK' && <p className="text-[10px] text-slate-400 font-medium mt-1">⏱ Maximum duration: 8 hours</p>}
          </div>

          <GlassButton 
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            disabled={formData.type === 'SICK' && !isHosteler}
          >
            Submit Application
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  );
};

export default LeaveForm;
