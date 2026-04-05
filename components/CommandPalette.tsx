import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { NAV_ITEMS } from '../constants';
import { useAuth } from '../App';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Combine standard navigation bounds with system commands
  const primaryRole = user?.roles[0] || UserRole.STUDENT;
  const roleRoutes = NAV_ITEMS[primaryRole] || [];

  const rawCommands = [
    ...roleRoutes.map(route => ({
      label: `Navigate: ${route.label}`,
      icon: route.icon,
      action: () => navigate(route.path)
    })),
    {
      label: 'System: Sign Out',
      icon: '🔒',
      action: () => {
        logout();
        navigate('/login');
      }
    },
    {
      label: 'System: View My Profile',
      icon: '👤',
      action: () => navigate('/profile')
    }
  ];

  // Fuzzy search filter
  const filteredCommands = rawCommands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Focus effect when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global hotkey integration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K hooks
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!isOpen) { 
            // In App.tsx we handle globally, but this is a failsafe
            // Or rather, we just let App.tsx handle the opening.
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Reset selected index when query changes to prevent out of bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white/95 rounded-2xl shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex items-center px-4 py-4 border-b border-slate-100">
          <span className="text-slate-400 text-xl mr-3">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-slate-800 text-lg placeholder:text-slate-400 font-medium"
            placeholder="Search commands, pages, or tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded bg-slate-50 uppercase tracking-widest hidden sm:block">ESC to close</span>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
          {filteredCommands.length > 0 ? (
            <ul className="space-y-1">
              {filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li 
                    key={cmd.label}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-slate-700 hover:bg-indigo-50/80'
                    }`}
                  >
                    <span className="text-xl">{cmd.icon}</span>
                    <span className="font-semibold text-sm">{cmd.label}</span>
                    
                    {isSelected && (
                      <span className="ml-auto text-xs opacity-70 flex items-center font-bold">
                        ↵ Enter
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center text-slate-500">
              <span className="text-3xl block mb-2 opacity-50">🧭</span>
              <p className="font-semibold">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for pages or system commands.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
