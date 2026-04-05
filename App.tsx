
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { UserRole, User } from './types';
import { MOCK_USERS_LIST, NAV_ITEMS } from './constants';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Approvals from './pages/Approvals';
import LeaveForm from './pages/LeaveForm';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const primaryRole = user.roles[0];
  const currentNav = NAV_ITEMS[primaryRole] || [];

  return (
    <div className="relative min-h-screen bg-[#e8e5df] overflow-hidden flex flex-col font-sans selection:bg-indigo-200">
      {/* Background Decorators — vibrant orbs visible through glass */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] bg-purple-400/40 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-8%] w-[35%] h-[45%] bg-cyan-400/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[15%] w-[40%] h-[40%] bg-blue-400/25 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] left-[50%] w-[30%] h-[30%] bg-pink-300/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[25%] h-[25%] bg-emerald-300/20 rounded-full blur-[100px]" />
      </div>

      {/* Floating Top Navigation */}
      <header className="fixed top-4 left-4 right-4 z-50 flex justify-center">
        <nav className="glass-panel w-full max-w-6xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-[0_4px_20px_rgba(99,102,241,0.4)] border border-white/20">
                O
             </div>
             <span className="text-slate-800 font-bold text-xl tracking-tight hidden sm:block">OPAS</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 p-1 bg-white/15 rounded-2xl border border-white/25 backdrop-blur-md">
            {currentNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? "bg-white/60 shadow-sm text-indigo-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
             {/* Search */}
             <div className="hidden lg:flex relative items-center">
                <span className="absolute left-3 text-slate-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Command ⌘K" 
                  className="bg-white/40 border border-white/50 text-sm focus:bg-white/60 focus:ring-2 focus:ring-indigo-400/50 outline-none rounded-2xl pl-9 pr-4 py-2 w-48 transition-all"
                />
             </div>
             
             {/* Notifications */}
             <button className="relative p-2 rounded-xl bg-white/30 hover:bg-white/50 border border-white/40 transition-colors">
               <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
               🔔
             </button>

             {/* Profile */}
             <Link to="/profile" className="flex items-center gap-3 bg-white/30 border border-white/40 pl-2 pr-4 py-1.5 rounded-2xl cursor-pointer hover:bg-white/50 transition-colors">
                <img src={user.avatar} className="w-8 h-8 rounded-full border border-white/60 object-cover" alt="Avatar" />
                <div className="hidden sm:block text-left">
                  <p className="text-slate-800 text-xs font-bold leading-tight">{user.name}</p>
                  <p className="text-slate-500 text-[9px] uppercase tracking-wider font-semibold">{user.roles[0]}</p>
                </div>
             </Link>

             {/* Logout Button */}
             <button 
               onClick={logout}
               title="Sign Out"
               className="p-2 w-10 h-10 flex items-center justify-center rounded-xl bg-white/30 border border-white/40 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
             </button>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center pt-32 pb-12 px-4 relative z-10 w-full">
        <div className="w-full max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = "301173592632-56ren1tru7loolmie6ejca9ihmrg29v3.apps.googleusercontent.com";

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('opas_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('opas_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('opas_user');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute><Layout><Attendance /></Layout></ProtectedRoute>} />
            <Route path="/approvals" element={<ProtectedRoute><Layout><Approvals /></Layout></ProtectedRoute>} />
            <Route path="/leave" element={<ProtectedRoute><Layout><LeaveForm /></Layout></ProtectedRoute>} />
            <Route path="/od" element={<ProtectedRoute><Layout><LeaveForm forceType="OD" /></Layout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Layout><UserManagement /></Layout></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}
