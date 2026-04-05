import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { MOCK_USERS_LIST } from '../constants';
import { UserRole } from '../types';
import { GlassCard, GlassButton, GlassInput, FloatingSphere } from '../components/ui';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      let foundUser = null;
      const normalizedId = userId.toLowerCase();

      if (normalizedId === 'student') {
        foundUser = MOCK_USERS_LIST.find(u => u.roles.includes(UserRole.STUDENT));
      } else if (normalizedId === 'mentor' || normalizedId === 'faculty') {
        foundUser = MOCK_USERS_LIST.find(u => u.roles.includes(UserRole.FACULTY));
      } else if (normalizedId === 'parent') {
        foundUser = MOCK_USERS_LIST.find(u => u.roles.includes(UserRole.PARENT));
      } else if (normalizedId === 'hod') {
        foundUser = MOCK_USERS_LIST.find(u => u.roles.includes(UserRole.HOD));
      } else if (normalizedId === 'warden') {
        foundUser = MOCK_USERS_LIST.find(u => u.roles.includes(UserRole.WARDEN));
      } else if (normalizedId === 'admin') {
        foundUser = MOCK_USERS_LIST.find(u => u.roles.includes(UserRole.ADMIN));
      } else {
        foundUser = MOCK_USERS_LIST.find(u => 
          u.id.toLowerCase() === normalizedId || 
          u.email.toLowerCase() === normalizedId
        );
      }

      if (foundUser && password === 'password') {
        login(foundUser);
        navigate('/');
      } else {
        setError('Invalid credentials. Try "student", "mentor", "parent", "hod", "warden", or "admin" with "password".');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#e8e5df] font-sans">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-purple-400/40 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-8%] w-[55%] h-[55%] bg-indigo-500/30 rounded-full blur-[120px]" />
         <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-cyan-400/25 rounded-full blur-[100px]" />
         <div className="absolute bottom-[20%] left-[10%] w-[25%] h-[25%] bg-pink-300/20 rounded-full blur-[100px]" />
      </div>

      <FloatingSphere size={200} color="bg-indigo-400" delay={0} className="-top-12 -left-12" />
      <FloatingSphere size={120} color="bg-cyan-400" delay={2} className="bottom-20 right-20" />
      <FloatingSphere size={80} color="bg-purple-400" delay={4} className="top-40 right-40" />

      <div className="w-full max-w-md p-6 relative z-10 animate-in zoom-in-95 duration-700">
        <GlassCard variant="light" className="p-8 md:p-10 text-center relative overflow-visible">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] flex items-center justify-center text-white text-4xl font-black shadow-[0_10px_30px_rgba(99,102,241,0.4)] border-4 border-[#f4f3ef]/50 backdrop-blur-md">
              O
            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">OPAS Workspace</h1>
            <p className="text-sm text-slate-500 font-medium mt-2">Premium Operating Interface</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">System Identity</label>
              <GlassInput
                type="text"
                placeholder="e.g. parent, hod, warden..."
                icon={<span>👤</span>}
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Security Code</label>
              <GlassInput
                type="password"
                placeholder="••••••••"
                icon={<span>🔒</span>}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 text-rose-600 p-3 rounded-xl text-xs font-bold border border-red-500/20 backdrop-blur-md animate-shake">
                {error}
              </div>
            )}

            <GlassButton 
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                  Authenticating...
                </>
              ) : 'Access Terminal'}
            </GlassButton>
          </form>

          <div className="mt-8 grid grid-cols-3 gap-2 text-center text-[10px] font-bold uppercase tracking-tighter">
             {['student', 'mentor', 'parent', 'hod', 'warden', 'admin'].map(r => (
               <div key={r} className="bg-white/30 p-2 rounded-lg border border-white/50 text-indigo-900/60 shadow-sm">{r}</div>
             ))}
          </div>
        </GlassCard>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default Login;
