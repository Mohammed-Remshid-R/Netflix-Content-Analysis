import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, Search, Film, Star, Award, Globe, ChevronDown,
  Download, MoreVertical, ChevronLeft, ChevronRight, ArrowUpDown
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';
import API from '../services/api';

// Director photo component using Wikipedia/public images
const directorPhotoCache = {};

function DirectorPhoto({ name, size = 32 }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (!name) return;
    if (directorPhotoCache[name] !== undefined) {
      setPhotoUrl(directorPhotoCache[name]);
      setLoaded(true);
      return;
    }

    // Use a deterministic color from name hash for fallback
    const wikiName = encodeURIComponent(name.replace(/ /g, '_'));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiName}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.thumbnail && data.thumbnail.source) {
          directorPhotoCache[name] = data.thumbnail.source;
          setPhotoUrl(data.thumbnail.source);
        } else {
          directorPhotoCache[name] = null;
          setPhotoUrl(null);
        }
      })
      .catch(() => {
        directorPhotoCache[name] = null;
        setPhotoUrl(null);
      })
      .finally(() => setLoaded(true));
  }, [name]);

  // Generate initials and color for fallback
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '??';

  const hashCode = name
    ? name.split('').reduce((acc, c) => c.charCodeAt(0) + ((acc << 5) - acc), 0)
    : 0;

  const hue = Math.abs(hashCode % 360);

  if (!loaded) {
    return (
      <div
        className="director-photo-placeholder"
        style={{ width: size, height: size, minWidth: size }}
      >
        <div className="director-photo-spinner" />
      </div>
    );
  }

  if (photoUrl && !errored) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className="director-photo"
        style={{ width: size, height: size, minWidth: size }}
        loading="lazy"
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div
      className="director-photo-initials"
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: `linear-gradient(135deg, hsl(${hue}, 45%, 35%), hsl(${hue + 30}, 45%, 25%))`,
      }}
    >
      {initials}
    </div>
  );
}

// Custom Donut Chart center label
function DonutCenterLabel({ viewBox }) {
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} dy="-6" fontSize="14" fontWeight="800" fill="#fff">
        Productivity
      </tspan>
      <tspan x={cx} dy="18" fontSize="10" fill="#888">
        Distribution
      </tspan>
    </text>
  );
}

const DONUT_COLORS = ['#E50914', '#FF6B35', '#E0A96D', '#C4935A', '#8E6E45'];

