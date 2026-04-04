import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-8"
            >
                <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">Portal Login</h2>
                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all transform hover:-translate-y-1"
                    >
                        Sign In
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
