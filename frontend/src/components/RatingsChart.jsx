import React from 'react';
import { Star } from 'lucide-react';

function RatingsChart({ data }) {
  // Data matching the picture exactly
  const ratingsData = [
    { rating: "TV-MA", count: 3207, percentage: 36.4, color: "#E50914", strokeDash: "228 100" },
    { rating: "TV-14", count: 2160, percentage: 24.5, color: "#D8232A", strokeDash: "154 100" },
    { rating: "TV-PG", count: 863, percentage: 9.8, color: "#B81D24", strokeDash: "61 100" },
    { rating: "R", count: 799, percentage: 9.1, color: "#E0A96D", strokeDash: "57 100" },
    { rating: "PG-13", count: 490, percentage: 5.6, color: "#C4935A", strokeDash: "35 100" },
    { rating: "TV-Y7", count: 334, percentage: 3.8, color: "#8E6E45", strokeDash: "24 100" },
    { rating: "Others", count: 954, percentage: 10.8, color: "#2E2929", strokeDash: "68 100" }
  ];

  return (
    <div className="chart-box ratings-distribution-box">
      <h2>Ratings Distribution</h2>

      <div className="ratings-layout">
        {/* Concentric rings on the left */}
        <div className="ratings-rings-container">
          <svg viewBox="0 0 200 200" className="concentric-rings-svg">
            {/* Background tracks */}
            <circle cx="100" cy="100" r="85" fill="none" stroke="#1f1f1f" strokeWidth="6" />
            <circle cx="100" cy="100" r="72" fill="none" stroke="#1f1f1f" strokeWidth="6" />
            <circle cx="100" cy="100" r="59" fill="none" stroke="#1f1f1f" strokeWidth="6" />
            <circle cx="100" cy="100" r="46" fill="none" stroke="#1f1f1f" strokeWidth="6" />
            <circle cx="100" cy="100" r="33" fill="none" stroke="#1f1f1f" strokeWidth="6" />

            {/* Glowing progress rings */}
            {/* TV-MA */}
            <circle 
              cx="100" cy="100" r="85" 
              fill="none" 
              stroke="#E50914" 
              strokeWidth="6" 
              strokeDasharray="360"
              strokeDashoffset={360 - (360 * 36.4) / 100}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            {/* TV-14 */}
            <circle 
              cx="100" cy="100" r="72" 
              fill="none" 
              stroke="#D8232A" 
              strokeWidth="6" 
              strokeDasharray="300"
              strokeDashoffset={300 - (300 * 24.5) / 100}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            {/* TV-PG */}
            <circle 
              cx="100" cy="100" r="59" 
              fill="none" 
              stroke="#B81D24" 
              strokeWidth="6" 
              strokeDasharray="250"
              strokeDashoffset={250 - (250 * 9.8) / 100}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            {/* R */}
            <circle 
              cx="100" cy="100" r="46" 
              fill="none" 
              stroke="#E0A96D" 
              strokeWidth="6" 
              strokeDasharray="200"
              strokeDashoffset={200 - (200 * 9.1) / 100}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            {/* PG-13 */}
            <circle 
              cx="100" cy="100" r="33" 
              fill="none" 
              stroke="#C4935A" 
              strokeWidth="6" 
              strokeDasharray="150"
              strokeDashoffset={150 - (150 * 5.6) / 100}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />

            {/* Star Icon in Center */}
            <g transform="translate(88, 88)">
              <Star size={24} fill="#E0A96D" stroke="#E0A96D" className="glowing-star" />
            </g>
          </svg>
        </div>

        {/* Legend listing on the right */}
        <div className="ratings-legend-container">
          <table className="ratings-table">
            <tbody>
              {ratingsData.map((item) => (
                <tr key={item.rating}>
                  <td className="rating-code" style={{ color: item.color }}>{item.rating}</td>
                  <td className="rating-details">
                    <span className="rating-count">{item.count.toLocaleString()}</span>
                    <span className="rating-pct">({item.percentage}%)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RatingsChart;
