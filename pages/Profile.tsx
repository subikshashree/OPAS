import React from 'react';
import { useAuth } from '../App';
import { GlassCard, GlassBadge, FloatingSphere } from '../components/ui';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <FloatingSphere size={200} color="bg-indigo-400" delay={0} className="-top-10 -right-20" />
      <FloatingSphere size={150} color="bg-cyan-300" delay={2} className="bottom-20 -left-20" />

      <GlassCard variant="light" className="flex flex-col md:flex-row items-center md:items-start gap-8 z-10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <img src={user?.avatar} className="relative w-36 h-36 rounded-full border-4 border-white object-cover shadow-xl" alt="Profile" />
          <button className="absolute bottom-2 right-2 bg-white p-2.5 rounded-full shadow-lg hover:bg-slate-50 transition-transform hover:scale-110 border border-slate-100 z-20">
            <span className="text-xl leading-none">✏️</span>
          </button>
        </div>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">{user?.name}</h1>
            <div className="flex flex-wrap gap-2 justify-center">
              {user?.roles.map(r => (
                 <GlassBadge key={r} variant="info" className="px-4 py-1.5">{r}</GlassBadge>
              ))}
            </div>
          </div>
          <p className="text-slate-500 font-medium text-lg">{user?.email}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <div className="text-center bg-white/40 px-6 py-3 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md">
               <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Status</p>
               <p className="font-extrabold text-emerald-600 mt-1">Active Element</p>
            </div>
            <div className="text-center bg-white/40 px-6 py-3 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md">
               <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Initialization</p>
               <p className="font-extrabold text-slate-700 mt-1">Aug 2024</p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
        <GlassCard variant="light" className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
            <span className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-600">📞</span> 
            Profile Vectors
          </h2>
          <div className="space-y-5">
            <div className="p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors hover:bg-white/50">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Primary Node</p>
              <p className="font-semibold text-slate-700">+1 234 567 890</p>
            </div>
            <div className="p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors hover:bg-white/50">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Alias Email</p>
              <p className="font-semibold text-slate-700">personal.mail@provider.com</p>
            </div>
            <div className="p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors hover:bg-white/50">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Sector Address</p>
              <p className="font-semibold text-slate-700">123 College Ave, Campus West, City, 56789</p>
            </div>
          </div>
        </GlassCard>

        {user?.roles.includes('STUDENT') && (
          <GlassCard variant="light" className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
              <span className="p-2.5 bg-purple-500/10 rounded-xl text-purple-600">🔗</span> 
              Identity Links
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/50 shadow-sm hover:translate-x-1 transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg shadow-inner">👤</span>
                  <span className="font-bold text-slate-700">Mentor Node</span>
                </div>
                <GlassBadge variant="success">VERIFIED</GlassBadge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/50 shadow-sm hover:translate-x-1 transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg shadow-inner">🏠</span>
                  <span className="font-bold text-slate-700">Guardian Node</span>
                </div>
                <GlassBadge variant="success">VERIFIED</GlassBadge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/50 shadow-sm hover:translate-x-1 transition-transform cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-lg shadow-inner">🚪</span>
                  <span className="font-bold text-slate-700">Hostel Warden</span>
                </div>
                <GlassBadge variant="warning">MAPPED</GlassBadge>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};

export default Profile;
