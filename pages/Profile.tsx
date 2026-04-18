import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { GlassCard, GlassBadge, FloatingSphere, GlassButton, GlassInput } from '../components/ui';
import { UserRole } from '../types';

interface RelationUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
  phone?: string;
  department?: string;
  hostelBlock?: string;
  hostelName?: string;
}

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  
  const [cloudMentor, setCloudMentor] = useState<RelationUser | null>(null);
  const [cloudParent, setCloudParent] = useState<RelationUser | null>(null);
  const [cloudWarden, setCloudWarden] = useState<RelationUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_URL || '/api/opas';

  // ── Edit Modal State ──
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    department: '',
    isHosteler: false,
    hostelBlock: '',
    roomNumber: '',
    busNumber: '',
  });

  const openEditModal = () => {
    if (!user) return;
    setEditForm({
      name: user.name || '',
      phone: user.phone || '',
      department: user.department || '',
      isHosteler: user.isHosteler || false,
      hostelBlock: user.hostelBlock || '',
      roomNumber: user.roomNumber || '',
      busNumber: user.busNumber || '',
    });
    setSaveMsg(null);
    setIsEditing(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name.trim(),
          phone: editForm.phone.trim() || null,
          department: editForm.department.trim() || null,
          isHosteler: editForm.isHosteler,
          hostelBlock: editForm.isHosteler ? editForm.hostelBlock.trim() || null : null,
          roomNumber: editForm.isHosteler ? editForm.roomNumber.trim() || null : null,
          busNumber: !editForm.isHosteler ? editForm.busNumber.trim() || null : null,
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updatedUser = await res.json();
      // Update auth context + localStorage
      login(updatedUser);
      setSaveMsg({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setIsEditing(false), 1000);
    } catch (err) {
      console.error('Profile update error:', err);
      setSaveMsg({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchRelations = async () => {
      setIsLoading(true);
      try {
        const promises: Promise<void>[] = [];
        if (user.mentorId) promises.push(
          fetch(`${API_BASE}/users/${user.mentorId}`)
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(data => setCloudMentor(data))
            .catch(() => setCloudMentor(null))
        );
        if (user.parentId) promises.push(
          fetch(`${API_BASE}/users/${user.parentId}`)
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(data => setCloudParent(data))
            .catch(() => setCloudParent(null))
        );
        if (user.wardenId) promises.push(
          fetch(`${API_BASE}/users/${user.wardenId}`)
            .then(res => { if (!res.ok) throw new Error(); return res.json(); })
            .then(data => setCloudWarden(data))
            .catch(() => setCloudWarden(null))
        );
        await Promise.all(promises);
      } catch (e) {
        console.error("Cloud relation lookup failed", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRelations();
  }, [user, API_BASE]);

  const hasAnyLinks = user?.mentorId || user?.parentId || user?.wardenId;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <FloatingSphere size={200} color="bg-indigo-400" delay={0} className="-top-10 -right-20" />
      <FloatingSphere size={150} color="bg-cyan-300" delay={2} className="bottom-20 -left-20" />

      {/* ── Profile Header ── */}
      <GlassCard variant="light" className="flex flex-col md:flex-row items-center md:items-start gap-8 z-10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <img src={user?.avatar} className="relative w-36 h-36 rounded-full border-4 border-white object-cover shadow-xl" alt="Profile" />
          <button 
            onClick={openEditModal}
            className="absolute bottom-2 right-2 bg-white p-2.5 rounded-full shadow-lg hover:bg-slate-50 transition-transform hover:scale-110 border border-slate-100 z-20"
          >
            <span className="text-xl leading-none">✏️</span>
          </button>
        </div>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">{user?.name}</h1>
            <div className="flex flex-wrap gap-2 justify-center">
              {user?.roles.map(r => (
                 <GlassBadge key={r} variant="info" className="px-4 py-1.5">{r}</GlassBadge>
              ))}
            </div>
          </div>
          <p className="text-slate-500 font-medium text-lg">{user?.email}</p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <div className="text-center bg-white/40 px-6 py-3 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md">
               <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Status</p>
               <p className="font-extrabold text-emerald-600 mt-1">Active Element</p>
            </div>
            <div className="text-center bg-white/40 px-6 py-3 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md">
               <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Initialization</p>
               <p className="font-extrabold text-slate-700 mt-1">
                 {/* @ts-ignore - Check for createdAt explicitly but fallback cleanly */}
                 {user?.['createdAt'] ? new Date(user['createdAt']).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
               </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
        {/* ── Profile Vectors ── */}
        <GlassCard variant="light" className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
            <span className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-600">📞</span> 
            Profile Vectors
          </h2>
          <div className="space-y-5">
            <div className="p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors hover:bg-white/50">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Primary Node</p>
              <p className="font-semibold text-slate-700">{user?.phone || 'Not Configured'}</p>
            </div>
            <div className="p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors hover:bg-white/50">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">System Identifier</p>
              <p className="font-semibold text-slate-700">{user?.email}</p>
            </div>
            <div className="p-4 bg-white/30 rounded-2xl border border-white/40 transition-colors hover:bg-white/50">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Sector Address</p>
              <p className="font-semibold text-slate-700">
                {user?.isHosteler 
                  ? `${user.hostelBlock || 'Hostel Block'}, Room ${user.roomNumber || 'TBA'}` 
                  : `Department of ${user?.department || 'Unassigned Sector'}`}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* ── Identity Links Summary (right column) ── */}
        {user?.roles.includes(UserRole.STUDENT) && (
          <GlassCard variant="light" className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800">
              <span className="p-2.5 bg-purple-500/10 rounded-xl text-purple-600">🔗</span> 
              Identity Links
            </h2>
            <div className="space-y-4">
              {/* Mentor Quick Badge */}
              <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/50 shadow-sm hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg shadow-inner">👤</span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1">Mentor Node</p>
                    <span className="font-bold text-slate-700">{cloudMentor ? cloudMentor.name : (isLoading && user?.mentorId ? 'Loading...' : 'Not Assigned')}</span>
                  </div>
                </div>
                <GlassBadge variant={cloudMentor ? "success" : "default"}>{cloudMentor ? "LINKED" : "UNLINKED"}</GlassBadge>
              </div>
              
              {/* Parent Quick Badge */}
              <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/50 shadow-sm hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg shadow-inner">🏠</span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1">Guardian Node</p>
                    <span className="font-bold text-slate-700">{cloudParent ? cloudParent.name : (isLoading && user?.parentId ? 'Loading...' : 'Not Assigned')}</span>
                  </div>
                </div>
                <GlassBadge variant={cloudParent ? "success" : "default"}>{cloudParent ? "LINKED" : "UNLINKED"}</GlassBadge>
              </div>

              {/* Warden Quick Badge */}
              <div className="flex items-center justify-between p-4 bg-white/40 rounded-2xl border border-white/50 shadow-sm hover:translate-x-1 transition-transform">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-lg shadow-inner">🚪</span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1">Hostel Warden</p>
                    <span className="font-bold text-slate-700">{cloudWarden ? cloudWarden.name : (isLoading && user?.wardenId ? 'Loading...' : (user?.isHosteler ? 'Not Assigned' : 'Dayscholar'))}</span>
                  </div>
                </div>
                <GlassBadge variant={cloudWarden ? "warning" : "default"}>{cloudWarden ? "MAPPED" : "UNLINKED"}</GlassBadge>
              </div>
            </div>
          </GlassCard>
        )}
      </div>

      {/* ── Detailed Identity Link Cards (full width) ── */}
      {user?.roles.includes(UserRole.STUDENT) && hasAnyLinks && (
        <div className="space-y-6 z-10 relative">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 px-1">
            <span className="p-2.5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl text-indigo-600">📋</span> 
            Assigned Connections — Details
          </h2>

          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <GlassCard variant="light" className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                        <div className="h-3 bg-slate-100 rounded w-1/4" />
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="space-y-4">
              {/* ── Mentor Detail Card ── */}
              <RelationDetailCard
                label="Mentor"
                icon="👨‍🏫"
                accentFrom="from-blue-500"
                accentTo="to-cyan-400"
                bgAccent="bg-blue-50"
                person={cloudMentor}
                assignedId={user?.mentorId}
              />

              {/* ── Parent / Guardian Detail Card ── */}
              <RelationDetailCard
                label="Parent / Guardian"
                icon="👨‍👧"
                accentFrom="from-purple-500"
                accentTo="to-pink-400"
                bgAccent="bg-purple-50"
                person={cloudParent}
                assignedId={user?.parentId}
              />

              {/* ── Warden Detail Card ── */}
              <RelationDetailCard
                label="Hostel Warden"
                icon="🏢"
                accentFrom="from-amber-500"
                accentTo="to-orange-400"
                bgAccent="bg-amber-50"
                person={cloudWarden}
                assignedId={user?.wardenId}
                showWhenAbsent={user?.isHosteler !== false}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Edit Profile Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 border border-white p-8 rounded-3xl shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>

            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600">✏️</span>
              Edit Profile
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1 mb-6">Update your personal information</p>

            {saveMsg && (
              <div className={`mb-4 p-3 rounded-xl text-sm font-semibold ${
                saveMsg.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {saveMsg.text}
              </div>
            )}

            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Full Name</label>
                <GlassInput 
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                <GlassInput 
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                  type="tel"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Department</label>
                <GlassInput 
                  value={editForm.department}
                  onChange={e => setEditForm(f => ({ ...f, department: e.target.value }))}
                  placeholder="Computer Science"
                />
              </div>

              {/* Hostel / Dayscholar Toggle */}
              <div className="pt-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Residential Type</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setEditForm(f => ({ ...f, isHosteler: false }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      !editForm.isHosteler 
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' 
                        : 'bg-white/50 text-slate-600 border-slate-200 hover:bg-white/80'
                    }`}
                  >
                    🚌 Day Scholar
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditForm(f => ({ ...f, isHosteler: true }))}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      editForm.isHosteler 
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-md' 
                        : 'bg-white/50 text-slate-600 border-slate-200 hover:bg-white/80'
                    }`}
                  >
                    🏠 Hosteler
                  </button>
                </div>
              </div>

              {editForm.isHosteler ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Hostel Block</label>
                    <GlassInput 
                      value={editForm.hostelBlock}
                      onChange={e => setEditForm(f => ({ ...f, hostelBlock: e.target.value }))}
                      placeholder="Mens Hostel A"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Room Number</label>
                    <GlassInput 
                      value={editForm.roomNumber}
                      onChange={e => setEditForm(f => ({ ...f, roomNumber: e.target.value }))}
                      placeholder="A-201"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Bus Number</label>
                  <GlassInput 
                    value={editForm.busNumber}
                    onChange={e => setEditForm(f => ({ ...f, busNumber: e.target.value }))}
                    placeholder="Bus 12"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <GlassButton variant="secondary" onClick={() => setIsEditing(false)} className="flex-1 justify-center" type="button">
                  Cancel
                </GlassButton>
                <GlassButton variant="primary" type="submit" className="flex-1 justify-center" disabled={isSaving || !editForm.name.trim()}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Reusable Relation Detail Card ─────────────────────────────── */
interface RelationDetailCardProps {
  label: string;
  icon: string;
  accentFrom: string;
  accentTo: string;
  bgAccent: string;
  person: RelationUser | null;
  assignedId?: string;
  showWhenAbsent?: boolean;
}

const RelationDetailCard: React.FC<RelationDetailCardProps> = ({
  label, icon, accentFrom, accentTo, bgAccent, person, assignedId, showWhenAbsent = true
}) => {
  // Don't render card if no assignment and showWhenAbsent is false
  if (!assignedId && !showWhenAbsent) return null;

  if (!assignedId) {
    return (
      <GlassCard variant="light" className="p-5 opacity-60">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 ${bgAccent} rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/60`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">{label}</p>
            <p className="font-semibold text-slate-400 italic">Not Assigned</p>
          </div>
          <GlassBadge variant="default">UNLINKED</GlassBadge>
        </div>
      </GlassCard>
    );
  }

  if (!person) {
    // Has an ID but couldn't resolve the user (maybe deleted)
    return (
      <GlassCard variant="light" className="p-5">
        <div className="flex items-center gap-5">
          <div className={`w-14 h-14 ${bgAccent} rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/60`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1">{label}</p>
            <p className="font-semibold text-slate-600">ID: {assignedId}</p>
            <p className="text-xs text-rose-400 font-medium mt-0.5">⚠️ Could not resolve user details</p>
          </div>
          <GlassBadge variant="danger">ERROR</GlassBadge>
        </div>
      </GlassCard>
    );
  }

  const roleBadgeLabel = person.roles?.[0] === 'FACULTY' ? 'MENTOR' : person.roles?.[0] || label.toUpperCase();

  return (
    <GlassCard variant="light" className="p-0 overflow-hidden group hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow duration-500">
      {/* Accent top stripe */}
      <div className={`h-1 bg-gradient-to-r ${accentFrom} ${accentTo} opacity-80 group-hover:opacity-100 transition-opacity`} />
      
      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={`absolute -inset-1 bg-gradient-to-r ${accentFrom} ${accentTo} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500`} />
          <img 
            src={person.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`} 
            alt={person.name}
            className="relative w-16 h-16 rounded-2xl border-2 border-white object-cover shadow-lg" 
          />
        </div>

        {/* Info block */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none">{label}</p>
            <GlassBadge variant="info" className="text-[9px] px-2 py-0.5">{roleBadgeLabel}</GlassBadge>
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight truncate">{person.name}</h3>
          
          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 pt-1">
            <DetailItem label="Email" value={person.email} icon="✉️" />
            <DetailItem label="Phone" value={person.phone || 'Not provided'} icon="📱" />
            <DetailItem label="Department" value={person.department || 'N/A'} icon="🏛️" />
            {person.hostelBlock && <DetailItem label="Hostel Block" value={person.hostelBlock} icon="🏢" />}
            {person.hostelName && <DetailItem label="Hostel" value={person.hostelName} icon="🏠" />}
            <DetailItem label="User ID" value={person.id} icon="🔑" />
          </div>
        </div>

        {/* Status badge */}
        <div className="shrink-0 self-start sm:self-center">
          <GlassBadge variant="success" className="px-3 py-1.5">✓ VERIFIED</GlassBadge>
        </div>
      </div>
    </GlassCard>
  );
};

/* ─── Small Detail Item ─────────────────────────────────────────── */
const DetailItem: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="flex items-center gap-2 min-w-0">
    <span className="text-xs opacity-60">{icon}</span>
    <div className="min-w-0">
      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{label}: </span>
      <span className="text-xs font-semibold text-slate-600 truncate">{value}</span>
    </div>
  </div>
);

export default Profile;
