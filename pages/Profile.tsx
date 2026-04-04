
import React from 'react';
import { useAuth } from '../App';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-8 bg-white p-8 rounded-2xl shadow-sm border">
        <div className="relative">
          <img src={user?.avatar} className="w-32 h-32 rounded-full border-4 border-blue-500 p-1" alt="Profile" />
          <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md hover:bg-gray-50 border transition-colors">
            ✏️
          </button>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            {/* Fixed: User has 'roles' array, not 'role' string */}
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {user?.roles.join(', ')}
            </span>
          </div>
          <p className="text-gray-500 font-medium mb-4">{user?.email}</p>
          <div className="flex gap-4">
            <div className="text-center bg-gray-50 px-6 py-3 rounded-xl border border-dashed">
               <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
               <p className="font-bold text-emerald-600">Active</p>
            </div>
            <div className="text-center bg-gray-50 px-6 py-3 rounded-xl border border-dashed">
               <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Join Date</p>
               <p className="font-bold">Aug 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>📞</span> Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Phone Number</p>
              <p className="font-medium">+1 234 567 890</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Alternate Email</p>
              <p className="font-medium">personal.mail@provider.com</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Address</p>
              <p className="font-medium">123 College Ave, Campus West, City, 56789</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span>🔗</span> Linked Accounts
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">👤</span>
                <span className="font-medium">Mentor (Dr. Sarah Smith)</span>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">VERIFIED</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">🏠</span>
                <span className="font-medium">Parent (Robert Johnson)</span>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">VERIFIED</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">🚪</span>
                <span className="font-medium">Hostel Warden</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">MAPPED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
