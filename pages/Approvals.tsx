
import React, { useState } from 'react';
import { useAuth } from '../App';
import { UserRole, LeaveRequest } from '../types';

const MOCK_REQUESTS: LeaveRequest[] = [
  {
    id: 'req1',
    studentId: 'CS2024001',
    studentName: 'Alex Johnson',
    startDate: '2024-10-25',
    endDate: '2024-10-26',
    type: 'REGULAR',
    reason: 'Family function in hometown',
    status: 'PENDING',
    approvals: []
  },
  {
    id: 'req2',
    studentId: 'CS2024004',
    studentName: 'David Wilson',
    startDate: '2024-10-25',
    endDate: '2024-10-25',
    type: 'OD',
    reason: 'Inter-college Technical Symposium Paper Presentation',
    status: 'PARENT_APPROVED',
    approvals: [{ role: UserRole.PARENT, timestamp: new Date().toISOString(), approved: true }]
  },
  {
    id: 'req3',
    studentId: 'CS2024001',
    studentName: 'Alex Johnson',
    startDate: '2024-10-24',
    endDate: '2024-10-25',
    type: 'SICK',
    reason: 'Severe fever and exhaustion',
    status: 'PENDING',
    approvals: []
  }
];

const Approvals: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>(MOCK_REQUESTS);

  const handleAction = (id: string, approved: boolean) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    alert(`Request ${approved ? 'Approved' : 'Rejected'} successfully! Workflow triggered.`);
  };

  const filteredRequests = requests.filter(req => {
    // Fixed: Checking multiple roles correctly using includes()
    if (user?.roles.includes(UserRole.PARENT)) return true; // Parent sees everything for their ward
    if (user?.roles.includes(UserRole.FACULTY)) return req.status === 'PENDING' || req.status === 'PARENT_APPROVED';
    if (user?.roles.includes(UserRole.WARDEN)) return req.type === 'SICK' || req.type === 'REGULAR';
    if (user?.roles.includes(UserRole.HOD)) return req.type === 'OD' && req.status === 'MENTOR_APPROVED';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pending Approvals</h1>
        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
          {filteredRequests.length} Pending Actions
        </span>
      </div>

      <div className="space-y-4">
        {filteredRequests.length > 0 ? filteredRequests.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                 <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                   req.type === 'OD' ? 'bg-purple-100 text-purple-700' : 
                   req.type === 'SICK' ? 'bg-red-100 text-red-700' : 
                   'bg-blue-100 text-blue-700'
                 }`}>
                   {req.type}
                 </span>
                 <h3 className="font-bold text-lg">{req.studentName}</h3>
                 <span className="text-gray-400 text-sm">{req.studentId}</span>
              </div>
              <p className="text-gray-600 text-sm">Reason: <span className="font-medium text-gray-800">{req.reason}</span></p>
              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">📅 {req.startDate} to {req.endDate}</span>
                <span className="flex items-center gap-1">⏱️ Applied: 2 hours ago</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                 <div className="flex -space-x-2">
                    <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${req.approvals.length > 0 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>P</div>
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">M</div>
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">W</div>
                 </div>
                 <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Workflow Trail</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleAction(req.id, false)}
                className="px-6 py-2 border-2 border-red-500 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-colors"
              >
                Reject
              </button>
              <button 
                onClick={() => handleAction(req.id, true)}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 shadow-md shadow-emerald-200 transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        )) : (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-lg font-bold text-gray-700">All clear!</h3>
            <p className="text-gray-400">No pending requests for your approval at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
