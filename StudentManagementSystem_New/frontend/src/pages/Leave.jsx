import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Leave = () => {
    const { user } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [showModal, setShowModal] = useState(false);
    
    // Form fields
    const [leaveType, setLeaveType] = useState('General Permission');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves');
            setLeaves(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leaves', { leaveType, startDate, endDate, reason });
            setShowModal(false);
            fetchLeaves();
        } catch (error) {
            alert('Failed to apply: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleApproveReject = async (id, status) => {
        try {
            await api.put(`/leaves/${id}/approve`, { status, rejectionReason: status === 'Rejected' ? 'Not accepted' : '' });
            fetchLeaves();
        } catch (error) {
            alert('Action failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Leave Management</h1>
                {user?.role === 'Student' && (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
                    >
                        Apply Leave
                    </button>
                )}
            </div>

            <div className="glass-card overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        <tr>
                            {user?.role !== 'Student' && <th className="px-6 py-4">Student</th>}
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Dates</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Progress</th>
                            {user?.role !== 'Student' && <th className="px-6 py-4">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map((l) => (
                            <tr key={l._id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                {user?.role !== 'Student' && <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{l.student?.name}</td>}
                                <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-semibold">{l.leaveType}</td>
                                <td className="px-6 py-4">{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        l.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        l.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {l.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1">
                                        {l.approvalChain.map((step, idx) => (
                                            <span key={idx} title={`${step.role}: ${step.status}`} className={`w-3 h-3 rounded-full ${
                                                step.status === 'Approved' ? 'bg-green-500' :
                                                step.status === 'Rejected' ? 'bg-red-500' :
                                                'bg-slate-300 dark:bg-slate-600'
                                            }`}></span>
                                        ))}
                                    </div>
                                </td>
                                {user?.role !== 'Student' && (
                                    <td className="px-6 py-4 space-x-2">
                                        {l.status === 'Pending' && l.approvalChain.find(s => s.status === 'Pending')?.role === user?.role && (
                                            <>
                                                <button onClick={() => handleApproveReject(l._id, 'Approved')} className="text-green-600 hover:underline font-medium">Approve</button>
                                                <button onClick={() => handleApproveReject(l._id, 'Rejected')} className="text-red-600 hover:underline font-medium ml-3">Reject</button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {leaves.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No leave requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Application Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="glass-card w-full max-w-lg p-6 bg-white dark:bg-slate-900 border-0">
                        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Apply Leave</h2>
                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Leave Type</label>
                                <select value={leaveType} onChange={(e)=>setLeaveType(e.target.value)} className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 focus:ring focus:ring-indigo-500 text-slate-900 dark:text-white border-slate-300">
                                    <option>Special Permission</option>
                                    <option>Emergency Leave</option>
                                    <option>General Permission</option>
                                    <option>OD</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
                                    <input type="date" required value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white border-slate-300" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
                                    <input type="date" required value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white border-slate-300" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Reason</label>
                                <textarea required value={reason} onChange={(e)=>setReason(e.target.value)} className="w-full mt-1 p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white border-slate-300" rows="3"></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit Application</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Leave;
