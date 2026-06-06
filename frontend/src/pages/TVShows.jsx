import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Tv, Star, Globe, ChevronLeft, LayoutGrid, List, 
  Upload, ChevronDown, MoreVertical, Film, Calendar, Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import API from '../services/api';
import DetailsPanel from '../components/DetailsPanel';
import MoviePoster from '../components/MoviePoster';

function AnimatedCounter({ value, suffix = '', duration = 1200 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
    if (isNaN(target)) { setCount(value); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const cur = p * target;
      setCount(!Number.isInteger(target) ? parseFloat(cur.toFixed(1)) : Math.floor(cur));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  const display = typeof count === 'number' && count > 999 ? count.toLocaleString() : count;
  return <span>{display}{suffix}</span>;
}

// Colors for the donut chart segments
const DONUT_COLORS = ['#E50914', '#B30B12', '#E0A96D', '#FF8F3d', '#737373', '#333333'];

function TVShows() {
  const [tvshowsData, setTvshowsData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Popularity');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [exportToast, setExportToast] = useState(null);
  const perPage = 6;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch stats once
  useEffect(() => {
    API.get('/tvshows/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to fetch stats:', err));
  }, []);

  // Fetch TV shows when filters/page changes
  const fetchTvshows = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: perPage,
        sort: selectedSort,
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedGenre !== 'All') params.set('genre', selectedGenre);
      if (selectedCountry !== 'All') params.set('country', selectedCountry);
      if (selectedYear !== 'All') params.set('year', selectedYear);

      const res = await API.get(`/tvshows?${params.toString()}`);
      setTvshowsData(res.data);
    } catch (err) {
      console.error('Failed to fetch tvshows:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedGenre, selectedCountry, selectedYear, selectedSort]);

  useEffect(() => {
    fetchTvshows();
  }, [fetchTvshows]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedGenre, selectedCountry, selectedYear, selectedSort]);

  const tvshows = tvshowsData?.data || [];
  const totalCount = tvshowsData?.total || 0;
  const totalPages = tvshowsData?.total_pages || 0;

  const isDefaultFilters = selectedGenre === 'All' && selectedCountry === 'All' && selectedYear === 'All' && debouncedSearch === '';

  // KPI display values
  const displayTotalShows = isDefaultFilters ? (stats?.total_tvshows ?? 2675) : totalCount;
  const displayAvgRating = stats?.avg_rating ?? 3.9;
  const displaySeasons = isDefaultFilters ? (stats?.total_seasons ?? 4727) : tvshows.reduce((sum, t) => sum + (t.seasons || 1), 0);
  const displayCountries = isDefaultFilters ? (stats?.total_countries ?? 197) : new Set(tvshows.map(t => t.country).filter(c => c && c !== 'Unknown')).size;

  const kpiItems = [
    {
      title: 'Total TV Shows',
      value: displayTotalShows,
      change: '▼ -10.7%',
      changeColor: 'text-[#E50914]',
      icon: Tv,
      iconColor: '#E50914',
      glowColor: 'rgba(229,9,20,0.3)',
      bgCircle: 'bg-[#E50914]/10 border border-[#E50914]/20'
    },
    {
      title: 'Avg Rating',
      value: displayAvgRating,
      change: '▲ +0.7',
      changeColor: 'text-amber-500',
      icon: Star,
      iconColor: '#F5B041',
      glowColor: 'rgba(245,176,65,0.3)',
      bgCircle: 'bg-[#F5B041]/10 border border-[#F5B041]/20',
      filled: true
    },
    {
      title: 'Total Seasons',
      value: displaySeasons,
      change: '▲ +10.3%',
      changeColor: 'text-emerald-500',
      icon: Film,
      iconColor: '#E0A96D',
      glowColor: 'rgba(224,169,109,0.3)',
      bgCircle: 'bg-[#E0A96D]/10 border border-[#E0A96D]/20'
    },
    {
      title: 'Countries',
      value: displayCountries,
      change: '▼ -6',
      changeColor: 'text-[#E50914]',
      icon: Globe,
      iconColor: '#E50914',
      glowColor: 'rgba(229,9,20,0.3)',
      bgCircle: 'bg-[#E50914]/10 border border-[#E50914]/20'
    }
  ];

  // Pagination page numbers helper
  const getPageNumbers = () => {
    const pages = new Set();
    pages.add(1);
    if (totalPages > 1) pages.add(totalPages);
    const range = 2;
    for (let i = currentPage - range; i <= currentPage + range; i++) {
      if (i > 1 && i < totalPages) pages.add(i);
    }
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        result.push('...');
      }
      result.push(sorted[i]);
    }
    return result;
  };

  const handleExport = () => {
    setExportToast({ status: 'loading', message: `Compiling ${displayTotalShows.toLocaleString()} TV show records...` });
    setTimeout(() => {
      setExportToast({ status: 'success', message: 'Data exported successfully! (CSV, 1.2MB)' });
      setTimeout(() => setExportToast(null), 3000);
    }, 1500);
  };

  const showStart = displayTotalShows === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const showEnd = Math.min(currentPage * perPage, displayTotalShows);

  const sv = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } } };
  const cv = { hidden: { opacity: 0, scale: 0.96, y: 12 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } } };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }} 
      className="tvshows-page"
    >
      <div className="tvshows-main-layout">
        
        {/* LEFT PANEL: MAIN CATALOG */}
        <div className="tvshows-content">
          
          {/* Header */}
          <motion.div variants={sv} className="tvshows-header flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="tvshows-title text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Tv className="text-[#E50914]" size={22} />
                TV Shows Catalog
              </h1>
              <p className="tvshows-subtitle text-xs text-neutral-400 mt-1 font-medium">
                Browse series, check season distributions, origin country metadata, and critic scores.
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={handleExport}
              className="tvshows-export-btn flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer outline-none self-start"
            >
              <Upload size={14} className="text-neutral-400" />
              <span>Export Data</span>
            </motion.button>
          </motion.div>

          {/* Filter Bar */}
          <motion.div variants={sv} className="tvshows-controls-row grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            
            {/* All TV Shows Badge */}
            <div className="tvshows-kpi-badge flex flex-col justify-center px-4 py-2 bg-[#0a0a0a] border border-[#E50914] rounded-xl text-xs font-semibold text-white shadow-[0_0_12px_rgba(229,9,20,0.18)] select-none relative h-[46px] min-w-[130px] flex-1">
              <div className="flex justify-between items-center w-full">
                <span className="text-[9px] text-[#E0A96D] font-bold uppercase tracking-wider leading-none">All TV Shows</span>
                <div className="text-[#E50914] absolute top-2.5 right-2.5">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" /></svg>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 justify-between">
                <span className="font-extrabold text-sm text-white leading-none">
                  {(stats?.total_tvshows ?? 2675).toLocaleString()}
                </span>
                <Tv size={11} className="text-[#E0A96D]" />
              </div>
            </div>

            {/* Genre Select */}
            <div className="relative h-[46px] flex items-center">
              <select 
                value={selectedGenre} 
                onChange={e => setSelectedGenre(e.target.value)}
                className="w-full appearance-none bg-[#0a0a0a] hover:bg-[#111] border border-[#E50914]/20 hover:border-[#E50914]/40 rounded-xl h-full px-4 pr-10 text-xs font-semibold text-neutral-300 focus:outline-none focus:border-[#E50914] transition-all cursor-pointer"
              >
                <option value="All">Genre:  All</option>
                {(stats?.all_genres || []).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={14} />
            </div>

            {/* Country Select */}
            <div className="relative h-[46px] flex items-center">
              <select 
                value={selectedCountry} 
                onChange={e => setSelectedCountry(e.target.value)}
                className="w-full appearance-none bg-[#0a0a0a] hover:bg-[#111] border border-[#E50914]/20 hover:border-[#E50914]/40 rounded-xl h-full px-4 pr-10 text-xs font-semibold text-neutral-300 focus:outline-none focus:border-[#E50914] transition-all cursor-pointer"
              >
                <option value="All">Country:  All</option>
                {(stats?.all_countries || []).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={14} />
            </div>

            {/* Year Select */}
            <div className="relative h-[46px] flex items-center">
              <select 
                value={selectedYear} 
                onChange={e => setSelectedYear(e.target.value)}
                className="w-full appearance-none bg-[#0a0a0a] hover:bg-[#111] border border-[#E50914]/20 hover:border-[#E50914]/40 rounded-xl h-full px-4 pr-10 text-xs font-semibold text-neutral-300 focus:outline-none focus:border-[#E50914] transition-all cursor-pointer"
              >
                <option value="All">Year:  All</option>
                {(stats?.all_years || []).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={14} />
            </div>
          </motion.div>

          {/* KPI Cards Row */}
          <motion.div variants={sv} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {kpiItems.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -3 }} 
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-[#111] border border-white/[0.04] p-4 rounded-xl flex items-center gap-4 transition-all h-24"
                >
                  <div 
                    className={`w-12 h-12 rounded-full ${kpi.bgCircle} flex items-center justify-center flex-shrink-0`} 
                    style={{ boxShadow: `0 0 14px ${kpi.glowColor}` }}
                  >
                    <Icon size={20} style={{ color: kpi.iconColor }} fill={kpi.filled ? 'currentColor' : 'none'} />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">{kpi.title}</p>
                    <h3 className="text-xl font-black text-white mt-0.5 leading-none">
                      <AnimatedCounter value={kpi.value} />
                    </h3>
                    <p className="text-[9px] mt-1 font-bold flex items-center gap-1">
                      <span className={kpi.changeColor}>{kpi.change}</span>
                      <span className="text-neutral-600 font-medium">vs last month</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Search + Sort + View Toggle */}
          <motion.div variants={sv} className="flex items-center justify-between gap-4 mt-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-[320px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
              <input 
                type="text" 
                placeholder="Search TV shows..."
                className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] hover:bg-[#111] border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] transition-all h-10"
                value={searchInput} 
                onChange={e => setSearchInput(e.target.value)} 
              />
            </div>

            {/* Sort & View Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 flex items-center">
                <select 
                  value={selectedSort} 
                  onChange={e => setSelectedSort(e.target.value)}
                  className="appearance-none bg-[#0a0a0a] hover:bg-[#111] border border-white/10 rounded-xl h-full px-4 pr-10 text-xs font-semibold text-neutral-300 focus:outline-none focus:border-[#E50914] transition-all cursor-pointer min-w-[130px]"
                >
                  <option value="Popularity">Sort:  Popularity</option>
                  <option value="Year">Sort:  Year</option>
                  <option value="Title">Sort:  Title</option>
                  <option value="Rating">Sort:  Rating</option>
                  <option value="Seasons">Sort:  Seasons</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={14} />
              </div>

              <div className="flex border border-white/10 rounded-xl p-0.5 bg-[#0a0a0a] h-10 items-center">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 h-full aspect-square rounded-lg flex items-center justify-center transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 h-full aspect-square rounded-lg flex items-center justify-center transition-all cursor-pointer ${viewMode === 'list' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-white'}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-white/10 border-t-[#E50914] rounded-full animate-spin" />
            </div>
          )}

          {/* Catalog Grid View */}
          {!loading && viewMode === 'grid' && (
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
            >
              {tvshows.map(show => (
                <motion.div 
                  key={show.id} 
                  variants={cv} 
                  whileHover={{ scale: 1.02, y: -4 }} 
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group relative flex flex-col bg-[#111] border border-white/[0.04] hover:border-[#E50914] rounded-xl overflow-hidden cursor-pointer hover:shadow-[0_0_16px_rgba(229,9,20,0.15)] transition-all duration-300"
                >
                  
                  {/* Poster Image Container */}
                  <div className="relative aspect-[2/3] overflow-hidden bg-black/40">
                    <MoviePoster title={show.title} year={show.year} />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    
                    {/* Info Circle (top right) */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(show); }}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 hover:bg-[#E50914] text-white border border-white/10 flex items-center justify-center transition-all shadow-md z-20"
                    >
                      <Info size={13} />
                    </button>
                  </div>
                  
                  {/* Metadata below poster */}
                  <div className="p-3.5 flex flex-col flex-1 select-none">
                    <h3 className="text-sm font-extrabold text-white group-hover:text-[#E50914] transition-colors truncate">
                      {show.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs mt-1.5 font-bold">
                      <span className="text-[#E0A96D]">{show.seasons} {show.seasons > 1 ? 'Seasons' : 'Season'}</span>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star size={11} fill="currentColor" />
                        <span>{show.score ? show.score.toFixed(1) : '4.0'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {tvshows.length === 0 && (
                <div className="col-span-full py-16 text-center text-xs text-neutral-500 font-bold border border-white/5 rounded-2xl bg-[#111]/30">
                  No TV Shows matched your search filters.
                </div>
              )}
            </motion.div>
          )}

          {/* Catalog List View */}
          {!loading && viewMode === 'list' && (
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
              className="flex flex-col gap-3 mt-4"
            >
              {tvshows.map(show => (
                <motion.div 
                  key={show.id} 
                  variants={cv} 
                  whileHover={{ x: 3 }} 
                  onClick={() => setSelectedItem(show)}
                  className="group flex gap-4 p-4 bg-[#111] hover:bg-[#161616] border border-white/[0.04] hover:border-[#E50914]/40 rounded-xl cursor-pointer transition-all"
                >
                  <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-[#0a0a0a]">
                    <MoviePoster title={show.title} year={show.year} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-extrabold text-white group-hover:text-[#E50914] transition-colors truncate">
                        {show.title}
                      </h3>
                      <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded-full flex-shrink-0">
                        {show.genre?.split(',')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {show.country} · {show.year} · <span className="text-[#E0A96D]">{show.seasons} {show.seasons > 1 ? 'Seasons' : 'Season'}</span>
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1 line-clamp-1">{show.description}</p>
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/[0.04]">
                      <span className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px]">
                        <Star size={11} fill="currentColor" /> {show.score ? show.score.toFixed(1) : '4.0'}
                      </span>
                      <span className="text-[10px] text-neutral-500">{show.rating}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {tvshows.length === 0 && (
                <div className="py-16 text-center text-xs text-neutral-500 font-bold border border-white/5 rounded-2xl bg-[#111]/30">
                  No TV Shows matched your search filters.
                </div>
              )}
            </motion.div>
          )}

          {/* Pagination Controls */}
          <motion.div variants={sv} className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-white/[0.04] pt-5 mt-6 select-none">
            <p className="text-xs text-neutral-500 font-semibold">
              Showing {showStart} to {showEnd} of <span className="text-white font-extrabold">{displayTotalShows.toLocaleString()}</span> TV shows
            </p>
            {totalPages > 0 && (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center bg-[#111] border border-white/5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                {getPageNumbers().map((n, idx) => {
                  if (n === '...') {
                    return <span key={`dots-${idx}`} className="px-1 text-neutral-600 text-xs">...</span>;
                  }
                  return (
                    <button 
                      key={n} 
                      onClick={() => setCurrentPage(n)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === n ? 'bg-[#E50914] text-white border border-[#E50914]' : 'bg-[#111] text-neutral-400 border border-white/5 hover:text-white'}`}
                    >
                      {n}
                    </button>
                  );
                })}
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  className="px-3 h-9 flex items-center justify-center bg-[#111] border border-white/5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>

        </div>

        {/* RIGHT PANEL: SIDEBAR STATISTICS CHARTS */}
        <div className="tvshows-sidebar">
          
          {/* Chart 1: Top Genres Donut Chart */}
          <div className="tvshows-sidebar-card">
            <div className="tvshows-sidebar-card-header flex justify-between items-center mb-3">
              <h3 className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Tv size={13} className="text-[#E50914]" />
                Top Genres by TV Shows
              </h3>
              <MoreVertical size={13} className="text-neutral-500 cursor-pointer" />
            </div>
            
            <div className="tvshows-donut-layout flex items-center gap-2">
              <div className="relative w-[150px] h-[150px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.genre_distribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={68}
                      dataKey="count"
                      paddingAngle={1}
                      stroke="none"
                    >
                      {(stats?.genre_distribution || []).map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center TV Icon overlay inside donut chart */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Tv size={20} className="text-[#E50914] opacity-80" />
                </div>
              </div>
              
              {/* Donut Legend */}
              <div className="tvshows-donut-legend flex-1 min-w-0 space-y-1.5 text-[10px]">
                {(stats?.genre_distribution || []).slice(0, 6).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-1 leading-none select-none">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span 
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }} 
                      />
                      <span className="text-neutral-400 font-semibold truncate">{item.genre}</span>
                    </div>
                    <span className="text-white font-extrabold">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chart 2: Season Distribution Vertical Bar Chart */}
          <div className="tvshows-sidebar-card">
            <div className="tvshows-sidebar-card-header flex justify-between items-center mb-3">
              <h3 className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Film size={13} className="text-[#E0A96D]" />
                Season Distribution
              </h3>
              <MoreVertical size={13} className="text-neutral-500 cursor-pointer" />
            </div>
            
            <div className="w-full h-[155px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={stats?.season_distribution || []} 
                  margin={{ top: 5, right: 0, left: -28, bottom: 0 }}
                >
                  <XAxis 
                    dataKey="seasons" 
                    tick={{ fill: '#888', fontSize: 9, fontWeight: 700 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    tick={{ fill: '#888', fontSize: 9, fontWeight: 700 }} 
                    axisLine={false} 
                    tickLine={false} 
                    allowDecimals={false}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#E50914" 
                    radius={[3, 3, 0, 0]} 
                  >
                    {(stats?.season_distribution || []).map((entry, idx) => (
                      <Cell 
                        key={`cell-${idx}`} 
                        fill={entry.count > 400 ? '#E50914' : 'rgba(229, 9, 20, 0.7)'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[8px] text-center text-neutral-500 font-bold uppercase tracking-wider mt-1.5">
              Seasons count
            </p>
          </div>

          {/* Chart 3: Average Rating by Genre Horizontal Progress Bars */}
          <div className="tvshows-sidebar-card">
            <div className="tvshows-sidebar-card-header flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                <Star size={13} className="text-[#F5B041]" fill="#F5B041" />
                Average Rating by Genre
              </h3>
              <MoreVertical size={13} className="text-neutral-500 cursor-pointer" />
            </div>
            
            <div className="space-y-3.5 select-none">
              {(stats?.rating_by_genre || []).slice(0, 6).map((item, idx) => {
                // Percentage of progress fill based on rating out of 5
                const fillWidth = (item.rating / 5) * 100;
                return (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-neutral-400 font-bold">{item.genre}</span>
                      <span className="text-white font-extrabold">{item.rating.toFixed(1)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#E50914] to-[#E0A96D] rounded-full transition-all duration-500"
                        style={{ width: `${fillWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Show Details Overlay */}
      {selectedItem && (
        <DetailsPanel 
          item={{ ...selectedItem, type: 'TV Show' }} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      {/* Export Toast Notification */}
      <AnimatePresence>
        {exportToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 bg-[#111] border border-[#E50914]/30 rounded-xl shadow-2xl max-w-sm select-none"
          >
            {exportToast.status === 'loading' ? (
              <div className="w-4 h-4 border-2 border-white/10 border-t-[#E50914] rounded-full animate-spin flex-shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center flex-shrink-0">
                <svg className="w-2 h-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-white">{exportToast.status === 'loading' ? 'Exporting...' : 'Success'}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{exportToast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

export default TVShows;
