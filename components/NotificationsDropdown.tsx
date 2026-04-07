import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../App';
import { UserRole, LeaveRequest, Task } from '../types';
import { MOCK_LEAVE_REQUESTS, MOCK_TASKS } from '../constants';

const NotificationsDropdown: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{icon: string, title: string, desc: string}>>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse contextual alerts based on user role
  useEffect(() => {
    if (!user) return;

    try {
      const rawLeaves = localStorage.getItem('opas_leaves');
      const leaves: LeaveRequest[] = rawLeaves ? JSON.parse(rawLeaves) : MOCK_LEAVE_REQUESTS;
      
      const rawTasks = localStorage.getItem('opas_tasks');
      const tasks: Task[] = rawTasks ? JSON.parse(rawTasks) : MOCK_TASKS;

      const alerts = [];

      if (user.roles.includes(UserRole.STUDENT)) {
        const myTasks = tasks.filter(t => t.assignedTo === user.id && t.status !== 'COMPLETED');
        if (myTasks.length > 0) alerts.push({ icon: '📋', title: 'Pending Academic Tasks', desc: `You have ${myTasks.length} incomplete tasks assigned.` });

        const myLeaves = leaves.filter(l => l.studentId === user.id && ['Approved', 'Rejected', 'APPROVED', 'REJECTED'].includes(l.status));
        if (myLeaves.length > 0) alerts.push({ icon: '✅', title: 'Leave Updates', desc: `You have ${myLeaves.length} resolved leave requests to view.` });
      }

      if (user.roles.includes(UserRole.FACULTY)) {
        const pendingMenteeLeaves = leaves.filter(l => l.status === 'Pending' && !l.approvals?.some((a: any) => a.role === UserRole.FACULTY));
        if (pendingMenteeLeaves.length > 0) alerts.push({ icon: '⏳', title: 'Action Required', desc: `You have ${pendingMenteeLeaves.length} leave requests awaiting your authorization.` });
      }

      if (user.roles.includes(UserRole.PARENT)) {
        const wardLeaves = leaves.filter(l => l.status === 'Pending' && !l.approvals?.some((a: any) => a.role === UserRole.PARENT));
        if (wardLeaves.length > 0) alerts.push({ icon: '👨‍👩‍👦', title: 'Ward Leave Request', desc: `Your ward has ${wardLeaves.length} leave request(s) awaiting your consent.` });
      }

      if (user.roles.includes(UserRole.WARDEN)) {
        const pendingWardenLeaves = leaves.filter(l => l.status === 'Pending' && !l.approvals?.some((a: any) => a.role === UserRole.WARDEN));
        if (pendingWardenLeaves.length > 0) alerts.push({ icon: '🏢', title: 'Hostel Leaves', desc: `There are ${pendingWardenLeaves.length} pending hostel outpass requests.` });
      }

      if (user.roles.includes(UserRole.HOD)) {
        const pendingHodLeaves = leaves.filter(l => l.status === 'Pending' && !l.approvals?.some((a: any) => a.role === UserRole.HOD));
        if (pendingHodLeaves.length > 0) alerts.push({ icon: '🎓', title: 'Department Leaves', desc: `${pendingHodLeaves.length} leave requests await HoD review.` });
      }

      if (user.roles.includes(UserRole.ADMIN)) {
        const totalPending = leaves.filter(l => l.status === 'Pending' || !['Approved', 'Rejected', 'APPROVED', 'REJECTED'].includes(l.status)).length;
        if (totalPending > 0) alerts.push({ icon: '⚠️', title: 'System Overview', desc: `${totalPending} leaves are in authorization queues system-wide.` });
      }

      // Add dummy fallback if no real actionable alerts exist
      if (alerts.length === 0) {
        alerts.push({ icon: '⚙️', title: 'System Operational', desc: 'No outstanding actions required at this time.' });
      }

      setNotifications(alerts);
    } catch(e) {
      console.error(e);
      setNotifications([{ icon: '⚙️', title: 'System', desc: 'Alerts unavailable.' }]);
    }
  }, [user]);

  // Click Outside to Close mechanism
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const hasActionableAlerts = notifications.some(n => n.icon !== '⚙️');

  return (
    <div className="relative z-50 flex" ref={dropdownRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`relative p-2 rounded-xl transition-colors ${isOpen ? 'bg-white/60 border-indigo-200' : 'bg-white/30 hover:bg-white/50 border-white/40'} border`}
      >
        {hasActionableAlerts && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
        🔔
      </button>
      
      {isOpen && (
        <div className="absolute top-12 right-0 w-80 bg-white/95 backdrop-blur-xl border border-white shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
            <h3 className="font-extrabold text-slate-800 tracking-tight">System Alerts</h3>
            {hasActionableAlerts && (
               <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md border border-indigo-200/50">{notifications.filter(n => n.icon !== '⚙️').length} Actionable</span>
            )}
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar divide-y divide-slate-100">
            {notifications.map((alert, idx) => (
              <div key={idx} className="p-4 hover:bg-indigo-50/40 transition-colors cursor-pointer group flex items-start gap-3">
                <span className="text-xl bg-white p-2 rounded-xl border border-slate-100 shadow-sm group-hover:bg-indigo-100/50 group-hover:border-indigo-200 transition-colors">{alert.icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 tracking-tight">{alert.title}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 leading-snug">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-slate-100 text-center bg-slate-50/80">
            <button 
              className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Close Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
