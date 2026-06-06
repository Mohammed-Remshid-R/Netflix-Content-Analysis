import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, Check, Eye } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { searchableItems } from '../data/netflixData';
import DetailsPanel from './DetailsPanel';
import profileImg from '../assets/profile.png';

function Header() {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    unreadCount, 
    notifications, 
    markAsRead, 
    markAllRead,
    setProfileOpen 
  } = useDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [selectedTitleItem, setSelectedTitleItem] = useState(null);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const suggestionRef = useRef(null);
  const notifRef = useRef(null);

  // Close suggestion and notification dropdowns on outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setSuggestionOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const filtered = searchableItems.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        (item.director && item.director.toLowerCase().includes(query.toLowerCase())) ||
        (item.genre && item.genre.toLowerCase().includes(query.toLowerCase())) ||
        (item.country && item.country.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6);
      setSuggestions(filtered);
      setSuggestionOpen(true);
    } else {
      setSuggestions([]);
      setSuggestionOpen(false);
    }
  };

  const selectSuggestion = (item) => {
    setSelectedTitleItem(item);
    setSearchQuery('');
    setSuggestionOpen(false);
  };

  return (
    <>
      <header className="main-header select-none relative">
        <div className="header-left">
          <button className="menu-toggle-btn" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
          
          {/* Search bar with dropdown suggestions */}
          <div className="search-bar-container relative" ref={suggestionRef}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search for a title, director, country..." 
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim().length > 0 && setSuggestionOpen(true)}
            />

            {/* Suggestions Dropdown */}
            {suggestionOpen && suggestions.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0e0e0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 py-1">
                {suggestions.map((item, idx) => (
                  <div 
                    key={idx}
                    onClick={() => selectSuggestion(item)}
                    className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-[#E0A96D] transition-colors">{item.label}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{item.sublabel}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {suggestionOpen && suggestions.length === 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0e0e0e] border border-white/10 rounded-2xl p-4 text-center text-xs text-neutral-500 z-50">
                No matching titles, directors, or countries found.
              </div>
            )}
          </div>
        </div>

        <div className="header-right">
          <button className="export-btn">Export Data</button>
          {/* Notification bell and dropdown */}
          <div className="notification-container relative" ref={notifRef}>
            <div onClick={() => setNotifDropdownOpen(!notifDropdownOpen)} className="p-1">
              <Bell className="bell-icon" size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>

            {/* Notifications Dropdown */}
            {notifDropdownOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] w-80 bg-[#0e0e0e] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[380px]">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-[10px] font-bold text-[#E50914] hover:text-[#b81d24] transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto divide-y divide-white/5 py-1">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3.5 flex items-start gap-2.5 transition-colors ${n.read ? 'opacity-65 hover:opacity-100' : 'bg-white/[0.02]'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-transparent' : 'bg-[#E50914] shadow shadow-[#E50914]'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white leading-normal">{n.title}</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{n.message}</p>
                        <span className="text-[9px] text-neutral-500 font-semibold block mt-1">{n.time}</span>
                      </div>
                      {!n.read && (
                        <button 
                          onClick={() => markAsRead(n.id)}
                          className="p-1 rounded hover:bg-white/5 text-neutral-500 hover:text-white transition-colors"
                          title="Mark as read"
                        >
                          <Check size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="py-8 text-center text-xs text-neutral-500 font-medium">
                      No notifications at this time.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Explorer clickable section */}
          <div className="profile-container" onClick={() => setProfileOpen(true)}>
            <img 
              src={profileImg} 
              alt="Analyst Avatar" 
              className="profile-img"
            />
            <div className="profile-info">
              <span className="profile-name">Analyst</span>
              <span className="profile-role">Data Explorer</span>
            </div>
            <ChevronDown className="profile-dropdown-arrow" size={16} />
          </div>
        </div>
      </header>

      {/* Render selected item details panel */}
      {selectedTitleItem && (
        <DetailsPanel 
          item={selectedTitleItem} 
          onClose={() => setSelectedTitleItem(null)} 
        />
      )}
    </>
  );
}

export default Header;
