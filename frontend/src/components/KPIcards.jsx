import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Film, Tv, Globe } from 'lucide-react';

function KPIcards({ kpi }) {
  // Sparkline data configurations
  const sparklineData = {
    titles: [
      { value: 4000 }, { value: 4800 }, { value: 4200 }, 
      { value: 5500 }, { value: 6800 }, { value: 7200 }, 
      { value: 8807 }
    ],
    movies: [
      { value: 3000 }, { value: 3500 }, { value: 3200 }, 
      { value: 4200 }, { value: 5100 }, { value: 5500 }, 
      { value: 6133 }
    ],
    tvShows: [
      { value: 1000 }, { value: 1300 }, { value: 1000 }, 
      { value: 1300 }, { value: 1700 }, { value: 1700 }, 
      { value: 2674 }
    ],
    countries: [
      { value: 500 }, { value: 550 }, { value: 520 }, 
      { value: 600 }, { value: 680 }, { value: 710 }, 
      { value: 749 }
    ]
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
  };

  return (
    <div className="kpi-container">
      {/* Total Titles */}
      <div className="card red-card">
        <div className="card-header">
          <div className="card-title-box">
            <h2>Total Titles</h2>
            <p className="card-value">{formatNumber(kpi.total_titles ?? 8807)}</p>
            <div className="card-change">
              <span className="change-value text-red">+12.5%</span>
              <span className="change-label">vs last update</span>
            </div>
          </div>
          <div className="card-icon-container bg-red-dim">
            <Film className="card-icon text-red" size={22} />
          </div>
        </div>
        <div className="card-sparkline">
          <ResponsiveContainer width="100%" height={35}>
            <AreaChart data={sparklineData.titles}>
              <defs>
                <linearGradient id="gradient-red" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E50914" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#E50914" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradient-red)" 
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movies */}
      <div className="card gold-card">
        <div className="card-header">
          <div className="card-title-box">
            <h2>Movies</h2>
            <p className="card-value">{formatNumber(kpi.total_movies ?? 6133)}</p>
            <div className="card-change">
              <span className="change-value text-gold">+10.2%</span>
              <span className="change-label">vs last update</span>
            </div>
          </div>
          <div className="card-icon-container bg-gold-dim">
            <Film className="card-icon text-gold" size={22} />
          </div>
        </div>
        <div className="card-sparkline">
          <ResponsiveContainer width="100%" height={35}>
            <AreaChart data={sparklineData.movies}>
              <defs>
                <linearGradient id="gradient-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E0A96D" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#E0A96D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#E0A96D" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradient-gold)" 
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TV Shows */}
      <div className="card red-card">
        <div className="card-header">
          <div className="card-title-box">
            <h2>TV Shows</h2>
            <p className="card-value">{formatNumber(kpi.total_tvshows ?? 2674)}</p>
            <div className="card-change">
              <span className="change-value text-red">+15.8%</span>
              <span className="change-label">vs last update</span>
            </div>
          </div>
          <div className="card-icon-container bg-red-dim">
            <Tv className="card-icon text-red" size={22} />
          </div>
        </div>
        <div className="card-sparkline">
          <ResponsiveContainer width="100%" height={35}>
            <AreaChart data={sparklineData.tvShows}>
              <defs>
                <linearGradient id="gradient-red-2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E50914" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#E50914" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#E50914" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradient-red-2)" 
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Countries */}
      <div className="card gold-card">
        <div className="card-header">
          <div className="card-title-box">
            <h2>Countries</h2>
            <p className="card-value">{formatNumber(kpi.total_countries ?? 749)}</p>
            <div className="card-change">
              <span className="change-value text-gold">+8.7%</span>
              <span className="change-label">vs last update</span>
            </div>
          </div>
          <div className="card-icon-container bg-gold-dim">
            <Globe className="card-icon text-gold" size={22} />
          </div>
        </div>
        <div className="card-sparkline">
          <ResponsiveContainer width="100%" height={35}>
            <AreaChart data={sparklineData.countries}>
              <defs>
                <linearGradient id="gradient-gold-2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E0A96D" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#E0A96D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#E0A96D" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradient-gold-2)" 
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default KPIcards;
