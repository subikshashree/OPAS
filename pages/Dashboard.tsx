
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { UserRole } from '../types';
import { MOCK_ACADEMIC_DATA } from '../constants';
import { getSmartAcademicAdvice, summarizeApprovals } from '../geminiService';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [advice, setAdvice] = useState<string>("Loading academic insights...");
  const [summary, setSummary] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    
    if (user.roles.includes(UserRole.STUDENT)) {
      getSmartAcademicAdvice(8.67, 85).then(setAdvice);
    } else {
      summarizeApprovals(4).then(setSummary);
    }
  }, [user]);

  if (!user) return null;

  const roles = user.roles;
  const isStudent = roles.includes(UserRole.STUDENT);
  const isFaculty = roles.includes(UserRole.FACULTY);
  const isParent = roles.includes(UserRole.PARENT);
  const isWarden = roles.includes(UserRole.WARDEN);
  const isHod = roles.includes(UserRole.HOD);
  const isAdmin = roles.includes(UserRole.ADMIN);

  const renderStudentDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-3">Welcome back, {user?.name}!</h1>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 inline-block">
            <p className="text-blue-50 text-base md:text-lg font-medium">✨ <span className="italic">AI Academic Advisor:</span> {advice}</p>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none transform rotate-12">
          <span className="text-[200px] font-black">STUDENT</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Current CGPA" value="8.67" subValue="+0.14 since last sem" icon="📈" color="text-blue-600" />
        <StatCard title="Attendance" value="85%" subValue="Target: 75%" icon="📅" color="text-emerald-600" />
        <StatCard title="Pending Requests" value="2" subValue="1 Leave, 1 OD" icon="📝" color="text-amber-600" />
        <StatCard title="Achievements" value="12" subValue="New: Hackathon Winner" icon="🏆" color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800 uppercase tracking-tight">
            <span className="p-2 bg-blue-50 rounded-lg text-blue-600">📊</span> Semester Performance
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_ACADEMIC_DATA}>
                <defs>
                  <linearGradient id="colorSgpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} />
                <Area type="monotone" dataKey="sgpa" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSgpa)" strokeWidth={4} />
                <Line type="monotone" dataKey="cgpa" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black mb-8 text-slate-800 uppercase tracking-tight">Quick Actions</h2>
          <div className="space-y-4">
             <Link to="/leave" className="w-full py-4 px-6 bg-blue-50 text-blue-700 rounded-2xl font-bold flex items-center justify-between hover:bg-blue-100 transition-all active:scale-[0.98]">
               <span>Apply for Leave</span>
               <span className="text-lg">→</span>
             </Link>
             <Link to="/od" className="w-full py-4 px-6 bg-purple-50 text-purple-700 rounded-2xl font-bold flex items-center justify-between hover:bg-purple-100 transition-all active:scale-[0.98]">
               <span>Submit OD Request</span>
               <span className="text-lg">→</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStaffDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
            {isParent ? `Ward Monitoring: Alex Johnson` : `Hello, ${user?.name}`}
          </h1>
          <div className="inline-flex items-center gap-4 bg-indigo-50 p-5 rounded-2xl border-l-8 border-indigo-500">
            <span className="text-2xl">💡</span>
            <p className="text-indigo-900 font-bold italic text-lg leading-relaxed">
              "{summary || "System analysis indicates several pending tasks requiring your expert attention today."}"
            </p>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none transform -rotate-12">
          <span className="text-[180px] font-black">{roles[0]}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isParent ? (
          <>
            <StatCard title="Ward Attendance" value="85%" subValue="Status: On Track" icon="📅" color="text-emerald-600" />
            <StatCard title="Current CGPA" value="8.67" subValue="Semester 4" icon="📊" color="text-blue-600" />
            <StatCard title="Active Leaves" value="1" subValue="Pending Approval" icon="📝" color="text-amber-600" />
          </>
        ) : isWarden ? (
          <>
            <StatCard title="Students in Hostel" value="482" subValue="92% Occupancy" icon="🏠" color="text-indigo-600" />
            <StatCard title="Night Leave Requests" value="14" subValue="Pending Action" icon="🚪" color="text-amber-600" />
            <StatCard title="Gate Passes Issued" value="28" subValue="Today" icon="🎟️" color="text-blue-600" />
          </>
        ) : isHod ? (
          <>
            <StatCard title="Dept. Attendance" value="91%" subValue="Avg. This Month" icon="🏢" color="text-emerald-600" />
            <StatCard title="OD Requests" value="8" subValue="Requires Approval" icon="🎓" color="text-purple-600" />
            <StatCard title="Staff Presence" value="12/15" subValue="Currently Active" icon="👥" color="text-indigo-600" />
          </>
        ) : (
          <>
            <StatCard title="Total Students" value="124" subValue="Mentoring: 32" icon="👥" color="text-indigo-600" />
            <StatCard title="Avg. Attendance" value="82%" subValue="Class CS-A" icon="✅" color="text-emerald-600" />
            <StatCard title="Pending Approvals" value="5" subValue="3 Leave, 2 OD" icon="⏳" color="text-amber-600" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black mb-6 text-slate-800 uppercase tracking-tight flex items-center gap-3">
             <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">{isWarden ? '🏠' : '📅'}</span> {isWarden ? 'Hostel Activity' : isParent ? 'Academic Record' : 'Recent Actions'}
          </h2>
          <div className="space-y-4">
             {isParent ? (
               MOCK_ACADEMIC_DATA.map((item, i) => (
                 <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700">Semester {item.semester}</span>
                    <span className="font-black text-blue-600">{item.sgpa} SGPA</span>
                 </div>
               ))
             ) : (
               [
                { text: 'Leave Approval Needed', time: '10m ago', student: 'Alex Johnson' },
                { text: 'OD Request Received', time: '1h ago', student: 'Sarah Wilson' },
                { text: 'Weekly Report Ready', time: '3h ago', student: 'System' },
               ].map((act, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div>
                     <p className="font-bold text-slate-800">{act.text}</p>
                     <p className="text-xs text-slate-500 font-bold italic">{act.student}</p>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase">{act.time}</span>
                </div>
               ))
             )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-black mb-6 text-slate-800 uppercase tracking-tight flex items-center gap-3">
             <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">⚡</span> Live Insights
          </h2>
          <div className="space-y-6">
            <div className="p-5 bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-100">
               <p className="text-sm font-bold text-blue-900 leading-relaxed">
                 {isWarden ? "System Alert: 3 students have not checked back into the hostel past curfew." :
                  isHod ? "Performance Alert: 3rd Year IT average attendance dropped by 4% this week." :
                  isParent ? "Academic Note: Alex has a paper presentation scheduled for tomorrow." :
                  "Notification: Attendance for 'Operating Systems' has been marked for all sections."}
               </p>
            </div>
            <Link 
              to={isHod || isWarden || isParent ? "/approvals" : "/attendance"} 
              className="block w-full text-center py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
            >
              {isParent ? "View All Documents" : "Enter Approval Queue"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-10">
      {isStudent && renderStudentDashboard()}
      {!isStudent && renderStaffDashboard()}
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, subValue: string, icon: string, color: string }> = ({ title, value, subValue, icon, color }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-slate-50 rounded-2xl text-2xl">{icon}</div>
      <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
    </div>
    <div className="space-y-1">
      <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{title}</span>
      <div className={`text-4xl font-black ${color} tracking-tight`}>{value}</div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-50">
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{subValue}</div>
    </div>
  </div>
);

export default Dashboard;
