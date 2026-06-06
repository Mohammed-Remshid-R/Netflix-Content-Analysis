import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { releaseTrendData } from '../data/netflixData';

function ReleaseTrendChart({ data }) {
  const [period, setPeriod] = useState('yearly');

  // Pull data depending on chosen period
  const trendData = releaseTrendData[period] || releaseTrendData.yearly;

  // Filter or map for the line chart
  const chartData = trendData.map((d) => ({
    label: d.year,
    value: d.value
  }));

  // Custom Tooltip component matching Netflix black-gold style
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip bg-[#121212] border border-[#222] p-2.5 rounded-lg shadow-2xl">
          <p className="tooltip-year text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{payload[0].payload.label}</p>
          <p className="tooltip-value text-xs text-white mt-0.5">
            <strong>{payload[0].value.toLocaleString()}</strong> Titles Added
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-box content-added-box">
      <div className="chart-header-row">
        <h2>Content Added Over the Years</h2>
        <div className="chart-actions">
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="yearly-dropdown bg-[#111] border border-white/5 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold focus:outline-none cursor-pointer hover:bg-white/5 transition-colors"
          >
            <option value="yearly">Yearly</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div className="chart-container mt-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart 
            data={chartData} 
            margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E50914" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#E50914" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#222" strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke="#555" 
              tick={{ fill: '#777', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              stroke="#555" 
              tick={{ fill: '#777', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val >= 1000 ? `${val/1000}K` : val}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#E50914" 
              strokeWidth={3} 
              fillOpacity={1}
              fill="url(#trend-gradient)"
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
  );
}

export default ReleaseTrendChart;
