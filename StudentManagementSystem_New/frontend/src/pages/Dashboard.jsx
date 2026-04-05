import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { Users, BookOpen, Percent } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/users/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div>Loading dashboard...</div>;

    const cards = [];
    if (stats.attendance !== undefined) cards.push({ title: 'Attendance', value: `${stats.attendance}%`, icon: <Percent size={24}/>, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' });
    if (stats.cgpa !== undefined) cards.push({ title: 'CGPA', value: stats.cgpa.toFixed(2), icon: <BookOpen size={24}/>, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' });
    if (stats.mentees !== undefined) cards.push({ title: 'Total Mentees', value: stats.mentees.length, icon: <Users size={24}/>, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' });
    if (stats.hostelStudents !== undefined) cards.push({ title: 'Hostel Students', value: stats.count, icon: <Users size={24}/>, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="glass-card p-6 flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-slate-500 font-medium">{card.title}</h3>
                            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                        <p className="text-4xl font-bold mt-4 text-slate-800 dark:text-white">{card.value}</p>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-8 glass-card p-6">
                 <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Profile Information</h2>
                 <div className="grid grid-cols-2 gap-4 text-slate-600 dark:text-slate-300">
                     <p><strong>Name:</strong> {stats.profile.name}</p>
                     <p><strong>Email:</strong> {stats.profile.email}</p>
                     <p><strong>Role:</strong> {stats.profile.role}</p>
                     {stats.profile.department && <p><strong>Department:</strong> {stats.profile.department}</p>}
                     {stats.profile.mentor && <p><strong>Mentor:</strong> {stats.profile.mentor.name}</p>}
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
