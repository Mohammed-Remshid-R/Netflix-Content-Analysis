import React from 'react';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, LineChart, Line } from 'recharts';
import { analyticsData } from '../data/netflixData';

function Analytics() {
  const customTooltipStyle = {
    backgroundColor: '#121212',
    border: '1px solid #222',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '11px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BarChart3 className="text-[#E50914]" /> Advanced Analytics Platform
        </h1>
        <p className="text-sm text-neutral-400 mt-1">Audit viewer engagement distribution matrices, library growth stacked charts, and content popularities.</p>
      </div>

      {/* Stacked area library growth: Movies vs TV Shows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Library Content Growth */}
        <div className="bg-[#111]/30 border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={14} className="text-[#E50914]" /> Index Growth: Movies vs TV Shows
            </h2>
            <span className="text-[10px] text-neutral-500 font-bold bg-[#111] px-2 py-0.5 rounded border border-white/5 uppercase">
              Accumulative Monthly
            </span>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.contentGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
                <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area type="monotone" dataKey="movies" stackId="1" stroke="#E50914" fill="#E50914" fillOpacity={0.25} />
                <Area type="monotone" dataKey="tvShows" stackId="1" stroke="#E0A96D" fill="#E0A96D" fillOpacity={0.25} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Viewer Engagement Distribution */}
        <div className="bg-[#111]/30 border border-white/5 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Users size={14} className="text-[#E0A96D]" /> Hourly Engagement Density Matrix
            </h2>
            <span className="text-[10px] text-[#E0A96D] font-bold bg-[#111] px-2 py-0.5 rounded border border-white/5 uppercase">
              Live Peak Hours
            </span>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.viewerEngagement} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
                <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#E0A96D"
                  strokeWidth={3}
                  dot={{ fill: '#E0A96D', r: 4 }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Genre Popularity Benchmarks */}
      <div className="bg-[#111]/30 border border-white/5 p-6 rounded-2xl space-y-4">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
          <Award size={14} className="text-emerald-500" /> Genre Quality Index Benchmark
        </h2>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.genrePopularity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="genre" stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
              <YAxis stroke="#555" tick={{ fill: '#777', fontSize: 11 }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="score" fill="#E50914" radius={[4, 4, 0, 0]}>
                {analyticsData.genrePopularity.map((entry, index) => (
                  <Area key={`cell-${index}`} fill={index % 2 === 0 ? '#E50914' : '#E0A96D'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
