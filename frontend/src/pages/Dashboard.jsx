import React, { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RightSidebar from "../components/RightSidebar";
import KPIcards from "../components/KPIcards";
import GenreChart from "../components/GenreChart";
import RatingsChart from "../components/RatingsChart";
import ReleaseTrendChart from "../components/ReleaseTrendChart";
import CountryChart from "../components/CountryChart";
import { Calendar } from 'lucide-react';

function Dashboard() {
  const [kpi, setKpi] = useState({});
  const [genres, setGenres] = useState({ labels: [], values: [] });
  const [ratings, setRatings] = useState({ labels: [], values: [] });
  const [releaseTrend, setReleaseTrend] = useState({ labels: [], values: [] });
  const [countries, setCountries] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/kpi"),
      API.get("/genres"),
      API.get("/ratings"),
      API.get("/release-trend"),
      API.get("/countries")
    ])
      .then(([kpiRes, genresRes, ratingsRes, trendRes, countriesRes]) => {
        setKpi(kpiRes.data);
        setGenres(genresRes.data);
        setRatings(ratingsRes.data);
        setReleaseTrend(trendRes.data);
        setCountries(countriesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data from API:", err);
        // Fall back to showing dummy state gracefully if API is loading/cleaning
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="main-workspace">
        {/* Top Header */}
        <Header />

        {/* Dashboard Content Scroller */}
        <main className="dashboard-main-content">
          <div className="dashboard-content-layout">
            
            {/* Middle analytics grid */}
            <div className="analytics-view">
              
              {/* Welcome Row */}
              <div className="welcome-row">
                <div className="welcome-text-box">
                  <h1>Welcome back, Analyst 👋</h1>
                  <p>Here's what's happening with Netflix Content</p>
                </div>
                <button className="date-picker-btn">
                  <Calendar size={16} />
                  <span>All Time</span>
                </button>
              </div>

              {/* KPI Cards section */}
              <KPIcards kpi={kpi} />

              {/* Main charts grid */}
              <div className="charts-grid-row">
                <ReleaseTrendChart data={releaseTrend} />
                <GenreChart data={genres} />
              </div>

              <div className="charts-grid-row">
                <CountryChart data={countries} />
                <RatingsChart data={ratings} />
              </div>

              {/* Footer */}
              <footer className="dashboard-footer">
                <p>© 2024 Netflix Analytics Dashboard. All Rights Reserved.</p>
              </footer>
            </div>

            {/* Right sidebar details */}
            <RightSidebar />

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
