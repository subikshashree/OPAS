
import React, { useState } from 'react';
import { useAuth } from '../App';
import { UserRole } from '../types';

interface LeaveFormProps {
  forceType?: 'REGULAR' | 'SICK' | 'OD';
}

const LeaveForm: React.FC<LeaveFormProps> = ({ forceType }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: forceType || 'REGULAR',
    startDate: '',
    endDate: '',
    reason: '',
    attachment: null as File | null
  });

  // Fixed: Checking multiple roles correctly using includes()
  if (!user?.roles.includes(UserRole.STUDENT)) {
    return <div className="p-8 text-center text-red-500 font-bold">Only students can apply for leave</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Application for ${formData.type} submitted successfully! Workflow initiated.`);
    // In real app, API call here
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
          <h1 className="text-3xl font-bold">New Application</h1>
          <p className="text-blue-100 opacity-80">Submit your leave or OD request for approval</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Type of Request</label>
              <select 
                className="w-full border-2 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all disabled:bg-gray-50"
                value={formData.type}
                disabled={!!forceType}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="REGULAR">Regular Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="OD">On Duty (OD)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Attachment (Optional)</label>
              <input 
                type="file" 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Start Date</label>
              <input 
                type="date" 
                required
                className="w-full border-2 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">End Date</label>
              <input 
                type="date" 
                required
                className="w-full border-2 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Reason / Description</label>
            <textarea 
              rows={4}
              required
              placeholder="Provide a detailed reason for your request..."
              className="w-full border-2 rounded-xl px-4 py-3 focus:border-blue-500 outline-none transition-all resize-none"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Automated Workflow Path</h4>
             <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="font-bold text-blue-600">Parent</span>
                <span>→</span>
                <span className="font-bold text-blue-600">Mentor</span>
                {formData.type === 'OD' && (
                  <>
                    <span>→</span>
                    <span className="font-bold text-blue-600">HOD</span>
                  </>
                )}
                {formData.type === 'REGULAR' && user?.isHosteler && (
                  <>
                    <span>→</span>
                    <span className="font-bold text-blue-600">Warden</span>
                  </>
                )}
             </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;
