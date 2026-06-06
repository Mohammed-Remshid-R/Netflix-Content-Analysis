import React, { useState } from 'react';
import { Star, BookOpen, Database, Globe, Compass, Film, Tv } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { tvShowsData, activityFeedData } from '../data/netflixData';
import DetailsPanel from './DetailsPanel';

function RightSidebar() {
  const [selectedItem, setSelectedItem] = useState(null);

  // Retrieve stranger things details for details drawer click
  const strangerThings = tvShowsData.find(t => t.title === 'Stranger Things') || tvShowsData[0];

  const getIcon = (type) => {
    switch (type) {
      case 'book': return <BookOpen size={14} />;
      case 'globe': return <Globe size={14} />;
      case 'database': return <Database size={14} />;
      case 'film': return <Film size={14} />;
      case 'trending': return <Star size={14} fill="currentColor" />;
      default: return <Database size={14} />;
    }
  };

  return (
    <>
      <aside className="right-sidebar select-none">
        
        {/* Popular Title Card */}
        <div className="right-section">
          <h3 className="section-title-iconic">
            <Star className="gold-star-icon" size={16} fill="gold" />
            <span>Popular Title</span>
          </h3>
          <div 
            onClick={() => setSelectedItem(strangerThings)}
            className="popular-title-card cursor-pointer group"
            title="Click to view details"
          >
            <img 
              src="https://media.githubusercontent.com/media/Mohammed-Remshid-R/Netflix-Content-Analysis/main/frontend/public/stranger_things.png"
              alt="Stranger Things Poster" 
              className="popular-title-poster group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="popular-title-details relative">
              <div className="absolute inset-0 bg-[#E50914]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="stat-row relative z-10">
                <span className="stat-rating">
                  <Star size={12} fill="gold" stroke="none" /> 4.8
                </span>
                <span className="stat-year">2016</span>
                <span className="stat-type group-hover:bg-[#E50914] group-hover:text-white transition-colors">TV Show</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insight Section */}
        <div className="right-section">
          <h3>Quick Insight</h3>
          <div className="insight-card bg-gradient-to-br from-[#111] to-[#161616]/40 border border-white/5 shadow-inner">
            <p>
              Most content was added in <span className="highlight-yellow">2018</span> with <span className="highlight-yellow">1,647</span> titles.
            </p>
            <p className="margin-top-sm">
              <span className="highlight-yellow">Dramas</span> and <span className="highlight-yellow">International Movies</span> dominate the Netflix library.
            </p>
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="right-section">
          <h3 className="section-title-iconic">
            <Database size={16} className="activity-icon-heading text-[#E0A96D]" />
            <span>Activity Feed</span>
          </h3>
          <div className="activity-feed space-y-4">
            {activityFeedData.map((item) => (
              <div key={item.id} className="activity-item flex items-start gap-3">
                <div className="activity-icon-container yellow-icon w-7 h-7 rounded-lg bg-[#E0A96D]/10 text-[#E0A96D] flex items-center justify-center flex-shrink-0">
                  {getIcon(item.icon)}
                </div>
                <div className="activity-details min-h-[28px] flex flex-col justify-center">
                  <p className="activity-text text-[11px] leading-relaxed text-neutral-400" dangerouslySetInnerHTML={{ __html: item.text }} />
                  <span className="text-[9px] text-neutral-500 font-semibold block mt-0.5">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Title Details Panel */}
      {selectedItem && (
        <DetailsPanel 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </>
  );
}

export default RightSidebar;
