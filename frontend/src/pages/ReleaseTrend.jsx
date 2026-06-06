import React from 'react';
import { TrendingUp, Award, Calendar, Film } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function ReleaseTrend() {
  const { trendPeriod, setTrendPeriod, getTrendData } = useDashboard();
  const data = getTrendData();

  const chartData = data.map((d, index) => ({
    period: d.year,
    value: d.value
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip bg-[#121212] border border-[#222] p-3 rounded-lg shadow-2xl">
          <p className="tooltip-year text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{payload[0].payload.period}</p>
          <p className="tooltip-value text-xs text-white mt-1">
            <strong>{payload[0].value.toLocaleString()}</strong> Productions Added
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp className="text-[#E50914]" /> Content Addition Trends
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Audit content indexing volume additions across yearly, monthly and weekly aggregates.</p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex bg-[#111] p-1.5 rounded-xl border border-white/5">
          {['yearly', 'monthly', 'weekly'].map((period) => (
            <button
              key={period}
              onClick={() => setTrendPeriod(period)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${trendPeriod === period
                  ? 'bg-[#E50914] text-white'
                  : 'text-neutral-400 hover:text-white'
                }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Line Chart Grid */}
      <div className="bg-[#111]/30 border border-white/5 p-6 rounded-2xl">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="release-trend-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E50914" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#E50914" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="period"
                stroke="#555"
                tick={{ fill: '#777', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#555"
                tick={{ fill: '#777', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => val >= 1000 ? `${val / 1000}K` : val}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#E50914"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#release-trend-grad)"
                activeDot={{
                  r: 6,
                  fill: '#E50914',
                  stroke: '#fff',
                  strokeWidth: 2,
                  style: { filter: 'drop-shadow(0px 0px 8px rgba(229, 9, 20, 0.8))' }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Detail statistics breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-[#111]/30 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center">
            <Film size={20} className="text-[#E50914]" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">2018</span>
            <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5">Peak Release Year (1,647 titles)</p>
          </div>
        </div>

        <div className="p-5 bg-[#111]/30 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E0A96D]/10 border border-[#E0A96D]/20 flex items-center justify-center">
            <Calendar size={20} className="text-[#E0A96D]" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">December</span>
            <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5">Peak Upload Month (380 titles)</p>
          </div>
        </div>

        <div className="p-5 bg-[#111]/30 border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Award size={20} className="text-emerald-500" />
          </div>
          <div>
            <span className="text-2xl font-black text-white">+14.2%</span>
            <p className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5">Average Year-over-Year Growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReleaseTrend;
