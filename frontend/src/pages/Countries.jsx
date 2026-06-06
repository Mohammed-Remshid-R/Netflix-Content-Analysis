import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Globe,
  MapPin,
  Minus,
  Plus,
  Star,
  Target,
} from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts';
import API from '../services/api';
import { countryData, moviesData, tvShowsData } from '../data/netflixData';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const mapMarkers = [
  { name: 'United States', coordinates: [-97.0, 38.5], value: 320, color: '#E50914' },
  { name: 'India', coordinates: [78.9, 21.0], value: 210, color: '#E0A96D' },
  { name: 'United Kingdom', coordinates: [-1.5, 54.0], value: 140, color: '#E50914' },
  { name: 'Japan', coordinates: [138.0, 36.0], value: 110, color: '#E50914' },
  { name: 'South Korea', coordinates: [127.8, 35.9], value: 96, color: '#E50914' },
];

const regionDonutData = [
  { name: 'North America', value: 34, color: '#E50914' },
  { name: 'Asia Pacific', value: 26, color: '#E0A96D' },
  { name: 'Europe', value: 18, color: '#D8232A' },
  { name: 'Others', value: 22, color: '#B81D24' },
];

const trendSeries = [
  { year: '2016', US: 430, India: 210, UK: 125, Japan: 80, Others: 190 },
  { year: '2017', US: 490, India: 235, UK: 135, Japan: 95, Others: 215 },
  { year: '2018', US: 560, India: 260, UK: 150, Japan: 105, Others: 240 },
  { year: '2019', US: 610, India: 285, UK: 162, Japan: 120, Others: 270 },
  { year: '2020', US: 640, India: 310, UK: 170, Japan: 135, Others: 295 },
  { year: '2021', US: 720, India: 345, UK: 188, Japan: 148, Others: 330 },
  { year: '2022', US: 760, India: 370, UK: 200, Japan: 162, Others: 355 },
  { year: '2023', US: 800, India: 395, UK: 215, Japan: 180, Others: 380 },
  { year: '2024', US: 830, India: 420, UK: 226, Japan: 192, Others: 405 },
];

const performanceRows = [
  { country: 'United States', titles: 2818, rating: 4.7, trend: [32, 45, 38, 52, 60, 54] },
  { country: 'India', titles: 972, rating: 4.3, trend: [18, 28, 24, 31, 39, 34] },
  { country: 'United Kingdom', titles: 419, rating: 4.4, trend: [14, 18, 16, 22, 27, 25] },
  { country: 'Japan', titles: 245, rating: 4.1, trend: [9, 12, 11, 15, 18, 16] },
  { country: 'South Korea', titles: 199, rating: 4.5, trend: [8, 11, 10, 13, 16, 15] },
  { country: 'Canada', titles: 181, rating: 4.4, trend: [7, 9, 8, 11, 14, 13] },
  { country: 'Spain', titles: 145, rating: 4.2, trend: [6, 8, 7, 9, 12, 11] },
  { country: 'France', titles: 124, rating: 4.3, trend: [5, 7, 6, 8, 10, 9] },
  { country: 'Mexico', titles: 110, rating: 4.0, trend: [4, 6, 5, 7, 9, 8] },
];

