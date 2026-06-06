import React from 'react';
import { X, User, Mail, Shield, BarChart3, Bell, Settings, LogOut, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import profileImg from '../assets/profile.png';

function ProfileDrawer() {
  const { profileOpen, setProfileOpen, notifications, markAsRead } = useDashboard();

  if (!profileOpen) return null;

  const handleLogout = () => {
    alert("Logging out from Netflix Content Analysis Platform...");
    setProfileOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end overflow-hidden bg-black/60 backdrop-blur-sm">
        {/* Backdrop clickable */}
        <div className="absolute inset-0" onClick={() => setProfileOpen(false)} />

        {/* Profile Drawer */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          className="relative h-full w-full max-w-md border-l border-white/5 bg-[#0a0a0a] shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <User size={18} className="text-[#E50914]" /> Analyst Profile
            </h2>
            <button
              onClick={() => setProfileOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Main Analyst Card */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-[#111] to-[#0d0d0d] border border-white/5 relative overflow-hidden">
              {/* Profile image with gold accent ring */}
              <div className="relative w-24 h-24 mb-4 rounded-full p-1 bg-gradient-to-tr from-[#E50914] to-[#E0A96D] shadow-lg shadow-black/80">
                <img
                  src={profileImg}
                  alt="Analyst Avatar"
                  className="w-full h-full object-cover rounded-full bg-[#111]"
                />
                <span className="absolute bottom-0 right-1.5 w-5 h-5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-white">Analyst</h3>
              <p className="text-xs text-[#E0A96D] font-semibold mt-0.5 tracking-wider uppercase">Data Explorer</p>
              
              <div className="w-full h-[1px] bg-white/5 my-4" />
              
              <div className="w-full space-y-2.5 text-left text-sm text-neutral-400">
                <div className="flex items-center gap-2.5">
                  <Mail size={14} className="text-neutral-500" />
                  <span>analyst@netflix.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Shield size={14} className="text-neutral-500" />
                  <span>Admin Access Level</span>
                </div>
              </div>
            </div>

            {/* Analytics Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 size={14} className="text-[#E0A96D]" /> Analytics Activity
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#111]/60 border border-white/5 rounded-xl">
                  <span className="text-2xl font-black text-white">124</span>
                  <p className="text-[11px] text-neutral-500 font-medium uppercase mt-0.5">Queries Run</p>
                </div>
                <div className="p-3.5 bg-[#111]/60 border border-white/5 rounded-xl">
                  <span className="text-2xl font-black text-white">99.8%</span>
                  <p className="text-[11px] text-neutral-500 font-medium uppercase mt-0.5">Report Accuracy</p>
                </div>
              </div>
            </div>

            {/* Recent Notifications Quick view */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bell size={14} className="text-[#E50914]" /> Unread Notifications
                </h4>
                <span className="text-[10px] text-neutral-500 font-medium">Auto-Sync Active</span>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {notifications.filter(n => !n.read).slice(0, 3).map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-[#111]/40 hover:bg-[#111]/60 border border-white/5 rounded-xl flex items-start gap-2.5 transition-colors group cursor-pointer"
                    onClick={() => markAsRead(item.id)}
                  >
                    <CheckCircle2 size={14} className="text-neutral-500 group-hover:text-emerald-500 transition-colors mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-semibold group-hover:text-[#E0A96D] transition-colors truncate">{item.title}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{item.message}</p>
                    </div>
                  </div>
                ))}
                {notifications.filter(n => !n.read).length === 0 && (
                  <div className="text-center py-6 border border-dashed border-white/5 rounded-xl">
                    <p className="text-xs text-neutral-500 font-medium">All notifications marked read</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick settings & action section */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <button 
                onClick={() => { setProfileOpen(false); alert("Navigating to settings...") }} 
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <Settings size={16} className="text-neutral-500" /> Account Settings
                </span>
                <ChevronRight size={16} className="text-neutral-600" />
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-500/10 text-neutral-300 hover:text-rose-500 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <LogOut size={16} className="text-rose-500/80" /> Logout Analyst
                </span>
                <ChevronRight size={16} className="text-neutral-600" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ProfileDrawer;
