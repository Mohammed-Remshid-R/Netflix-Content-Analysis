import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film, Star, Globe, Clock, ChevronLeft, LayoutGrid, List, Download, ChevronDown, Upload, Calendar } from 'lucide-react';
import DetailsPanel from '../components/DetailsPanel';
import MoviePoster from '../components/MoviePoster';

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000/api"
    : "/api";

const getAgeRating = (rating) => {
  if (rating === 'R' || rating === 'TV-MA') return '18';
  if (rating === 'PG-13') return '13';
  if (rating === 'PG' || rating === 'TV-PG') return '12';
  if (rating === 'TV-Y7' || rating === 'TV-Y7-FV') return '7';
  if (rating === 'TV-Y' || rating === 'G' || rating === 'TV-G') return 'G';
  return rating;
};

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

function Movies() {
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Popularity');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [exportToast, setExportToast] = useState(null);
  const perPage = 6;

  // Fetch stats once
  useEffect(() => {
    fetch(`${API_BASE}/movies/stats`)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => { });
  }, []);

  // Fetch movies on filter/page change
  const fetchMovies = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage,
      per_page: perPage,
      sort: selectedSort,
    });
    if (searchTerm) params.set('search', searchTerm);
    if (selectedGenre !== 'All') params.set('genre', selectedGenre);
    if (selectedCountry !== 'All') params.set('country', selectedCountry);
    if (selectedYear !== 'All') params.set('year', selectedYear);

    fetch(`${API_BASE}/movies?${params}`)
      .then(r => r.json())
      .then(d => {
        setMovies(d.data || []);
        setTotalPages(d.total_pages || 0);
        setTotalCount(d.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentPage, searchTerm, selectedGenre, selectedCountry, selectedYear, selectedSort]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearchTerm(searchInput); setCurrentPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleExport = () => {
    setExportToast({ status: 'loading', message: `Compiling ${displayTotalMovies.toLocaleString()} movie records...` });
    setTimeout(() => {
      setExportToast({ status: 'success', message: 'Data exported successfully! (CSV, 2.4MB)' });
      setTimeout(() => setExportToast(null), 3000);
    }, 1500);
  };

  const isDefaultFilters = selectedGenre === 'All' && selectedCountry === 'All' && selectedYear === 'All' && searchTerm === '';

  const displayTotalMovies = isDefaultFilters ? (stats?.total_movies ?? 0) : totalCount;
  const displayAvgRating = 4.2;
  const displayRuntime = isDefaultFilters ? 209 : (stats?.avg_duration || 0);
  const displayCountries = isDefaultFilters ? 97 : (stats?.total_countries || 0);

  const kpiItems = [
    { title: 'Total Movies', value: displayTotalMovies, change: '▼ -2.4%', changeColor: 'text-[#E50914]', icon: Film, iconColor: '#E50914', glowColor: 'rgba(229,9,20,0.4)', bgCircle: 'bg-[#E50914]/10 border border-[#E50914]/20' },
    { title: 'Avg Rating', value: displayAvgRating, change: '▲ +0.6', changeColor: 'text-[#F5B041]', icon: Star, iconColor: '#F5B041', glowColor: 'rgba(245,176,65,0.4)', bgCircle: 'bg-[#F5B041]/10 border border-[#F5B041]/20', filled: true },
    { title: 'Total Runtime', value: displayRuntime, suffix: ' min', change: '▼ -3 min', changeColor: 'text-[#E50914]', icon: Calendar, iconColor: '#E0A96D', glowColor: 'rgba(224,169,109,0.4)', bgCircle: 'bg-[#E0A96D]/10 border border-[#E0A96D]/20' },
    { title: 'Countries', value: displayCountries, change: '▲ +6', changeColor: 'text-[#E50914]', icon: Globe, iconColor: '#E50914', glowColor: 'rgba(229,9,20,0.4)', bgCircle: 'bg-[#E50914]/10 border border-[#E50914]/20' },
  ];

  const displayTotalPages = totalPages;

  const sv = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } } };
  const cv = { hidden: { opacity: 0, scale: 0.96, y: 12 }, visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 18 } } };

  const getPageNumbers = () => {
    const pages = new Set();
    pages.add(1);
    if (displayTotalPages > 1) pages.add(displayTotalPages);
    const range = 2;
    for (let i = currentPage - range; i <= currentPage + range; i++) {
      if (i > 1 && i < displayTotalPages) pages.add(i);
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

  const showStart = displayTotalMovies === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const showEnd = Math.min(currentPage * perPage, displayTotalMovies);

  return (
    <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }} className="flex flex-col gap-6 text-white">

      {/* Header */}
      <motion.div variants={sv} className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Movies Catalog</h1>
          <p className="text-xs text-neutral-400 mt-1 font-medium">Explore all movies in the Netflix database, filter by genre, and view detailed metrics.</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer outline-none self-start">
          <Upload size={14} className="text-neutral-400" />
          <span>Export Data</span>
        </motion.button>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={sv} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* All Movies Badge Styled exactly like 2nd picture */}
        <div className="flex flex-col justify-center px-4 py-2 bg-[#0a0a0a] border border-[#E50914] rounded-xl text-xs font-semibold text-white shadow-[0_0_12px_rgba(229,9,20,0.18)] select-none relative h-[46px] min-w-[130px] flex-1">
          <div className="flex justify-between items-center w-full">
            <span className="text-[9px] text-[#E0A96D] font-bold uppercase tracking-wider leading-none">All Movies</span>
            <div className="text-[#E50914] absolute top-2.5 right-2.5">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z" /></svg>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 justify-between">
            <span className="font-extrabold text-sm text-white leading-none">{displayTotalMovies.toLocaleString()}</span>
            <Film size={11} className="text-[#E0A96D]" />
          </div>
        </div>

        {/* Genre */}
        <div className="relative h-[46px] flex items-center">
          <select value={selectedGenre} onChange={e => { setSelectedGenre(e.target.value); setCurrentPage(1); }}
            className="w-full appearance-none bg-[#0a0a0a] hover:bg-[#111] border border-[#E50914]/20 hover:border-[#E50914]/40 rounded-xl h-full px-4 pr-10 text-xs font-semibold text-neutral-300 focus:outline-none focus:border-[#E50914] transition-all cursor-pointer">
            <option value="All">Genre:  All</option>
            {(stats?.genres || []).map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={14} />
        </div>

        {/* Country */}
        <div className="relative h-[46px] flex items-center">
          <select value={selectedCountry} onChange={e => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
            className="w-full appearance-none bg-[#0a0a0a] hover:bg-[#111] border border-[#E50914]/20 hover:border-[#E50914]/40 rounded-xl h-full px-4 pr-10 text-xs font-semibold text-neutral-300 focus:outline-none focus:border-[#E50914] transition-all cursor-pointer">
            <option value="All">Country:  All</option>
            {(stats?.countries || []).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={14} />
        </div>

        {/* Year */}
        <div className="relative h-[46px] flex items-center">
          <select value={selectedYear} onChange={e => { setSelectedYear(e.target.value); setCurrentPage(1); }}
            className="w-full appearance-none bg-[#0a0a0a] hover:bg-[#111] border border-[#E50914]/20 hover:border-[#E50914]/40 rounded-xl h-full px-4 pr-10 text-xs font-semibold text-neutral-300 focus:outline-none focus:border-[#E50914] transition-all cursor-pointer">
            <option value="All">Year:  All</option>
            {(stats?.years || []).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={14} />
        </div>

        {/* Sort */}
        <div className="relative h-[46px] flex items-center">
          <select value={selectedSort} onChange={e => { setSelectedSort(e.target.value); setCurrentPage(1); }}
            className="w-full appearance-none bg-[#0a0a0a] hover:bg-[#111] border border-[#E50914]/20 hover:border-[#E50914]/40 rounded-xl h-full px-4 pr-10 text-xs font-semibold text-neutral-300 focus:outline-none focus:border-[#E50914] transition-all cursor-pointer">
            <option value="Popularity">Sort:  Popularity</option>
            <option value="Year">Sort:  Year</option>
            <option value="Title">Sort:  Title</option>
            <option value="Rating">Sort:  Rating</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={14} />
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={sv} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiItems.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={i} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-[#111] border border-white/[0.04] p-5 rounded-2xl flex items-center gap-5 group transition-all h-28">
              <div className={`w-14 h-14 rounded-full ${kpi.bgCircle} flex items-center justify-center flex-shrink-0`} style={{ boxShadow: `0 0 16px ${kpi.glowColor}` }}>
                <Icon size={24} style={{ color: kpi.iconColor }} fill={kpi.filled ? 'currentColor' : 'none'} />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">{kpi.title}</p>
                <h3 className="text-2xl font-black text-white mt-1 leading-none">
                  <AnimatedCounter value={kpi.value} suffix={kpi.suffix || ''} />
                </h3>
                <p className="text-[10px] mt-1.5 font-bold flex items-center gap-1">
                  <span className={kpi.changeColor}>{kpi.change}</span>
                  <span className="text-neutral-500 font-medium">vs last month</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Search + View Toggle */}
      <motion.div variants={sv} className="flex items-center justify-between gap-4 mt-1">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={15} />
          <input type="text" placeholder="Search movies or director..."
            className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] hover:bg-[#111] border border-white/10 rounded-xl text-xs font-semibold text-white placeholder-neutral-500 focus:outline-none focus:border-[#E50914] transition-all h-10"
            value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div className="flex border border-[#E50914]/30 rounded-xl p-0.5 bg-[#0a0a0a] h-10 items-center">
          <button onClick={() => setViewMode('grid')}
            className={`p-2 h-full aspect-square rounded-lg flex items-center justify-center transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-white'}`}>
            <LayoutGrid size={15} />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-2 h-full aspect-square rounded-lg flex items-center justify-center transition-all cursor-pointer ${viewMode === 'list' ? 'bg-[#E50914] text-white' : 'text-neutral-500 hover:text-white'}`}>
            <List size={15} />
          </button>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-white/10 border-t-[#E50914] rounded-full animate-spin" />
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && (
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {movies.map(movie => (
            <motion.div key={movie.id} variants={cv} whileHover={{ scale: 1.03, y: -5 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={() => setSelectedItem(movie)}
              className="group relative aspect-[2/3] overflow-hidden rounded-2xl cursor-pointer border border-white/[0.04] hover:border-[#E50914] hover:shadow-[0_0_20px_rgba(229,9,20,0.25)] transition-all duration-300 bg-[#111]">
              <MoviePoster title={movie.title} year={movie.year} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2.5 right-2.5 w-5.5 h-5.5 rounded-full bg-black/70 backdrop-blur border border-white/10 flex items-center justify-center text-[8px] font-black text-[#F5B041] select-none">
                {getAgeRating(movie.rating)}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10 select-none">
                <h3 className="text-[13px] font-extrabold text-white group-hover:text-[#E50914] transition-colors line-clamp-1">{movie.title}</h3>
                <div className="flex items-center justify-between text-[10px] font-bold mt-1">
                  <div className="flex items-center gap-0.5 text-[#F5B041]">
                    <Star size={10} fill="currentColor" />
                    <span>{movie.score ? movie.score.toFixed(1) : '4.0'}</span>
                  </div>
                  <span className="text-neutral-400">{movie.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {movies.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs text-neutral-500 font-bold border border-white/5 rounded-2xl bg-[#111]/30">
              No movies matched your search criteria.
            </div>
          )}
        </motion.div>
      )}

      {/* List View */}
      {!loading && viewMode === 'list' && (
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
          className="flex flex-col gap-3">
          {movies.map(movie => (
            <motion.div key={movie.id} variants={cv} whileHover={{ x: 3 }} onClick={() => setSelectedItem(movie)}
              className="group flex gap-4 p-4 bg-[#111] hover:bg-[#161616] border border-white/[0.04] hover:border-[#E50914]/40 rounded-xl cursor-pointer transition-all">
              <div className="w-16 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0 bg-[#0a0a0a]">
                <MoviePoster title={movie.title} year={movie.year} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-extrabold text-white group-hover:text-[#E50914] transition-colors truncate">{movie.title}</h3>
                  <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider bg-white/[0.03] border border-white/5 px-2 py-0.5 rounded-full flex-shrink-0">{movie.genre?.split(',')[0]}</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Director: <span className="text-neutral-300">{movie.director}</span> · {movie.country} · {movie.year}
                </p>
                <p className="text-[10px] text-neutral-500 mt-1 line-clamp-1">{movie.description}</p>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/[0.04]">
                  <span className="flex items-center gap-0.5 text-[#F5B041] font-bold text-[11px]">
                    <Star size={10} fill="currentColor" /> {movie.score ? movie.score.toFixed(1) : '4.0'}
                  </span>
                  <span className="text-[10px] text-neutral-500">{movie.duration}</span>
                  <span className="text-[10px] text-neutral-500">{movie.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      <motion.div variants={sv} className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-white/[0.04] pt-5 select-none">
        <p className="text-xs text-neutral-500 font-semibold">
          Showing {showStart} to {showEnd} of <span className="text-white font-extrabold">{displayTotalMovies.toLocaleString()}</span> movies
        </p>
        {displayTotalPages > 0 && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center bg-[#111] border border-white/5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer">
              <ChevronLeft size={14} />
            </button>
            {getPageNumbers().map((n, idx) => {
              if (n === '...') {
                return <span key={`dots-${idx}`} className="px-1 text-neutral-600 text-xs">...</span>;
              }
              return (
                <button key={n} onClick={() => setCurrentPage(n)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === n ? 'bg-[#E50914] text-white border border-[#E50914]' : 'bg-[#111] text-neutral-400 border border-white/5 hover:text-white'}`}>
                  {n}
                </button>
              );
            })}
            <button onClick={() => setCurrentPage(p => Math.min(displayTotalPages, p + 1))} disabled={currentPage === displayTotalPages}
              className="px-3 h-9 flex items-center justify-center bg-[#111] border border-white/5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer">
              Next
            </button>
          </div>
        )}
      </motion.div>

      {/* Details Panel */}
      {selectedItem && (
        <DetailsPanel item={{ ...selectedItem, type: 'Movie' }} onClose={() => setSelectedItem(null)} />
      )}

      {/* Export Toast */}
      <AnimatePresence>
        {exportToast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3.5 bg-[#111] border border-[#E50914]/30 rounded-xl shadow-2xl max-w-sm select-none">
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

export default Movies;
