import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Database, Eye, ShieldAlert } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

function Settings() {
  const { timeFilter, setTimeFilter, getFilteredKpi } = useDashboard();
  const [analystName, setAnalystName] = useState('Analyst');
  const [analystRole, setAnalystRole] = useState('Data Explorer');
  const [analystEmail, setAnalystEmail] = useState('analyst@netflix.com');
  const [accentColor, setAccentColor] = useState('red');
  const [enableSim, setEnableSim] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profile configurations saved! (Simulated context state sync completed)");
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to re-initialize the Netflix dummy database indexes?")) {
      alert("Local sandbox indexes successfully synchronized and restored to default values.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <SettingsIcon className="text-[#E50914]" /> Dashboard Settings
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Configure profile details, adjust mock database updates, and toggle UI accent configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left column Settings inputs (7 cols) */}
        <form onSubmit={handleSave} className="md:col-span-7 space-y-6 bg-[#111]/30 border border-white/5 p-6 rounded-2xl">
          <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            Profile Settings
          </h2>
          
          <div className="space-y-4 text-xs font-bold text-neutral-400">
            <div className="space-y-1.5">
              <label>Analyst Name</label>
              <input
                type="text"
                value={analystName}
                onChange={(e) => setAnalystName(e.target.value)}
                className="w-full py-2.5 px-3.5 bg-[#080808] border border-white/5 rounded-xl text-white font-medium focus:outline-none focus:border-[#E50914]"
              />
            </div>
            
            <div className="space-y-1.5">
              <label>Role Designation</label>
              <input
                type="text"
                value={analystRole}
                onChange={(e) => setAnalystRole(e.target.value)}
                className="w-full py-2.5 px-3.5 bg-[#080808] border border-white/5 rounded-xl text-white font-medium focus:outline-none focus:border-[#E50914]"
              />
            </div>
            
            <div className="space-y-1.5">
              <label>Email Address</label>
              <input
                type="email"
                value={analystEmail}
                onChange={(e) => setAnalystEmail(e.target.value)}
                className="w-full py-2.5 px-3.5 bg-[#080808] border border-white/5 rounded-xl text-white font-medium focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="py-3 px-5 rounded-xl bg-[#E50914] text-white text-xs font-bold hover:bg-[#b81d24] transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-[#E50914]/25"
          >
            <Save size={14} /> Save Profile Changes
          </button>
        </form>

        {/* Right column Preferences & actions (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Preferences */}
          <div className="bg-[#111]/30 border border-white/5 p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-white/5 pb-3">
              Dashboard Preferences
            </h2>
            
            <div className="space-y-4 text-xs font-bold text-neutral-400">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Eye size={14} className="text-neutral-500" /> UI Accent glow</span>
                <select
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="bg-[#080808] border border-white/5 text-white px-3 py-1.5 rounded-lg focus:outline-none"
                >
                  <option value="red">Netflix Red</option>
                  <option value="gold">Golden Glow</option>
                </select>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5"><Database size={14} className="text-neutral-500" /> Auto-sync updates</span>
                <input
                  type="checkbox"
                  checked={enableSim}
                  onChange={(e) => setEnableSim(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#E50914] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Database management */}
          <div className="bg-[#111]/30 border border-white/5 p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-rose-500/10 pb-3">
              <ShieldAlert size={14} /> Danger Zone
            </h2>
            
            <p className="text-[11px] text-neutral-500 leading-normal font-semibold">
              Re-synchronizing files and indexes will clear any local modifications made to the mock datasets since initial build initialization.
            </p>
            
            <button 
              onClick={handleResetData}
              className="w-full py-3 px-4 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} /> Reset Database
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Settings;
