import React, { useEffect, useState } from 'react';
import { Compass, Film, Tv, Star, BarChart, ChevronRight } from 'lucide-react';
import API from '../services/api';
import GenreChart from '../components/GenreChart';

// Small deterministic sparkline generator using genre name as seed
function Sparkline({ seed, color = '#E50914', width = 80, height = 24 }) {
  // deterministic pseudo-random using char codes
  const points = Array.from({ length: 8 }).map((_, i) => {
    const base = seed.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    const v = Math.abs(Math.sin((base + i) * 999.999)) * 0.8 + 0.1;
    return v;
  });
  const max = Math.max(...points);
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (p / max) * (height - 4) - 2;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="inline-block">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
    </svg>
  );
}

function Genres() {
  const [genresStats, setGenresStats] = useState([]);
  const [kpis, setKpis] = useState({ total_titles: 0, avg_rating: 0, total_views: 0, total_countries: 0, top_genre: '', top_genre_pct: 0 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await API.get('/genres/stats');
        if (!mounted) return;
        const data = res.data || {};
        setGenresStats(data.genres || []);
        setKpis({
          total_titles: data.total_titles || 0,
          avg_rating: data.avg_rating || 0,
          total_views: data.total_views || 0,
          total_countries: data.total_countries || 0,
          top_genre: data.top_genre || '',
          top_genre_pct: data.top_genre_pct || 0,
        });
      } catch (err) {
        console.error('Failed to fetch genres stats', err);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  function formatViews(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  }

  // Data for the donut chart component
  const donutData = {
    labels: genresStats.map(g => g.genre),
    values: genresStats.map(g => g.count),
  };

  // For average rating bar chart
  const avgByGenre = [...genresStats].sort((a, b) => b.avg_rating - a.avg_rating).slice(0, 8);
  const topPerformers = [...genresStats].sort((a, b) => b.views - a.views).slice(0, 5);
  const trendIcons = [Film, Tv, Star, BarChart, Compass];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Compass className="text-[#E50914]" /> Genre Distribution Analytics
          </h1>
          <p className="label-small text-neutral-400 mt-1">Select a genre to audit matching movies and TV shows index allocations.</p>
        </div>

        <div className="mt-1">
          <button className="bg-transparent border border-white/5 text-neutral-300 px-4 py-2 rounded-lg">Export Data</button>
        </div>
      </div>

      <div className="kpi-container">
        <div className="card red-card">
          <div className="card-header">
            <h2>Total Titles</h2>
          </div>
          <div className="card-value">{kpis.total_titles.toLocaleString()}</div>
          <div className="card-change">
            <span className="change-value text-green-400">+10.7%</span>
            <span className="change-label">vs last month</span>
          </div>
          <div className="card-sparkline mt-4">
            <Sparkline seed={`titles-${kpis.total_titles}`} color="#E50914" />
          </div>
        </div>

        <div className="card gold-card">
          <div className="card-header">
            <h2>Avg. Rating</h2>
          </div>
          <div className="card-value text-amber-400">{kpis.avg_rating.toFixed(1)}</div>
          <div className="card-change">
            <span className="change-value text-green-400">+0.7</span>
            <span className="change-label">vs last month</span>
          </div>
          <div className="card-sparkline mt-4">
            <Sparkline seed={`avg-${kpis.avg_rating}`} color="#E0A96D" />
          </div>
        </div>

        <div className="card red-card">
          <div className="card-header">
            <h2>Total Views</h2>
          </div>
          <div className="card-value">{formatViews(kpis.total_views)}</div>
          <div className="card-change">
            <span className="change-value text-green-400">+12.5%</span>
            <span className="change-label">vs last month</span>
          </div>
          <div className="card-sparkline mt-4">
            <Sparkline seed={`views-${kpis.total_views}`} color="#E50914" />
          </div>
        </div>

        <div className="card red-card">
          <div className="card-header">
            <h2>Countries Covered</h2>
          </div>
          <div className="card-value">{kpis.total_countries}</div>
          <div className="card-change">
            <span className="change-value text-green-400">+6</span>
            <span className="change-label">vs last month</span>
          </div>
          <div className="card-sparkline mt-4">
            <Sparkline seed={`countries-${kpis.total_countries}`} color="#E50914" />
          </div>
        </div>

        <div className="card red-card">
          <div className="card-header">
            <h2>Top Genre</h2>
          </div>
          <div className="card-value">{kpis.top_genre || '—'}</div>
          <div className="card-change text-neutral-400">{kpis.top_genre_pct ? `${kpis.top_genre_pct}% of total titles` : '—'}</div>
          <div className="card-sparkline mt-4">
            <Sparkline seed={`top-genre-${kpis.top_genre}`} color="#E50914" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="card p-6">
          <div className="chart-header-row mb-5">
            <div>
              <h2 className="section-header">Genre Distribution</h2>
              <p className="label-small text-neutral-400 mt-1">Sorted by title share, average rating and total views.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="text-xs text-neutral-400 uppercase tracking-[0.12em] border-b border-white/10">
                <tr>
                  <th className="text-left px-3 py-3">#</th>
                  <th className="text-left px-3 py-3">Genre</th>
                  <th className="text-right px-3 py-3">Titles</th>
                  <th className="text-right px-3 py-3">% of Total</th>
                  <th className="text-right px-3 py-3">Avg. Rating</th>
                  <th className="text-right px-3 py-3">Total Views</th>
                  <th className="text-right px-3 py-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {genresStats.map((g, idx) => (
                  <tr key={g.genre} className="hover:bg-white/[0.03] border-b border-white/5">
                    <td className="px-3 py-3 text-neutral-400">{idx + 1}</td>
                    <td className="px-3 py-3 font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                      {g.genre}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">{g.count.toLocaleString()}</td>
                    <td className="px-3 py-3 text-right">{g.percentage}%</td>
                    <td className="px-3 py-3 text-right text-amber-400 font-bold">{g.avg_rating.toFixed(1)}</td>
                    <td className="px-3 py-3 text-right">{formatViews(g.views)}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end">
                        <Sparkline seed={g.genre} color={g.color} width={80} height={28} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-neutral-400 mt-5">
            <div>Showing 1 to {genresStats.length} of {genresStats.length} genres</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 rounded-md border border-white/10 text-neutral-400">&lt;</button>
              <button className="px-3 py-2 rounded-md border border-white/10 text-white bg-white/5">1</button>
              <button className="px-3 py-2 rounded-md border border-white/10 text-neutral-400">&gt;</button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <GenreChart data={donutData} title="Genre Share" />

          <div className="chart-box">
            <div className="chart-header-row mb-5">
              <h2 className="section-header">Average Rating by Genre</h2>
              <button className="date-picker-btn">View All</button>
            </div>

            <div className="space-y-3">
              {avgByGenre.map((g) => (
                <div key={g.genre} className="flex items-center gap-3">
                  <div className="w-32 text-xs text-neutral-400">{g.genre}</div>
                  <div className="flex-1 bg-white/5 rounded-full h-3 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#E50914] via-[#D8232A] to-[#B81D24]" style={{ width: `${(g.avg_rating / 5) * 100}%` }} />
                  </div>
                  <div className="w-10 text-right text-sm font-bold text-white">{g.avg_rating.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Genres (by Views) - Full Width */}
      <div className="bg-[#0e0e0f] border border-white/5 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-neutral-300 mb-3">Top Performing Genres (by Views)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {topPerformers.map((g, idx) => {
            const Icon = trendIcons[idx % trendIcons.length];
            const percentChange = Math.abs(Math.round((g.count / Math.max(1, kpis.total_titles)) * 1000) / 10);
            return (
              <div key={g.genre} className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#111] p-4 transition-all hover:border-white/20">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-[#0f0f10] border border-white/10 flex items-center justify-center">
                    <Icon className="text-[#E50914]" size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-neutral-400 truncate">{g.genre}</div>
                    <div className="text-xl font-bold text-white mt-1">{formatViews(g.views)}</div>
                    <div className="text-[11px] text-green-400 mt-1">+{percentChange}% vs last month</div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 bg-[#0f0f10] flex items-center justify-center transition-all group-hover:border-[#E50914]/40">
                  <ChevronRight size={16} className="text-neutral-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default Genres;
