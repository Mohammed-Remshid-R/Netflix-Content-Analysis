import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function GenreChart({ data, title = 'Top 10 Genres', hideTitle = false }) {
  // Fallback to match exact categories in the mockup picture
  const defaultLabels = [
    "International Movies", "Dramas", "Comedies", "Action & Adventure", 
    "Documentaries", "Kids", "Crime TV Shows", "Stand-Up Comedy", "Romantic Movies", "Others"
  ];
  const defaultPercentages = [
    12.5, 11.2, 9.8, 8.7, 6.4, 5.6, 4.9, 4.3, 3.7, 32.9
  ];
  const defaultValues = [
    1100, 986, 863, 766, 563, 493, 431, 378, 325, 2898
  ];

  const hasData = data && data.labels && data.labels.length > 0;
  const labels = hasData ? data.labels : defaultLabels;
  const values = hasData ? data.values : defaultValues;

  // Let's compute percentages if we use real data, or fallback
  const total = values.reduce((a, b) => a + b, 0);
  
  const chartData = labels.map((label, index) => {
    const percentage = hasData ? parseFloat(((values[index] / total) * 100).toFixed(1)) : defaultPercentages[index];
    return {
      name: label,
      value: values[index],
      percentage: percentage
    };
  }).slice(0, 10); // top 10

  // Colors matching Netflix warm/dark/red palette in the donut segments
  const COLORS = [
    '#E50914', // International Movies
    '#D8232A', // Dramas
    '#B81D24', // Comedies
    '#A0151B', // Action & Adventure
    '#801014', // Documentaries
    '#6B1B1E', // Kids
    '#581619', // Crime TV Shows
    '#E0A96D', // Stand-Up Comedy
    '#C4935A', // Romantic Movies
    '#2E2929', // Others
  ];

  return (
    <div className="chart-box top-genres-box">
      {!hideTitle && <h2>{title}</h2>}

      <div className="donut-chart-layout">
        <div className="donut-chart-container">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#141414", border: "1px solid #333", color: "#fff" }}
                formatter={(value, name, props) => [`${value} titles (${props.payload.percentage}%)`, name]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Popcorn SVG in the center of the donut chart */}
          <div className="donut-center-icon">
            <svg viewBox="0 0 24 24" width="42" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Popcorn Box */}
              <path d="M6 9L7.5 21H16.5L18 9H6Z" fill="#E50914" stroke="#E50914" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M9.5 9L10 21" stroke="#F5F5F1" strokeWidth="1.5" />
              <path d="M14.5 9L14 21" stroke="#F5F5F1" strokeWidth="1.5" />
              <path d="M12 9V21" stroke="#F5F5F1" strokeWidth="1.5" />
              
              {/* Popcorn fluffy pieces */}
              <circle cx="8" cy="6" r="2.5" fill="#E0A96D" />
              <circle cx="11.5" cy="5" r="2.5" fill="#F5F5F1" />
              <circle cx="15.5" cy="6" r="2.5" fill="#E0A96D" />
              <circle cx="10" cy="7.5" r="2" fill="#E0A96D" />
              <circle cx="13.5" cy="7.5" r="2.2" fill="#F5F5F1" />
              <circle cx="12" cy="3.5" r="1.8" fill="#F5F5F1" />
            </svg>
          </div>
        </div>

        {/* Legend listing */}
        <div className="donut-legend-container">
          <ul className="donut-legend-list">
            {chartData.map((item, index) => (
              <li key={item.name} className="legend-item">
                <span className="legend-bullet" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="legend-label">{item.name}</span>
                <span className="legend-percentage">{item.percentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GenreChart;
