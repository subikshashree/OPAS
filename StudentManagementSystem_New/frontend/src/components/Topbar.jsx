import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Welcome back, {user?.name}</h2>
            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <User size={20} />
                </button>
                <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-500 hover:text-red-700 font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
