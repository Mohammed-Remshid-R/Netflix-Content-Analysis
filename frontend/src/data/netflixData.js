// Comprehensive Netflix Mock Dataset
export const kpiData = {
  total_titles: 8807,
  total_movies: 6133,
  total_tvshows: 2674,
  total_countries: 749,
  total_directors: 4528,
  total_genres: 42,
  avg_rating: 4.2,
};

export const sparklineData = {
  titles: [
    { value: 4000 }, { value: 4800 }, { value: 4200 },
    { value: 5500 }, { value: 6800 }, { value: 7200 },
    { value: 8807 }
  ],
  movies: [
    { value: 3000 }, { value: 3500 }, { value: 3200 },
    { value: 4200 }, { value: 5100 }, { value: 5500 },
    { value: 6133 }
  ],
  tvShows: [
    { value: 1000 }, { value: 1300 }, { value: 1000 },
    { value: 1300 }, { value: 1700 }, { value: 1700 },
    { value: 2674 }
  ],
  countries: [
    { value: 500 }, { value: 550 }, { value: 520 },
    { value: 600 }, { value: 680 }, { value: 710 },
    { value: 749 }
  ]
};

export const releaseTrendData = {
  yearly: [
    { year: 2008, value: 50 }, { year: 2009, value: 110 }, { year: 2010, value: 180 },
    { year: 2011, value: 270 }, { year: 2012, value: 390 }, { year: 2013, value: 520 },
    { year: 2014, value: 710 }, { year: 2015, value: 950 }, { year: 2016, value: 1250 },
    { year: 2017, value: 1450 }, { year: 2018, value: 1647 }, { year: 2019, value: 1500 },
    { year: 2020, value: 1320 }, { year: 2021, value: 1180 }, { year: 2022, value: 980 },
    { year: 2023, value: 680 }, { year: 2024, value: 450 }
  ],
  monthly: [
    { year: 'Jan', value: 120 }, { year: 'Feb', value: 85 }, { year: 'Mar', value: 150 },
    { year: 'Apr', value: 200 }, { year: 'May', value: 175 }, { year: 'Jun', value: 220 },
    { year: 'Jul', value: 310 }, { year: 'Aug', value: 280 }, { year: 'Sep', value: 245 },
    { year: 'Oct', value: 290 }, { year: 'Nov', value: 350 }, { year: 'Dec', value: 380 }
  ],
  weekly: [
    { year: 'W1', value: 42 }, { year: 'W2', value: 38 }, { year: 'W3', value: 55 },
    { year: 'W4', value: 48 }, { year: 'W5', value: 62 }, { year: 'W6', value: 70 },
    { year: 'W7', value: 58 }, { year: 'W8', value: 75 }, { year: 'W9', value: 82 },
    { year: 'W10', value: 90 }, { year: 'W11', value: 85 }, { year: 'W12', value: 95 }
  ]
};

export const genreData = [
  { name: "International Movies", value: 1100, percentage: 12.5, color: '#E50914' },
  { name: "Dramas", value: 986, percentage: 11.2, color: '#D8232A' },
  { name: "Comedies", value: 863, percentage: 9.8, color: '#B81D24' },
  { name: "Action & Adventure", value: 766, percentage: 8.7, color: '#A0151B' },
  { name: "Documentaries", value: 563, percentage: 6.4, color: '#801014' },
  { name: "Kids", value: 493, percentage: 5.6, color: '#6B1B1E' },
  { name: "Crime TV Shows", value: 431, percentage: 4.9, color: '#581619' },
  { name: "Stand-Up Comedy", value: 378, percentage: 4.3, color: '#E0A96D' },
  { name: "Romantic Movies", value: 325, percentage: 3.7, color: '#C4935A' },
  { name: "Others", value: 2898, percentage: 32.9, color: '#2E2929' },
];

