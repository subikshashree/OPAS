
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
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return null;

  const primaryRole = user.roles[0];
  const currentNav = NAV_ITEMS[primaryRole] || [];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 transition-all duration-300 flex flex-col shadow-xl z-20`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">O</div>
          {isSidebarOpen && <span className="text-white font-bold text-xl tracking-tight">OPAS</span>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {currentNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover" alt="Avatar" />
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map(r => (
                    <p key={r} className="text-gray-500 text-[10px] font-bold uppercase">{r === 'FACULTY' ? 'MENTOR' : r}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <span>🚪</span>
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
          >
            <span className="text-xl">☰</span>
          </button>
          <div className="flex items-center gap-6">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Status</span>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> ONLINE
                </span>
             </div>
             <div className="w-px h-6 bg-gray-200"></div>
             <div className="relative group cursor-pointer">
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                <span className="text-xl">🔔</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

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
  );
}