function Directors() {
  const [directorsData, setDirectorsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('Productivity');
  const [countryFilter, setCountryFilter] = useState('All');
  const [genreFilter, setGenreFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch directors data from backend
  const fetchDirectors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        per_page: perPage,
        search: debouncedSearch,
        sort: sortBy,
        country: countryFilter,
        genre: genreFilter,
      });
      const res = await API.get(`/directors?${params.toString()}`);
      setDirectorsData(res.data);
    } catch (err) {
      console.error('Failed to fetch directors:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, sortBy, countryFilter, genreFilter]);

  useEffect(() => {
    fetchDirectors();
  }, [fetchDirectors]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sortBy, countryFilter, genreFilter]);

  const data = directorsData?.data || [];
  const totalDirectors = directorsData?.total_directors || 0;
  const totalTitles = directorsData?.total_titles || 0;
  const avgProd = directorsData?.avg_productivity || 0;
  const totalCountries = directorsData?.total_countries || 0;
  const totalPages = directorsData?.total_pages || 0;
  const totalResults = directorsData?.total || 0;
  const genreDistribution = directorsData?.genre_distribution || [];
  const countryDistribution = directorsData?.country_distribution || [];
  const productivityDist = directorsData?.productivity_distribution || [];
  const allGenres = directorsData?.all_genres || [];
  const allCountries = directorsData?.all_countries || [];

  // KPI Cards data
  const kpiCards = [
    {
      label: 'Total Directors',
      value: totalDirectors.toLocaleString(),
      change: '+120',
      icon: Users,
      color: '#E50914',
    },
    {
      label: 'Total Titles',
      value: totalTitles.toLocaleString(),
      change: '+286',
      icon: Film,
      color: '#E0A96D',
    },
    {
      label: 'Avg Productivity',
      value: avgProd.toFixed(2),
      change: '+0.18',
      icon: Star,
      color: '#E0A96D',
    },
    {
      label: 'Countries',
      value: totalCountries.toLocaleString(),
      change: '+8',
      icon: Globe,
      color: '#E50914',
    },
  ];

  // Pagination helpers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  // Country distribution - add "Others" bucket
  const countryDistWithOthers = useMemo(() => {
    if (!countryDistribution.length) return [];
    const shown = countryDistribution.slice(0, 5);
    const othersCount = totalDirectors - shown.reduce((sum, c) => sum + c.count, 0);
    if (othersCount > 0) {
      return [...shown, { country: 'Others', count: othersCount }];
    }
    return shown;
  }, [countryDistribution, totalDirectors]);

  return (
    <div className="directors-page">
      <div className="directors-main-layout">
        {/* LEFT: Main Content */}
        <div className="directors-content">
          {/* Title Header */}
          <div className="directors-header">
            <div>
              <h1 className="directors-title">
                <Users className="directors-title-icon" size={22} />
                Directors Index
              </h1>
              <p className="directors-subtitle">
                Audit the most productive directors, their primary genres, and top production indexes.
              </p>
            </div>
            <button className="directors-export-btn">
              <Download size={14} />
              Export Data
            </button>
          </div>

          {/* KPI Cards */}
          <div className="directors-kpi-row">
            {kpiCards.map((kpi, i) => (
              <div
                key={i}
                className="directors-kpi-card"
                style={{ borderColor: `${kpi.color}22` }}
              >
                <div className="directors-kpi-icon-wrapper" style={{ backgroundColor: `${kpi.color}15` }}>
                  <kpi.icon size={18} style={{ color: kpi.color }} />
                </div>
                <div className="directors-kpi-info">
                  <span className="directors-kpi-label">{kpi.label}</span>
                  <span className="directors-kpi-value">{kpi.value}</span>
                  <span className="directors-kpi-change" style={{ color: '#4ade80' }}>
                    {kpi.change} <span className="directors-kpi-vs">vs last month</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Search + Filters Row */}
          <div className="directors-controls-row">
            <div className="directors-search-bar">
              <Search size={14} className="directors-search-icon" />
              <input
                type="text"
                placeholder="Search directors, origin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="directors-search-input"
              />
            </div>

            <div className="directors-filters-group">
              <div className="directors-filter-item">
                <span className="directors-filter-label">Sort By:</span>
                <div className="directors-select-wrapper">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="directors-select"
                  >
                    <option value="Productivity">Productivity</option>
                    <option value="Name">Name</option>
                    <option value="Rating">Rating</option>
                    <option value="Country">Country</option>
                  </select>
                  <ChevronDown size={12} className="directors-select-chevron" />
                </div>
              </div>

              <div className="directors-filter-item">
                <span className="directors-filter-label">Country:</span>
                <div className="directors-select-wrapper">
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="directors-select"
                  >
                    <option value="All">All</option>
                    {allCountries.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="directors-select-chevron" />
                </div>
              </div>

              <div className="directors-filter-item">
                <span className="directors-filter-label">Genre:</span>
                <div className="directors-select-wrapper">
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="directors-select"
                  >
                    <option value="All">All</option>
                    {allGenres.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="directors-select-chevron" />
                </div>
              </div>
            </div>
          </div>

          {/* Directors Table */}
          <div className="directors-table-container">
            {loading ? (
              <div className="directors-loading">
                <div className="directors-loading-spinner" />
                <span>Loading directors data...</span>
              </div>
            ) : (
              <>
                <div className="directors-table-scroll">
                  <table className="directors-table">
                    <thead>
                      <tr>
                        <th className="directors-th-rank" />
                        <th className="directors-th-name">Director</th>
                        <th className="directors-th-titles">
                          Titles <ArrowUpDown size={10} className="directors-sort-icon" />
                        </th>
                        <th className="directors-th-country">Country</th>
                        <th className="directors-th-genre">Primary Genre</th>
                        <th className="directors-th-top">Top Production</th>
                        <th className="directors-th-rating">
                          Avg Rating <ArrowUpDown size={10} className="directors-sort-icon" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((director, idx) => {
                        const rank = (currentPage - 1) * perPage + idx + 1;
                        return (
                          <tr key={`${director.name}-${idx}`} className="directors-row">
                            <td className="directors-td-rank">
                              <span className="directors-rank-num">{rank}</span>
                            </td>
                            <td className="directors-td-name">
                              <div className="directors-name-cell">
                                <DirectorPhoto name={director.name} size={32} />
                                <span className="directors-name-text">{director.name}</span>
                              </div>
                            </td>
                            <td className="directors-td-titles">
                              <span className="directors-titles-badge">{director.titles}</span>
                            </td>
                            <td className="directors-td-country">{director.country}</td>
                            <td className="directors-td-genre">{director.genre}</td>
                            <td className="directors-td-top">{director.topTitle}</td>
                            <td className="directors-td-rating">
                              <div className="directors-rating-cell">
                                <Star size={12} fill="#E0A96D" stroke="none" />
                                <span>{director.score}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {data.length === 0 && (
                        <tr>
                          <td colSpan="7" className="directors-no-data">
                            No directors match your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="directors-pagination">
                  <span className="directors-pagination-info">
                    Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalResults)} of {totalResults.toLocaleString()} directors
                  </span>
                  <div className="directors-pagination-controls">
                    {getPageNumbers().map((page, i) => (
                      <button
                        key={i}
                        className={`directors-page-btn ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
                        onClick={() => page !== '...' && setCurrentPage(page)}
                        disabled={page === '...'}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="directors-page-btn directors-page-next"
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Sidebar Charts */}
        <div className="directors-sidebar">
          {/* Director Productivity Donut */}
          <div className="directors-sidebar-card">
            <div className="directors-sidebar-card-header">
              <h3>
                <Star size={14} fill="#E0A96D" stroke="none" className="directors-sidebar-icon" />
                Director Productivity
              </h3>
              <MoreVertical size={14} className="directors-more-icon" />
            </div>
            <div className="directors-donut-layout">
              <div className="directors-donut-chart">
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie
                      data={productivityDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      dataKey="value"
                      paddingAngle={2}
                      stroke="none"
                    >
                      {productivityDist.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="directors-donut-legend">
                {productivityDist.map((item, i) => (
                  <div key={i} className="directors-legend-row">
                    <span
                      className="directors-legend-dot"
                      style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                    />
                    <span className="directors-legend-label">{item.label}</span>
                    <span className="directors-legend-pct">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Genres by Directors */}
          <div className="directors-sidebar-card">
            <div className="directors-sidebar-card-header">
              <h3>
                <Film size={14} className="directors-sidebar-icon" style={{ color: '#E50914' }} />
                Top Genres by Directors
              </h3>
              <MoreVertical size={14} className="directors-more-icon" />
            </div>
            <div className="directors-genre-bars">
              {genreDistribution.map((item, i) => {
                const maxCount = genreDistribution[0]?.count || 1;
                const widthPct = (item.count / maxCount) * 100;
                return (
                  <div key={i} className="directors-genre-bar-row">
                    <span className="directors-genre-bar-label">{item.genre}</span>
                    <div className="directors-genre-bar-track">
                      <div
                        className="directors-genre-bar-fill"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                    <span className="directors-genre-bar-count">{item.count.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Director Origin Distribution */}
          <div className="directors-sidebar-card">
            <div className="directors-sidebar-card-header">
              <h3>
                <Globe size={14} className="directors-sidebar-icon" style={{ color: '#E50914' }} />
                Director Origin Distribution
              </h3>
              <MoreVertical size={14} className="directors-more-icon" />
            </div>
            {/* Simple world map dots visual */}
            <div className="directors-world-map">
              <svg viewBox="0 0 200 100" className="directors-world-svg">
                {/* Simplified continent outlines using dots */}
                {generateWorldDots().map((dot, i) => (
                  <circle
                    key={i}
                    cx={dot.x}
                    cy={dot.y}
                    r={dot.highlighted ? 2 : 1}
                    fill={dot.highlighted ? '#E50914' : '#333'}
                    opacity={dot.highlighted ? 0.9 : 0.4}
                  />
                ))}
              </svg>
            </div>
            <div className="directors-country-stats">
              {countryDistWithOthers.map((item, i) => (
                <div key={i} className="directors-country-stat-row">
                  <span className="directors-country-name">{item.country}</span>
                  <span className="directors-country-count">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate dots for a simple world map visualization
function generateWorldDots() {
  const dots = [];

  // North America
  const naCoords = [
    [40, 25], [42, 27], [44, 29], [38, 23], [36, 25], [40, 30],
    [42, 32], [35, 28], [37, 30], [39, 32], [41, 34], [43, 31],
    [45, 28], [47, 26], [46, 30], [44, 33], [38, 35], [40, 37],
    [42, 35], [36, 32], [50, 22], [48, 24], [52, 20], [34, 38],
  ];

  // South America
  const saCoords = [
    [55, 50], [57, 52], [56, 55], [58, 58], [54, 60], [56, 63],
    [55, 66], [53, 70], [51, 73], [57, 48], [59, 55], [52, 65],
    [54, 68], [50, 75], [53, 58], [55, 62],
  ];

  // Europe
  const euCoords = [
    [95, 18], [97, 20], [99, 22], [93, 20], [95, 24], [97, 26],
    [100, 18], [102, 20], [101, 24], [98, 28], [96, 30], [100, 26],
    [103, 22], [91, 22], [93, 26], [105, 20],
  ];

  // Africa
  const afCoords = [
    [100, 40], [102, 42], [104, 38], [98, 44], [100, 46], [102, 48],
    [104, 45], [98, 50], [100, 52], [102, 55], [104, 50], [96, 48],
    [98, 55], [100, 58], [103, 42], [106, 40],
  ];

  // Asia
  const asCoords = [
    [120, 20], [122, 22], [124, 18], [126, 24], [128, 20], [130, 22],
    [132, 26], [134, 28], [130, 30], [125, 28], [122, 32], [120, 28],
    [118, 26], [140, 24], [142, 26], [144, 28], [138, 22], [136, 24],
    [150, 30], [148, 28], [145, 32], [152, 26], [155, 28], [115, 30],
    [128, 34], [132, 36], [135, 32], [140, 30],
  ];

  // Australia
  const auCoords = [
    [150, 60], [152, 62], [154, 58], [148, 64], [150, 66], [152, 68],
    [156, 60], [158, 62], [154, 64], [160, 58],
  ];

  const highlighted = new Set([0, 3, 8]); // Some NA dots
  const highlightedEU = new Set([0, 2, 5]);
  const highlightedAS = new Set([6, 10, 14]);

  naCoords.forEach(([x, y], i) => dots.push({ x, y, highlighted: highlighted.has(i) }));
  saCoords.forEach(([x, y]) => dots.push({ x, y, highlighted: false }));
  euCoords.forEach(([x, y], i) => dots.push({ x, y, highlighted: highlightedEU.has(i) }));
  afCoords.forEach(([x, y]) => dots.push({ x, y, highlighted: false }));
  asCoords.forEach(([x, y], i) => dots.push({ x, y, highlighted: highlightedAS.has(i) }));
  auCoords.forEach(([x, y]) => dots.push({ x, y, highlighted: false }));

  return dots;
}

export default Directors;
