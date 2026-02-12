
import React, { useState } from 'react';
import { useAuth } from '../App';
import { UserRole } from '../types';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('CS-A');
  const [marked, setMarked] = useState<Record<string, 'P' | 'A' | 'OD'>>({
    'CS2024001': 'P',
    'CS2024002': 'P',
    'CS2024003': 'A',
    'CS2024004': 'P',
  });

  const students = [
    { id: 'CS2024001', name: 'Alex Johnson', attendance: 85 },
    { id: 'CS2024002', name: 'Brittany Smith', attendance: 92 },
    { id: 'CS2024003', name: 'Carlos Diaz', attendance: 71 },
    { id: 'CS2024004', name: 'David Wilson', attendance: 88 },
  ];

  // Fixed: Checking multiple roles correctly using includes()
  if (!user?.roles.includes(UserRole.FACULTY) && !user?.roles.includes(UserRole.ADMIN)) {
    return <div className="p-8 text-center text-red-500 font-bold">Unauthorized Access</div>;
  }

  const toggleStatus = (id: string, status: 'P' | 'A' | 'OD') => {
    setMarked(prev => ({ ...prev, [id]: status }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Attendance Marking</h1>
          <p className="text-gray-500">Subject: Operating Systems • Oct 24, 2024</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="border rounded-lg px-4 py-2 bg-white font-medium"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option>CS-A</option>
            <option>CS-B</option>
            <option>IT-A</option>
          </select>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            Submit Record
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-bold text-gray-700">Reg No</th>
              <th className="px-6 py-4 font-bold text-gray-700">Name</th>
              <th className="px-6 py-4 font-bold text-gray-700">Current %</th>
              <th className="px-6 py-4 font-bold text-gray-700 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-gray-600">{student.id}</td>
                <td className="px-6 py-4 font-medium">{student.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${student.attendance < 75 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${student.attendance}%` }}></div>
                    </div>
                    <span className={`text-xs font-bold ${student.attendance < 75 ? 'text-red-500' : 'text-gray-600'}`}>{student.attendance}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => toggleStatus(student.id, 'P')}
                        className={`w-10 h-10 rounded-full font-bold transition-all ${marked[student.id] === 'P' ? 'bg-emerald-500 text-white shadow-lg scale-110' : 'bg-gray-100 text-gray-400 hover:bg-emerald-100 hover:text-emerald-500'}`}
                      >P</button>
                      <button 
                        onClick={() => toggleStatus(student.id, 'A')}
                        className={`w-10 h-10 rounded-full font-bold transition-all ${marked[student.id] === 'A' ? 'bg-red-500 text-white shadow-lg scale-110' : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'}`}
                      >A</button>
                      <button 
                        onClick={() => toggleStatus(student.id, 'OD')}
                        className={`w-10 h-10 rounded-full font-bold transition-all ${marked[student.id] === 'OD' ? 'bg-blue-500 text-white shadow-lg scale-110' : 'bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-500'}`}
                      >OD</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
