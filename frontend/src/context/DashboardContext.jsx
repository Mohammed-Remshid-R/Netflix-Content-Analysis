import React, { createContext, useContext, useState, useCallback } from 'react';
import { kpiData, releaseTrendData, genreData, ratingsData, countryData, notificationsData } from '../data/netflixData';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [timeFilter, setTimeFilter] = useState('all');
  const [trendPeriod, setTrendPeriod] = useState('yearly');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate initial loading
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  // Get filtered KPI data based on timeFilter
  const getFilteredKpi = useCallback(() => {
    if (timeFilter === 'all') return kpiData;
    const multipliers = { 'year': 0.12, 'month': 0.01, 'week': 0.002 };
    const m = multipliers[timeFilter] || 1;
    return {
      total_titles: Math.round(kpiData.total_titles * m),
      total_movies: Math.round(kpiData.total_movies * m),
      total_tvshows: Math.round(kpiData.total_tvshows * m),
      total_countries: Math.round(kpiData.total_countries * m),
    };
  }, [timeFilter]);

  const getTrendData = useCallback(() => {
    return releaseTrendData[trendPeriod] || releaseTrendData.yearly;
  }, [trendPeriod]);

  const value = {
    timeFilter, setTimeFilter,
    trendPeriod, setTrendPeriod,
    sidebarCollapsed, toggleSidebar, setSidebarCollapsed,
    notifications, notificationOpen, setNotificationOpen,
    profileOpen, setProfileOpen,
    searchQuery, setSearchQuery,
    loading, setLoading,
    unreadCount, markAsRead, markAllRead,
    getFilteredKpi, getTrendData,
    genreData, ratingsData, countryData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
}
