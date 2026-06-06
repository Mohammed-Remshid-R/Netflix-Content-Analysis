import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  Compass, 
  Globe, 
  Award, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Settings, 
  Trophy
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

function Sidebar() {
  const { sidebarCollapsed } = useDashboard();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/' },
    { name: 'Movies', icon: Film, path: '/movies' },
    { name: 'TV Shows', icon: Tv, path: '/tv-shows' },
    { name: 'Genres', icon: Compass, path: '/genres' },
    { name: 'Countries', icon: Globe, path: '/countries' },
    { name: 'Ratings', icon: Award, path: '/ratings' },
    { name: 'Release Trend', icon: TrendingUp, path: '/release-trend' },
    { name: 'Directors', icon: Users, path: '/directors' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  if (sidebarCollapsed) return null;

  return (
    <aside className="sidebar select-none">
      <div className="sidebar-brand">
        <span className="brand-logo flex items-center gap-1.5">
          NETFLIX
        </span>
        <span className="brand-subtitle">ANALYTICS DASHBOARD</span>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={item.path === '/'}
                >
                  <Icon className="nav-icon" size={18} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-promo">
        <div className="promo-image-container">
          <div className="promo-trophy">
            <Trophy size={42} className="promo-trophy-icon" />
          </div>
        </div>
        <div className="promo-content">
          <p className="promo-title">Unlock deeper insights</p>
          <p className="promo-text text-[11px] text-neutral-400 font-medium leading-5">
            Go Premium to access advanced analytics.
          </p>
          <button
            onClick={() => alert('Premium access features unlocked for active developer mode.')}
            className="promo-btn mt-4"
          >
            Go Premium 👑
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
