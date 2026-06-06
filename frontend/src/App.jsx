import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Genres from './pages/Genres';
import Countries from './pages/Countries';
import Ratings from './pages/Ratings';
import ReleaseTrend from './pages/ReleaseTrend';
import Directors from './pages/Directors';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Premium Netflix Glow Loading Screen
function NetflixLoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] select-none">
      {/* Animated Glowing Logo Grid */}
      <div className="relative flex flex-col items-center">
        <h1 className="text-5xl md:text-6xl font-black text-[#E50914] tracking-widest animate-pulse relative">
          NETFLIX
          <span className="absolute -inset-1 blur-lg bg-[#E50914]/30 -z-10 rounded-lg" />
        </h1>
        <p className="text-[10px] md:text-xs text-neutral-400 font-bold uppercase tracking-[0.25em] mt-3 animate-pulse delay-75">
          Content Analysis Platform
        </p>
      </div>

      {/* Modern Circular Red Spinner */}
      <div className="mt-12 relative flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/5 border-t-[#E50914] rounded-full animate-spin" />
        <div className="absolute w-12 h-12 border border-[#E50914]/15 rounded-full animate-ping opacity-60" />
      </div>
    </div>
  );
}

// Router Switch with Loading State Wrap
function AppRoutes() {
  const { loading } = useDashboard();

  if (loading) {
    return <NetflixLoadingScreen />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="movies" element={<Movies />} />
          <Route path="tv-shows" element={<TVShows />} />
          <Route path="genres" element={<Genres />} />
          <Route path="countries" element={<Countries />} />
          <Route path="ratings" element={<Ratings />} />
          <Route path="release-trend" element={<ReleaseTrend />} />
          <Route path="directors" element={<Directors />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

function App() {
  return (
    <DashboardProvider>
      <AppRoutes />
    </DashboardProvider>
  );
}

export default App;
