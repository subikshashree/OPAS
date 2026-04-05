import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Calendar, CheckSquare, Users, BookOpen } from 'lucide-react';

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    
    const getRoleLinks = () => {
        const base = [{ path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> }];
        
        if (user?.role === 'Student') {
            base.push({ path: '/leave', label: 'Leave Apply', icon: <Calendar size={20} /> });
            base.push({ path: '/tasks', label: 'My Tasks', icon: <CheckSquare size={20} /> });
        } else if (user?.role === 'Mentor') {
            base.push({ path: '/leave', label: 'Leave Approvals', icon: <Calendar size={20} /> });
            base.push({ path: '/tasks', label: 'Assign Tasks', icon: <CheckSquare size={20} /> });
            base.push({ path: '/students', label: 'My Mentees', icon: <Users size={20} /> });
        } else {
             base.push({ path: '/leave', label: 'Leave Approvals', icon: <Calendar size={20} /> });
        }
        return base;
    };

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">EduSync</h1>
                <p className="text-xs text-slate-500 mt-1">{user?.role} Portal</p>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {getRoleLinks().map((link) => (
                    <NavLink 
                        key={link.path} 
                        to={link.path}
                        className={({ isActive }) => 
                            `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                                isActive 
                                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' 
                                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                            }`
                        }
                    >
                        {link.icon}
                        <span className="font-medium">{link.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