const CountrySparkline = ({ data, stroke }) => {
  const max = Math.max(...data, 1);
  const points = data
    .map((value, index) => `${(index / (data.length - 1)) * 92 + 4},${28 - (value / max) * 22}`)
    .join(' ');

  return (
    <svg width="100" height="32" viewBox="0 0 100 32" className="overflow-visible">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
};

function Countries() {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [zoom, setZoom] = useState(1.15);
  const [kpi, setKpi] = useState({ total_titles: 8807, total_countries: 749 });

  const topCountries = useMemo(
    () => [...countryData].sort((a, b) => b.count - a.count).slice(0, 6),
    []
  );

  useEffect(() => {
    API.get('/kpi')
      .then((response) => {
        setKpi((prev) => ({ ...prev, ...response.data }));
      })
      .catch(() => {
        // fallback to local counts if API is unavailable
      });
  }, []);

  const handleZoomIn = () => setZoom((current) => Math.min(current + 0.3, 4));
  const handleZoomOut = () => setZoom((current) => Math.max(current - 0.3, 1));

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Countries</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Content Production by Country</h1>
            <p className="max-w-2xl text-sm text-neutral-400 leading-6">Dive into Netflix’s global content distribution and review which production hubs are driving the most titles, ratings, and cross-market reach.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
            Export report
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-[24px] border border-white/5 bg-[#111]/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)] xl:col-span-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Titles tracked',
                value: kpi.total_titles.toLocaleString(),
                icon: <BarChart3 size={18} className="text-white" />,
                accent: 'from-[#E50914] to-[#B81D24]',
              },
              {
                label: 'Countries monitored',
                value: kpi.total_countries,
                icon: <Globe size={18} className="text-white" />,
                accent: 'from-[#E0A96D] to-[#C4935A]',
              },
              {
                label: 'Total views',
                value: '12.4M',
                icon: <Target size={18} className="text-white" />,
                accent: 'from-[#D8232A] to-[#E50914]',
              },
              {
                label: 'Avg. rating',
                value: '4.3/5',
                icon: <Star size={18} className="text-white" />,
                accent: 'from-[#8E6E45] to-[#E0A96D]',
              },
            ].map((metric) => (
              <button
                key={metric.label}
                className="group rounded-[28px] border border-white/10 bg-[#111] p-5 text-left transition hover:-translate-y-1 hover:border-white/20"
                type="button"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${metric.accent} text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)]`}>{metric.icon}</div>
                <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">{metric.label}</p>
                <p className="mt-3 text-3xl font-black text-white">{metric.value}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111]/85 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">Production map</p>
              <h2 className="text-xl font-black text-white">Regional footprint</h2>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#080808]/80 p-2">
              <button onClick={handleZoomOut} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-neutral-300 transition hover:border-white/20 hover:text-white" type="button">
                <Minus size={16} />
              </button>
              <button onClick={handleZoomIn} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-neutral-300 transition hover:border-white/20 hover:text-white" type="button">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="world-map-container min-h-[420px] rounded-[28px] border border-white/5 bg-[#080808]/65 p-4 shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]">
            <ComposableMap projectionConfig={{ scale: 145 }} width={980} height={500} className="w-full h-full">
              <ZoomableGroup zoom={zoom} center={[10, 20]}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#111"
                        stroke="#242424"
                        strokeWidth={0.5}
                      />
                    ))
                  }
                </Geographies>
                {mapMarkers.map((marker) => (
                  <Marker key={marker.name} coordinates={marker.coordinates}>
                    <g onClick={() => setSelectedCountry(marker.name)} className="cursor-pointer">
                      <circle r={marker.value / 25} fill={marker.color} fillOpacity={0.9} stroke="#fff" strokeWidth={1} />
                      <circle r={3} fill="#fff" />
                    </g>
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#111]/90 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">Active region</p>
                  <p className="mt-2 text-lg font-bold text-white">{selectedCountry}</p>
                </div>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E50914]/10 text-[#E50914] border border-white/10">
                  <MapPin size={18} />
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#111]/90 p-4">
              <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">Map intensity</p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase text-neutral-300">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#E50914]" /> High
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs uppercase text-neutral-400">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#C4935A]" /> Medium
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs uppercase text-neutral-400">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#6B1B1E]" /> Low
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#111]/85 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">Country share</p>
                <h2 className="text-lg font-black text-white">Regional distribution</h2>
              </div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E50914]/10 text-[#E50914] border border-white/10">
                <Globe size={18} />
              </div>
            </div>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="h-[220px] w-full xl:w-[220px]" style={{ minHeight: 220 }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={regionDonutData}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {regionDonutData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {regionDonutData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-3">
                    <div className="h-3.5 w-3.5 rounded-full" style={{ background: entry.color }} />
                    <div>
                      <p className="text-sm font-semibold text-white">{entry.name}</p>
                      <p className="text-xs text-neutral-400">{entry.value}% of all titles</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#111]/85 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">Top markets</p>
                <h2 className="text-lg font-black text-white">Highest title count</h2>
              </div>
              <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 transition hover:border-white/20 hover:text-white" type="button">
                Filter <ChevronDown size={14} />
              </button>
            </div>
            <div className="space-y-4">
              {topCountries.map((item, index) => (
                <div key={item.country} className="rounded-3xl border border-white/5 bg-[#0B0B0B]/95 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-white">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-white">{index + 1}</span>
                      <div>
                        <p>{item.country}</p>
                        <p className="text-xs text-neutral-500">{item.percentage}% share</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-300">{item.count.toLocaleString()} titles</p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#080808]">
                    <div className={`h-full rounded-full ${item.colorClass === 'progress-gold' ? 'bg-[#E0A96D]' : 'bg-[#E50914]'}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-white/10 bg-[#111]/85 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">Performance table</p>
              <h2 className="text-xl font-black text-white">Country performance overview</h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:text-white" type="button">
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[1.5fr_1fr_0.8fr_1fr] gap-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
              <span>Country</span>
              <span>Titles</span>
              <span>Avg rating</span>
              <span>Trend</span>
            </div>
            <div className="space-y-3">
              {performanceRows.map((row) => (
                <div key={row.country} className="grid grid-cols-[1.5fr_1fr_0.8fr_1fr] gap-3 rounded-3xl border border-white/5 bg-[#0B0B0B]/95 p-4">
                  <div>
                    <p className="font-semibold text-white">{row.country}</p>
                    <p className="text-xs text-neutral-500">Main production hub</p>
                  </div>
                  <div className="text-white">{row.titles.toLocaleString()}</div>
                  <div className="text-neutral-300">{row.rating.toFixed(1)}</div>
                  <div className="inline-flex items-center gap-2">
                    <CountrySparkline data={row.trend} stroke="#E50914" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#111]/85 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.24)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">Trend chart</p>
              <h2 className="text-lg font-black text-white">Titles trend by country</h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80 transition hover:border-white/20 hover:text-white" type="button">
              Yearly <ChevronDown size={14} />
            </button>
          </div>
          <div className="h-[360px] w-full" style={{ minHeight: 360 }}>
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={trendSeries} margin={{ top: 6, right: 12, left: -10, bottom: 2 }}>
                <CartesianGrid vertical={false} opacity={0.08} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} width={32} />
                <RechartsTooltip contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: 16 }} />
                <Legend verticalAlign="top" align="left" iconType="circle" wrapperStyle={{ color: '#d1d5db', paddingBottom: 24 }} />
                <Line type="monotone" dataKey="US" stroke="#E50914" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="India" stroke="#E0A96D" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="UK" stroke="#D8232A" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="Japan" stroke="#B81D24" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="Others" stroke="#6B1B1E" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 rounded-3xl border border-white/5 bg-[#080808] p-4 text-sm text-neutral-400">
            <p className="font-semibold text-white">Insight:</p>
            <p className="mt-2 leading-6">United States and India continue to lead global title production, while Europe and Asia Pacific maintain steady gains year over year.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Countries;