export const ratingsData = [
  { rating: "TV-MA", count: 3207, percentage: 36.4, color: "#E50914" },
  { rating: "TV-14", count: 2160, percentage: 24.5, color: "#D8232A" },
  { rating: "TV-PG", count: 863, percentage: 9.8, color: "#B81D24" },
  { rating: "R", count: 799, percentage: 9.1, color: "#E0A96D" },
  { rating: "PG-13", count: 490, percentage: 5.6, color: "#C4935A" },
  { rating: "TV-Y7", count: 334, percentage: 3.8, color: "#8E6E45" },
  { rating: "Others", count: 954, percentage: 10.8, color: "#2E2929" }
];

export const countryData = [
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

export const moviesData = [
  { id: 1, title: "The Irishman", director: "Martin Scorsese", year: 2019, rating: "R", genre: "Crime", duration: "209 min", country: "United States", score: 4.7, description: "An aging hitman recalls his involvement with the disappearance of Jimmy Hoffa." },
  { id: 2, title: "Bird Box", director: "Susanne Bier", year: 2018, rating: "R", genre: "Thriller", duration: "124 min", country: "United States", score: 3.8, description: "A woman and her children must make a dangerous journey through a mysterious force." },
  { id: 3, title: "Extraction", director: "Sam Hargrave", year: 2020, rating: "R", genre: "Action", duration: "116 min", country: "United States", score: 3.1, description: "A black-market mercenary must rescue an imprisoned international crime lord's son." },
  { id: 13, title: "The Gray Man", director: "Anthony Russo, Joe Russo", year: 2022, rating: "PG-13", genre: "Action", duration: "122 min", country: "United States", score: 4.0, description: "When a shadowy CIA agent uncovers agency secrets, he triggers a global hunt by rogue operatives." },
  { id: 14, title: "Spenser Confidential", director: "Peter Berg", year: 2020, rating: "R", genre: "Action", duration: "111 min", country: "United States", score: 3.0, description: "An ex-cop teams up with his roommate to take down drug cartels." },
  { id: 15, title: "6 Underground", director: "Michael Bay", year: 2019, rating: "R", genre: "Action", duration: "128 min", country: "United States", score: 3.7, description: "Six individuals from all around the globe, each the very best at what they do, have been chosen to delete their pasts." },
  { id: 4, title: "The Platform", director: "Galder Gaztelu-Urrutia", year: 2019, rating: "TV-MA", genre: "Sci-Fi", duration: "94 min", country: "Spain", score: 4.3, description: "A vertical prison with one cell per level. Two people per cell. One food platform." },
  { id: 5, title: "Don't Look Up", director: "Adam McKay", year: 2021, rating: "R", genre: "Comedy", duration: "138 min", country: "United States", score: 4.1, description: "Two astronomers try to warn the world about an approaching comet." },
  { id: 6, title: "The Adam Project", director: "Shawn Levy", year: 2022, rating: "PG-13", genre: "Sci-Fi", duration: "106 min", country: "United States", score: 4.0, description: "A time-traveling pilot teams up with his younger self to save the future." },
  { id: 7, title: "Glass Onion", director: "Rian Johnson", year: 2022, rating: "PG-13", genre: "Mystery", duration: "139 min", country: "United States", score: 4.6, description: "Detective Blanc investigates a murder among a group of friends on a private island." },
  { id: 8, title: "All Quiet on the Western Front", director: "Edward Berger", year: 2022, rating: "R", genre: "War", duration: "148 min", country: "Germany", score: 4.8, description: "A young German soldier's terrifying experiences during World War I." },
  { id: 9, title: "Ludo", director: "Anurag Basu", year: 2020, rating: "TV-MA", genre: "Comedy", duration: "149 min", country: "India", score: 4.1, description: "Four wildly different stories intersect in the most unexpected ways." },
  { id: 10, title: "Army of the Dead", director: "Zack Snyder", year: 2021, rating: "R", genre: "Action", duration: "148 min", country: "United States", score: 3.9, description: "A group of mercenaries risk a zombie heist in quarantined Las Vegas." },
  { id: 11, title: "Red Notice", director: "Rawson Marshall Thurber", year: 2021, rating: "PG-13", genre: "Action", duration: "118 min", country: "United States", score: 3.8, description: "An FBI profiler joins forces with the world's most wanted art thief." },
  { id: 12, title: "The Power of the Dog", director: "Jane Campion", year: 2021, rating: "R", genre: "Drama", duration: "126 min", country: "New Zealand", score: 4.4, description: "A domineering rancher responds with mocking cruelty when his brother brings home a new wife." },
];

export const tvShowsData = [
  { id: 1, title: "Stranger Things", seasons: 4, year: 2016, rating: "TV-14", genre: "Sci-Fi", country: "United States", score: 4.8, description: "Kids in a small town uncover a series of supernatural mysteries." },
  { id: 2, title: "Squid Game", seasons: 1, year: 2021, rating: "TV-MA", genre: "Thriller", country: "South Korea", score: 4.9, description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games." },
  { id: 3, title: "The Crown", seasons: 6, year: 2016, rating: "TV-MA", genre: "Drama", country: "United Kingdom", score: 4.6, description: "The life and reign of Queen Elizabeth II from her wedding to the present day." },
  { id: 4, title: "Money Heist", seasons: 5, year: 2017, rating: "TV-MA", genre: "Crime", country: "Spain", score: 4.7, description: "An enigmatic mastermind orchestrates the biggest heist in Spanish history." },
  { id: 5, title: "Dark", seasons: 3, year: 2017, rating: "TV-MA", genre: "Sci-Fi", country: "Germany", score: 4.8, description: "A missing child sets four families on a frantic hunt for answers." },
  { id: 6, title: "Bridgerton", seasons: 3, year: 2020, rating: "TV-MA", genre: "Romance", country: "United Kingdom", score: 4.3, description: "The eight siblings of the Bridgerton family navigate Regency London society." },
  { id: 7, title: "Wednesday", seasons: 1, year: 2022, rating: "TV-14", genre: "Comedy", country: "United States", score: 4.5, description: "Wednesday Addams investigates a murder spree at her new school." },
  { id: 8, title: "Sacred Games", seasons: 2, year: 2018, rating: "TV-MA", genre: "Thriller", country: "India", score: 4.4, description: "A Mumbai police officer receives a call from a gangster who threatens to destroy the city." },
  { id: 9, title: "Narcos", seasons: 3, year: 2015, rating: "TV-MA", genre: "Crime", country: "United States", score: 4.6, description: "The true story of the growth and spread of cocaine drug cartels." },
  { id: 10, title: "The Witcher", seasons: 3, year: 2019, rating: "TV-MA", genre: "Fantasy", country: "United States", score: 4.2, description: "A mutated monster hunter struggles to find his place in a world where people are more wicked than beasts." },
];

export const directorsData = [
  { name: "Rajiv Chilaka", titles: 22, country: "India", topTitle: "Mighty Little Bheem", genre: "Kids" },
  { name: "Jan Suter", titles: 21, country: "Switzerland", topTitle: "Zimmer", genre: "Documentary" },
  { name: "Raúl Campos", titles: 18, country: "Spain", topTitle: "Money Heist", genre: "Crime" },
  { name: "Marcus Raboy", titles: 16, country: "United States", topTitle: "Lost in Translation", genre: "Comedy" },
  { name: "Suhas Kadav", titles: 16, country: "India", topTitle: "Mighty Raju", genre: "Kids" },
  { name: "Jay Karas", titles: 15, country: "United States", topTitle: "Jeff Dunham Special", genre: "Stand-Up" },
  { name: "Cathy Garcia-Molina", titles: 13, country: "Philippines", topTitle: "Hello, Love, Goodbye", genre: "Romance" },
  { name: "Martin Scorsese", titles: 12, country: "United States", topTitle: "The Irishman", genre: "Crime" },
  { name: "Youssef Chahine", titles: 12, country: "Egypt", topTitle: "Cairo Station", genre: "Drama" },
  { name: "Jay Chapman", titles: 12, country: "Canada", topTitle: "Dark Comedy", genre: "Stand-Up" },
  { name: "Steven Spielberg", titles: 11, country: "United States", topTitle: "Schindler's List", genre: "Drama" },
  { name: "David Attenborough", titles: 10, country: "United Kingdom", topTitle: "Our Planet", genre: "Documentary" },
];

// Searchable index for live search
export const searchableItems = [
  ...moviesData.map(m => ({ ...m, type: 'Movie', label: m.title, sublabel: `${m.year} · ${m.genre} · ${m.director}` })),
  ...tvShowsData.map(t => ({ ...t, type: 'TV Show', label: t.title, sublabel: `${t.year} · ${t.genre} · S${t.seasons}` })),
  ...genreData.map(g => ({ type: 'Genre', label: g.name, sublabel: `${g.value} titles · ${g.percentage}%`, id: g.name })),
  ...countryData.map(c => ({ type: 'Country', label: c.country, sublabel: `${c.count} titles`, id: c.country })),
  ...directorsData.map(d => ({ type: 'Director', label: d.name, sublabel: `${d.titles} titles · ${d.country}`, id: d.name })),
];

export const notificationsData = [
  { id: 1, title: "New content added", message: "45 new titles were added to the catalog today", time: "2 min ago", read: false, type: "content" },
  { id: 2, title: "Weekly Report Ready", message: "Your weekly analytics report is ready to view", time: "1 hour ago", read: false, type: "report" },
  { id: 3, title: "Trending Alert", message: "Squid Game is trending #1 globally", time: "3 hours ago", read: false, type: "trending" },
  { id: 4, title: "Database Updated", message: "Database sync completed successfully", time: "5 hours ago", read: true, type: "system" },
  { id: 5, title: "New Director Added", message: "12 new directors added to the database", time: "Yesterday", read: true, type: "content" },
  { id: 6, title: "Country Stats Updated", message: "3 new countries added to content map", time: "Yesterday", read: true, type: "system" },
];

export const activityFeedData = [
  { id: 1, icon: "book", text: "<strong>45</strong> new titles added today", time: "2 min ago" },
  { id: 2, icon: "globe", text: "<strong>3</strong> new countries added", time: "1 hour ago" },
  { id: 3, icon: "database", text: "Database updated <strong>2 hours</strong> ago", time: "2 hours ago" },
  { id: 4, icon: "trending", text: "<strong>Squid Game</strong> trending #1", time: "3 hours ago" },
  { id: 5, icon: "film", text: "<strong>12</strong> movies categorized", time: "5 hours ago" },
];

export const analyticsData = {
  contentGrowth: [
    { month: 'Jan', movies: 340, tvShows: 120 },
    { month: 'Feb', movies: 310, tvShows: 105 },
    { month: 'Mar', movies: 420, tvShows: 150 },
    { month: 'Apr', movies: 380, tvShows: 135 },
    { month: 'May', movies: 450, tvShows: 170 },
    { month: 'Jun', movies: 500, tvShows: 200 },
    { month: 'Jul', movies: 530, tvShows: 220 },
    { month: 'Aug', movies: 480, tvShows: 195 },
    { month: 'Sep', movies: 460, tvShows: 185 },
    { month: 'Oct', movies: 510, py: 210, tvShows: 210 },
    { month: 'Nov', movies: 550, tvShows: 230 },
    { month: 'Dec', movies: 580, tvShows: 250 },
  ],
  genrePopularity: [
    { genre: 'Drama', score: 92 },
    { genre: 'Comedy', score: 85 },
    { genre: 'Action', score: 78 },
    { genre: 'Thriller', score: 74 },
    { genre: 'Documentary', score: 68 },
    { genre: 'Romance', score: 62 },
    { genre: 'Sci-Fi', score: 58 },
    { genre: 'Horror', score: 52 },
  ],
  viewerEngagement: [
    { hour: '6AM', engagement: 15 }, { hour: '8AM', engagement: 25 },
    { hour: '10AM', engagement: 35 }, { hour: '12PM', engagement: 55 },
    { hour: '2PM', engagement: 45 }, { hour: '4PM', engagement: 50 },
    { hour: '6PM', engagement: 72 }, { hour: '8PM', engagement: 95 },
    { hour: '10PM', engagement: 88 }, { hour: '12AM', engagement: 60 },
  ]
};
