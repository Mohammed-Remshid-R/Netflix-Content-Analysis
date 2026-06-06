import React from 'react';
import { Calendar } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import KPIcards from '../components/KPIcards';
import ReleaseTrendChart from '../components/ReleaseTrendChart';
import GenreChart from '../components/GenreChart';
import CountryChart from '../components/CountryChart';
import RatingsChart from '../components/RatingsChart';
import RightSidebar from '../components/RightSidebar';

function Overview() {
  const { 
    timeFilter, 
    setTimeFilter,
    getFilteredKpi,
    genreData,
    ratingsData,
    countryData,
    getTrendData 
  } = useDashboard();

  const kpi = getFilteredKpi();
  const trend = getTrendData();

  return (
    <div className="dashboard-content-layout">
      {/* Middle analytics grid */}
      <div className="analytics-view">
        
        {/* Welcome Row */}
        <div className="welcome-row flex justify-between items-center mb-6">
          <div className="welcome-text-box">
            <h1 className="text-2xl font-black text-white">Welcome back, Analyst 👋</h1>
            <p className="text-sm text-neutral-400 mt-0.5">Real-time content distribution and metadata analysis</p>
          </div>
          
          {/* Working Dropdown filter */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#E50914]" />
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="yearly-dropdown bg-[#111] border border-white/5 text-white px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none cursor-pointer hover:bg-white/5 transition-colors"
            >
              <option value="all">All Time</option>
              <option value="year">Past Year</option>
              <option value="month">Past Month</option>
              <option value="week">Past Week</option>
            </select>
          </div>
        </div>

        {/* KPI Cards section */}
        <KPIcards kpi={kpi} />

        {/* Main charts grid */}
        <div className="charts-grid-row">
          <ReleaseTrendChart data={trend} />
          <GenreChart data={genreData} />
        </div>

        <div className="charts-grid-row mt-6">
          <CountryChart data={countryData} />
          <RatingsChart data={ratingsData} />
        </div>

        {/* Footer */}
        <footer className="dashboard-footer mt-10">
          <p>© 2026 Netflix Content Analysis Platform. Powered by Recharts & Framer Motion.</p>
        </footer>
      </div>

      {/* Right sidebar details */}
      <RightSidebar />
    </div>
  );
}

export default Overview;
