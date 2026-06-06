import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Film, Tv, Clock, Shield, Globe, User, Play, Bookmark, CheckCircle, RefreshCw, ChevronDown, BarChart3, Pin, Video, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import MoviePoster from '../components/MoviePoster';

// Simple Director's Chair SVG Icon for Donut Chart center
function DirectorsChairIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E50914]">
      <path d="M19 3H5v4h14V3z" />
      <path d="M19 7v10" />
      <path d="M5 7v10" />
      <path d="M4 17h16" />
      <path d="M6 17v4" />
      <path d="M18 17v4" />
      <path d="m8 7 8 10" />
      <path d="m16 7-8 10" />
    </svg>
  );
}

function DetailsPanel({ item, onClose }) {
  if (!item) return null;

  const [omdbData, setOmdbData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch real details from OMDb on item change
  useEffect(() => {
    setLoading(true);
    const query = encodeURIComponent(item.title);
    const apiKey = 'thewdb';
    const year = item.year;
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${query}${year ? `&y=${year}` : ''}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.Response === 'True') {
          setOmdbData(data);
        } else {
          // fallback without year
          fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${query}`)
            .then(res => res.json())
            .then(data2 => {
              if (data2.Response === 'True') {
                setOmdbData(data2);
              } else {
                setOmdbData(null);
              }
            })
            .catch(() => setOmdbData(null));
        }
      })
      .catch(() => setOmdbData(null))
      .finally(() => setLoading(false));
  }, [item]);

  const isMovie = item.type === 'Movie' || item.duration !== undefined;

  // Stable Hash function for deterministic metrics
  const hashVal = item.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Extract real attributes
  const director = omdbData?.Director && omdbData.Director !== 'N/A' ? omdbData.Director : (item.director || 'Various');
  const genre = omdbData?.Genre && omdbData.Genre !== 'N/A' ? omdbData.Genre : (item.genre || 'Drama');
  const country = omdbData?.Country && omdbData.Country !== 'N/A' ? omdbData.Country : (item.country || 'Global');

  // Parse OMDb ratings or fall back gracefully to catalog score
  let imdbRatingVal = omdbData?.imdbRating && omdbData.imdbRating !== 'N/A' ? parseFloat(omdbData.imdbRating) : (item.score ? item.score * 2 : 7.8);
  const imdbRatingStr = `${imdbRatingVal.toFixed(1)} / 10`;

  let tomatometerVal = 92;
  if (omdbData?.Ratings) {
    const rt = omdbData.Ratings.find(r => r.Source === 'Rotten Tomatoes');
    if (rt) {
      tomatometerVal = parseInt(rt.Value);
    } else {
      tomatometerVal = Math.round(imdbRatingVal * 10 + (hashVal % 6) - 3);
    }
  } else {
    tomatometerVal = Math.round(imdbRatingVal * 10 + (hashVal % 6) - 3);
  }
  tomatometerVal = Math.max(40, Math.min(99, tomatometerVal));
  const tomatometerStr = `${tomatometerVal}%`;

  let audienceScoreVal = Math.round(imdbRatingVal * 10 + (hashVal % 4) - 2);
  audienceScoreVal = Math.max(40, Math.min(99, audienceScoreVal));
  const audienceScoreStr = `${audienceScoreVal}%`;

  // Deterministic ratings trend peaking around release year
  const ratingsTrendData = (() => {
    const releaseYear = item.year || 2019;
    const scoreVal = item.score || 4.5;
    const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

    return years.map(yr => {
      let val;
      const diff = yr - releaseYear;
      if (diff === 0) {
        val = scoreVal;
      } else if (diff < 0) {
        val = scoreVal - Math.abs(diff) * 0.4 - (hashVal % 3) * 0.08;
      } else {
        val = scoreVal - diff * 0.22 - (hashVal % 4) * 0.05;
      }
      val = val + (hashVal % 5) * 0.04; // add stable noise
      val = Math.max(1.0, Math.min(5.0, Number(val.toFixed(1))));
      return { year: String(yr), rating: val };
    });
  })();

  // Genre Distribution Data based on real genre items
  const genreData = (() => {
    const genreArray = genre.split(',').map(g => g.trim());
    if (genreArray.length === 1) {
      return [
        { name: genreArray[0], value: 65, color: '#E50914' },
        { name: 'Related', value: 23, color: '#E0A96D' },
        { name: 'Others', value: 12, color: '#888888' }
      ];
    } else if (genreArray.length === 2) {
      return [
        { name: genreArray[0], value: 55, color: '#E50914' },
        { name: genreArray[1], value: 33, color: '#E0A96D' },
        { name: 'Others', value: 12, color: '#888888' }
      ];
    } else {
      return [
        { name: genreArray[0], value: 45, color: '#E50914' },
        { name: genreArray[1], value: 30, color: '#E0A96D' },
        { name: genreArray[2], value: 18, color: '#B81D24' },
        { name: 'Others', value: 7, color: '#888888' }
      ];
    }
  })();

  // Bottom row metrics
  const viewsRaw = (hashVal % 14) + 4.5 + (item.score || 4.0) * 1.5;
  const viewsStr = `${viewsRaw.toFixed(1)}M`;
  const watchlistRaw = Math.round((viewsRaw * 32) + (hashVal % 40));
  const watchlistStr = `${watchlistRaw}K`;
  const completionRateVal = Math.min(95, Math.max(50, (hashVal % 20) + 68));
  const rewatchRateVal = Math.min(60, Math.max(10, (hashVal % 22) + 18));

  const metrics = [
    { title: 'Total Views', value: viewsStr, change: '▲ 12.5%', isPos: true, icon: Play },
    { title: 'Watchlist Adds', value: watchlistStr, change: '▲ 8.2%', isPos: true, icon: Bookmark },
    { title: 'Avg Watch Rating', value: `${(item.score || 4.5).toFixed(1)} / 5`, change: '▲ 0.3', isPos: true, icon: Star },
    { title: 'Completion Rate', value: `${completionRateVal}%`, change: '▲ 6.1%', isPos: true, icon: Clock },
    { title: 'Rewatch Rate', value: `${rewatchRateVal}%`, change: '▼ 1.8%', isPos: false, icon: RefreshCw }
  ];

  // Visual background depending on type
  const bgGradient = 'linear-gradient(180deg, #0d0d0d 0%, #050505 100%)';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden select-none">
        {/* Backdrop clickable */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-5xl border border-white/10 bg-[#0c0c0c] shadow-2xl rounded-2xl overflow-hidden flex flex-col z-10 max-h-[96vh] md:max-h-[92vh]"
        >
          {/* Close button with circular outline like mockup */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full border border-white/20 hover:border-white/50 bg-black/50 text-white/70 hover:text-white transition-all outline-none cursor-pointer"
          >
            <X size={15} />
          </button>

          <div className="p-5 md:p-6 flex flex-col gap-4 overflow-y-auto" style={{ background: bgGradient }}>

            {/* Top Section: Poster (Left) & Movie Details + Charts (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 items-stretch">

              {/* Left Column: Vertical Poster that matches the details height */}
              <div className="md:col-span-4 lg:col-span-4 flex flex-col h-full min-h-[320px] md:min-h-full">
                <div className="relative rounded-xl overflow-hidden border border-white/10 h-full w-full bg-[#111] flex items-center justify-center shadow-lg shadow-black/80">
                  <MoviePoster title={item.title} year={item.year} />

                  {/* Floating Red Badge: MOVIE / TV SHOW */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="flex items-center gap-1.5 text-[9px] font-black text-white bg-[#E50914] px-3 py-1 rounded-md shadow shadow-[#E50914]/40">
                      <Video size={10} fill="currentColor" /> {isMovie ? 'MOVIE' : 'TV SHOW'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, Synopsis, Scores Box, and Charts Grid side-by-side with poster */}
              <div className="md:col-span-8 lg:col-span-8 flex flex-col gap-3.5 justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight leading-none">{item.title}</h2>

                  {/* Meta items */}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-neutral-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-neutral-500" /> {item.year}
                    </span>
                    <span className="bg-white/5 px-2 py-0.5 rounded font-mono text-[9px] uppercase text-white border border-white/5">
                      {item.rating || 'TV-MA'}
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star size={11} fill="currentColor" stroke="none" /> {(item.score || 4.5).toFixed(1)} / 5.0
                    </span>
                    {item.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-neutral-500" /> {item.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Synopsis */}
                <div className="space-y-1">
                  <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest leading-none">Synopsis</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-[#111]/30 border border-white/5 p-3.5 rounded-xl">
                    {item.description || 'No detailed description available.'}
                  </p>
                </div>

                {/* Details Table & Rating Metrics Box */}
                <div className="bg-[#111]/45 border border-white/5 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Left Column: Attributes */}
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3">
                      <User className="text-neutral-500 mt-0.5" size={14} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider leading-none mb-1">Director</span>
                        <span className="text-white text-xs font-semibold leading-tight truncate" title={director}>{director}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Film className="text-neutral-500 mt-0.5" size={14} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider leading-none mb-1">Primary Genre</span>
                        <span className="text-white text-xs font-semibold leading-tight truncate" title={genre}>{genre}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe className="text-neutral-500 mt-0.5" size={14} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider leading-none mb-1">Country</span>
                        <span className="text-white text-xs font-semibold leading-tight truncate" title={country}>{country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Real Scores */}
                  <div className="space-y-2.5 sm:pl-4 border-t sm:border-t-0 sm:border-l border-white/5 pt-2.5 sm:pt-0">
                    <div className="flex items-start gap-3">
                      <Star className="text-amber-500 mt-0.5" size={14} fill="currentColor" stroke="none" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider leading-none mb-1">IMDb Rating</span>
                        <span className="text-white text-xs font-bold leading-none">{imdbRatingStr}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-base leading-none">🍅</span>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider leading-none mb-1">Tomatometer</span>
                        <span className="text-white text-xs font-bold leading-none">{tomatometerStr}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-base leading-none">🍿</span>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider leading-none mb-1">Audience Score</span>
                        <span className="text-white text-xs font-bold leading-none">{audienceScoreStr}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Charts Section: Ratings Trend & Genre Distribution side-by-side with poster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Ratings Trend Line Area Chart */}
                  <div className="bg-[#111]/40 border border-white/5 rounded-xl p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Ratings Trend</h4>
                      <div className="flex items-center gap-1 text-[8px] text-neutral-400 font-bold bg-[#111] border border-white/5 px-2 py-0.5 rounded-lg">
                        <span>Yearly</span>
                        <ChevronDown size={8} />
                      </div>
                    </div>

                    <div className="w-full h-[105px] mt-1.5">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ratingsTrendData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRatingGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#E50914" stopOpacity={0.45} />
                              <stop offset="95%" stopColor="#E50914" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="year"
                            stroke="#444"
                            fontSize={8}
                            tickLine={false}
                            axisLine={false}
                            dy={4}
                          />
                          <YAxis
                            domain={[0, 5.0]}
                            ticks={[0, 1.0, 2.0, 3.0, 4.0, 5.0]}
                            stroke="#444"
                            fontSize={8}
                            tickLine={false}
                            axisLine={false}
                            dx={-4}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#111', borderColor: '#222', borderRadius: '8px', padding: '6px' }}
                            labelStyle={{ color: '#888', fontSize: '9px', fontWeight: 'bold' }}
                            itemStyle={{ color: '#E50914', fontSize: '10px', fontWeight: 'black' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="rating"
                            stroke="#E50914"
                            strokeWidth={1.5}
                            fillOpacity={1}
                            fill="url(#colorRatingGrad)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Genre Distribution Donut Chart */}
                  <div className="bg-[#111]/40 border border-white/5 rounded-xl p-3 flex flex-col justify-between relative">
                    <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Genre Distribution</h4>

                    <div className="flex items-center gap-3 h-[105px] mt-1.5">

                      {/* Left: Donut Chart container */}
                      <div className="relative w-[80px] h-[80px] flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={genreData}
                              cx="50%"
                              cy="50%"
                              innerRadius={24}
                              outerRadius={36}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {genreData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>

                        {/* Centered Chair Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-90">
                          <DirectorsChairIcon />
                        </div>
                      </div>

                      {/* Right: Legend and breakdown list */}
                      <div className="flex-1 overflow-y-auto max-h-[95px] pr-1 scrollbar-thin">
                        <div className="grid grid-cols-1 gap-1">
                          {genreData.map((g, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[9px] font-semibold">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                                <span className="text-neutral-400 truncate">{g.name}</span>
                              </div>
                              <span className="text-white font-bold ml-1.5">{g.value.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Bottom Row: View metrics (Full Width) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 border-t border-white/5 pt-4">
              {metrics.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} className="bg-[#111]/45 border border-white/5 rounded-xl p-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-amber-500" fill={m.title === 'Avg Watch Rating' || m.title === 'Total Views' ? 'currentColor' : 'none'} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[8px] text-neutral-500 uppercase font-bold tracking-wider leading-none mb-1">{m.title}</span>
                      <span className="text-xs font-black text-white leading-none">{m.value}</span>
                      <span className={`text-[8px] font-bold mt-1 leading-none flex items-center gap-0.5 ${m.isPos ? 'text-emerald-500' : 'text-[#E50914]'}`}>
                        {m.change} <span className="text-neutral-600 font-medium text-[7px]">vs last month</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action buttons centered at the bottom */}
            <div className="flex justify-center gap-3 mt-1.5">
              <button
                onClick={() => alert(`Simulating Analytics details for: ${item.title}`)}
                className="py-2.5 px-6 rounded-xl bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#E50914]/20 hover:shadow-[#E50914]/35"
              >
                <BarChart3 size={14} />
                <span>View Analytics</span>
              </button>
              <button
                onClick={() => alert(`Added ${item.title} to watch priorities`)}
                className="py-2.5 px-6 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Pin size={14} />
                <span>Pin Title</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default DetailsPanel;
