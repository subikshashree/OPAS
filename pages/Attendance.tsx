import React, { useState } from 'react';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { GlassCard, GlassButton } from '../components/ui';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('CS-A');
  const [marked, setMarked] = useState<Record<string, 'P' | 'A' | 'OD'>>({
    'CS2024001': 'P',
    'CS2024002': 'P',
    'CS2024003': 'A',
    'CS2024004': 'P',
  });

  const students = [
    { id: 'CS2024001', name: 'Alex Johnson', attendance: 85 },
    { id: 'CS2024002', name: 'Brittany Smith', attendance: 92 },
    { id: 'CS2024003', name: 'Carlos Diaz', attendance: 71 },
    { id: 'CS2024004', name: 'David Wilson', attendance: 88 },
  ];

  if (!user?.roles.includes(UserRole.FACULTY) && !user?.roles.includes(UserRole.ADMIN)) {
    return <div className="p-8 text-center text-rose-500 font-bold">Access Denied: Clearance required</div>;
  }

  const toggleStatus = (id: string, status: 'P' | 'A' | 'OD') => {
    setMarked(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/20 p-6 rounded-3xl border border-white/40 backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Active Roster Array</h1>
          <p className="text-slate-500 font-medium mt-1">Course: Operating Systems • Sync Date: Oct 24, 2024</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="glass-input cursor-pointer font-bold uppercase tracking-widest text-xs h-12 py-0 px-4 pr-8"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option>CS-A</option>
            <option>CS-B</option>
            <option>IT-A</option>
          </select>
          <GlassButton variant="primary">
            Sync Array
          </GlassButton>
        </div>
      </div>

      <GlassCard variant="light" className="p-0 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.1)] border-t border-white/60">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-[#f4f3ef]/30 backdrop-blur-md text-xs uppercase font-extrabold text-slate-500 tracking-widest border-b border-white/50">
              <tr>
                <th className="px-6 py-5">Identifier</th>
                <th className="px-6 py-5">Node Name</th>
                <th className="px-6 py-5">Validity</th>
                <th className="px-6 py-5 text-center">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-5 font-mono text-xs font-bold text-slate-400">{student.id}</td>
                  <td className="px-6 py-5 font-bold text-slate-800 text-lg">{student.name}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px] h-2.5 bg-white/50 rounded-full overflow-hidden border border-white/60 shadow-inner">
                        <div 
                          className={`h-full transition-all duration-1000 ${student.attendance < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${student.attendance}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-black ${student.attendance < 75 ? 'text-rose-600' : 'text-slate-600'}`}>{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex justify-center gap-3 bg-white/40 p-2 rounded-2xl border border-white/60 shadow-inner w-fit mx-auto">
                        <button 
                          onClick={() => toggleStatus(student.id, 'P')}
                          className={`w-10 h-10 rounded-xl font-extrabold transition-all duration-300 ${marked[student.id] === 'P' ? 'bg-emerald-500 text-white shadow-[0_5px_15px_rgba(16,185,129,0.4)] scale-105' : 'bg-white text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 shadow-sm border border-slate-100'}`}
                        >P</button>
                        <button 
                          onClick={() => toggleStatus(student.id, 'A')}
                          className={`w-10 h-10 rounded-xl font-extrabold transition-all duration-300 ${marked[student.id] === 'A' ? 'bg-rose-500 text-white shadow-[0_5px_15px_rgba(244,63,94,0.4)] scale-105' : 'bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-500 shadow-sm border border-slate-100'}`}
                        >A</button>
                        <button 
                          onClick={() => toggleStatus(student.id, 'OD')}
                          className={`w-10 h-10 rounded-xl font-extrabold transition-all duration-300 ${marked[student.id] === 'OD' ? 'bg-indigo-500 text-white shadow-[0_5px_15px_rgba(99,102,241,0.4)] scale-105' : 'bg-white text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 shadow-sm border border-slate-100'}`}
                        >OD</button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default Attendance;
