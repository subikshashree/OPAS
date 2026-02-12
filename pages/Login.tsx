
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { MOCK_USERS_LIST } from '../constants';
import { UserRole } from '../types';

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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg shadow-blue-200">
              O
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">OPAS</h1>
            <p className="text-slate-400 font-medium mt-1">Online Process Automation System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">User Role or Identity</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
                <input 
                  type="text" 
                  placeholder="e.g. parent, hod, warden..." 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Security Code</label>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 grid grid-cols-2 gap-2 text-center text-[10px] font-bold uppercase tracking-tighter text-slate-400">
            <div className="bg-slate-50 p-2 rounded">student</div>
            <div className="bg-slate-50 p-2 rounded">mentor</div>
            <div className="bg-slate-50 p-2 rounded">parent</div>
            <div className="bg-slate-50 p-2 rounded">hod</div>
            <div className="bg-slate-50 p-2 rounded">warden</div>
            <div className="bg-slate-50 p-2 rounded">admin</div>
          </div>
          <p className="mt-4 text-center text-slate-300 text-xs italic">Password: "password"</p>
        </div>
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
