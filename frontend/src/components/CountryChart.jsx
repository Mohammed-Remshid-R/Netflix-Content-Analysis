import React from 'react';

function CountryChart({ data }) {
  // Mock country production data matching picture exactly
  const countryData = [
    { country: "United States", count: 2818, percentage: 60, colorClass: "progress-red" },
    { country: "India", count: 972, percentage: 38, colorClass: "progress-gold" },
    { country: "United Kingdom", count: 419, percentage: 22, colorClass: "progress-red" },
    { country: "Japan", count: 245, percentage: 17, colorClass: "progress-red" },
    { country: "South Korea", count: 199, percentage: 15, colorClass: "progress-red" },
    { country: "Canada", count: 181, percentage: 14, colorClass: "progress-red" },
    { country: "Spain", count: 145, percentage: 12, colorClass: "progress-red" },
    { country: "France", count: 124, percentage: 11, colorClass: "progress-red" },
    { country: "Mexico", count: 110, percentage: 10, colorClass: "progress-red" },
    { country: "Others", count: 1594, percentage: 48, colorClass: "progress-gold" }
  ];

  return (
    <div className="chart-box countries-added-box">
      <h2>Top 10 Countries by Content</h2>

      <div className="countries-layout">
        {/* Progress bars list */}
        <div className="countries-list">
          {countryData.map((item, index) => (
            <div key={item.country} className="country-row">
              <span className="country-name">{item.country}</span>
              <div className="progress-track">
                <div 
                  className={`progress-fill ${item.colorClass}`} 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="country-count">{item.count.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Dotted World Map overlay */}
        <div className="world-map-container">
          <svg viewBox="0 0 1000 480" className="dotted-world-map" fill="rgba(255, 255, 255, 0.08)">
            {/* Simple dotted background representation of continents */}
            {/* North America */}
            <circle cx="150" cy="120" r="2" />
            <circle cx="170" cy="110" r="2" />
            <circle cx="190" cy="130" r="2" />
            <circle cx="210" cy="140" r="2" />
            <circle cx="160" cy="150" r="2" />
            <circle cx="180" cy="170" r="2" />
            <circle cx="200" cy="190" r="2" />
            <circle cx="220" cy="210" r="2" />
            <circle cx="230" cy="180" r="2" />
            <circle cx="250" cy="160" r="2" />
            <circle cx="270" cy="140" r="2" />
            <circle cx="280" cy="190" r="2" />

            {/* South America */}
            <circle cx="280" cy="300" r="2" />
            <circle cx="300" cy="320" r="2" />
            <circle cx="320" cy="350" r="2" />
            <circle cx="340" cy="380" r="2" />
            <circle cx="360" cy="410" r="2" />
            <circle cx="330" cy="320" r="2" />
            <circle cx="350" cy="340" r="2" />

            {/* Europe */}
            <circle cx="480" cy="120" r="2" />
            <circle cx="500" cy="110" r="2" />
            <circle cx="520" cy="130" r="2" />
            <circle cx="540" cy="140" r="2" />
            <circle cx="510" cy="150" r="2" />
            <circle cx="530" cy="160" r="2" />

            {/* Africa */}
            <circle cx="500" cy="240" r="2" />
            <circle cx="520" cy="260" r="2" />
            <circle cx="540" cy="280" r="2" />
            <circle cx="560" cy="310" r="2" />
            <circle cx="580" cy="340" r="2" />
            <circle cx="530" cy="230" r="2" />
            <circle cx="550" cy="250" r="2" />

            {/* Asia */}
            <circle cx="680" cy="120" r="2" />
            <circle cx="700" cy="140" r="2" />
            <circle cx="720" cy="160" r="2" />
            <circle cx="740" cy="180" r="2" />
            <circle cx="760" cy="200" r="2" />
            <circle cx="710" cy="210" r="2" />
            <circle cx="730" cy="220" r="2" />
            <circle cx="750" cy="230" r="2" />
            <circle cx="780" cy="160" r="2" />
            <circle cx="800" cy="140" r="2" />
            <circle cx="820" cy="180" r="2" />
            <circle cx="840" cy="190" r="2" />

            {/* Australia */}
            <circle cx="840" cy="360" r="2" />
            <circle cx="860" cy="380" r="2" />
            <circle cx="880" cy="390" r="2" />
            <circle cx="850" cy="390" r="2" />

            {/* Glowing Red Spots for content hubs */}
            {/* North America / US */}
            <g className="glow-dot">
              <circle cx="210" cy="160" r="10" className="ping-effect" />
              <circle cx="210" cy="160" r="4" fill="#E50914" />
            </g>

            {/* Europe / UK & France */}
            <g className="glow-dot">
              <circle cx="500" cy="130" r="8" className="ping-effect" />
              <circle cx="500" cy="130" r="3" fill="#E50914" />
            </g>

            {/* India */}
            <g className="glow-dot">
              <circle cx="710" cy="210" r="9" className="ping-effect-gold" />
              <circle cx="710" cy="210" r="4" fill="#E0A96D" />
            </g>

            {/* East Asia / Japan / South Korea */}
            <g className="glow-dot">
              <circle cx="820" cy="160" r="8" className="ping-effect" />
              <circle cx="820" cy="160" r="3.5" fill="#E50914" />
            </g>

            {/* South America */}
            <g className="glow-dot">
              <circle cx="320" cy="330" r="6" className="ping-effect" />
              <circle cx="320" cy="330" r="2.5" fill="#E50914" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default CountryChart;
