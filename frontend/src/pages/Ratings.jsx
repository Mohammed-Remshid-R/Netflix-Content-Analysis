import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  ArrowLeft,
  ArrowRight,
  Eye,
  PieChart,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { Cell, Pie, PieChart as RechartsPieChart } from 'recharts';
import MoviePoster from '../components/MoviePoster';
import API from '../services/api';

const ratingTabs = ['TV-MA', 'TV-14', 'TV-PG', 'R', 'PG-13', 'TV-Y7', 'G', 'Others'];

const fallbackSummary = {
  total_titles: 8756,
  avg_rating: 4.3,
  total_views: '12.4M',
  top_rating: 'TV-MA',
  top_rating_pct: 36.4,
  satisfaction_index: 87,
  satisfaction_delta: '+5%',
};

const fallbackDistribution = [
  { rating: 'TV-MA', titles: 3207, percentage: 36.4, views: '4.8M', color: '#E50914' },
  { rating: 'TV-14', titles: 2160, percentage: 24.5, views: '3.6M', color: '#D8232A' },
  { rating: 'TV-PG', titles: 863, percentage: 9.8, views: '1.2M', color: '#B81D24' },
  { rating: 'R', titles: 799, percentage: 9.1, views: '1.1M', color: '#E0A96D' },
  { rating: 'PG-13', titles: 490, percentage: 5.6, views: '812K', color: '#C4935A' },
  { rating: 'TV-Y7', titles: 334, percentage: 3.8, views: '456K', color: '#8E6E45' },
  { rating: 'G', titles: 143, percentage: 1.6, views: '198K', color: '#6B1B1E' },
  { rating: 'Others', titles: 954, percentage: 10.8, views: '1.0M', color: '#2E2929' },
];

const fallbackAvgRatings = [
  { rating: 'TV-MA', value: 4.4 },
  { rating: 'TV-14', value: 4.3 },
  { rating: 'TV-PG', value: 4.1 },
  { rating: 'R', value: 4.0 },
  { rating: 'PG-13', value: 3.9 },
  { rating: 'TV-Y7', value: 3.8 },
  { rating: 'G', value: 3.6 },
  { rating: 'Others', value: 3.9 },
];

const carouselItems = [
  { title: 'Breaking Bad', year: 2008, rating: 'TV-MA', score: 4.9 },
  { title: 'The Dark Knight', year: 2008, rating: 'TV-MA', score: 4.8 },
  { title: 'Stranger Things', year: 2016, rating: 'TV-14', score: 4.7 },
  { title: 'The Sopranos', year: 1999, rating: 'TV-MA', score: 4.7 },
  { title: 'Narcos', year: 2015, rating: 'TV-MA', score: 4.6 },
  { title: 'Ozark', year: 2017, rating: 'TV-MA', score: 4.6 },
  { title: 'Mindhunter', year: 2017, rating: 'TV-MA', score: 4.5 },
  { title: 'Better Call Saul', year: 2015, rating: 'TV-MA', score: 4.5 },
  { title: 'Wednesday', year: 2022, rating: 'TV-14', score: 4.5 },
  { title: 'Glass Onion', year: 2022, rating: 'PG-13', score: 4.6 },
  { title: 'All Quiet on the Western Front', year: 2022, rating: 'R', score: 4.8 },
  { title: 'The Platform', year: 2019, rating: 'TV-MA', score: 4.3 },
];

const cards = [
  {
    title: 'Total Titles',
    label: 'Total Titles',
    valueKey: 'total_titles',
    trend: '+10.7%',
    spark: [16, 18, 17, 22, 24, 23, 26],
    icon: Award,
    iconBg: 'bg-gradient-to-br from-[#E50914] to-[#B81D24]',
    accent: '#E50914',
  },
  {
    title: 'Avg. Rating',
    label: 'Avg. Rating',
    valueKey: 'avg_rating',
    trend: '+0.7',
    spark: [3.8, 3.9, 4.0, 4.1, 4.2, 4.2, 4.3],
    icon: Star,
    iconBg: 'bg-gradient-to-br from-[#F5A623] to-[#FF8C1A]',
    accent: '#FF8C1A',
  },
  {
    title: 'Total Views',
    label: 'Total Views',
    valueKey: 'total_views',
    trend: '+12.5%',
    spark: [18, 20, 18, 21, 23, 24, 26],
    icon: Eye,
    iconBg: 'bg-gradient-to-br from-[#E50914] to-[#D8232A]',
    accent: '#E50914',
  },
  {
    title: 'Top Rating',
    label: 'Top Rating',
    valueKey: 'top_rating',
    subtitleKey: 'top_rating_pct',
    trend: null,
    spark: [12, 14, 14, 13, 15, 14, 14],
    icon: PieChart,
    iconBg: 'bg-gradient-to-br from-[#6B1B1E] to-[#2E2929]',
    accent: '#A1A1AA',
  },
  {
    title: 'User Satisfaction Index',
    label: 'User Satisfaction Index',
    valueKey: 'satisfaction_index',
    trend: '+5%',
    spark: [18, 19, 20, 22, 23, 24, 25],
    icon: ThumbsUp,
    iconBg: 'bg-gradient-to-br from-[#FF8C1A] to-[#F5A623]',
    accent: '#FF8C1A',
  },
];

function Ratings() {
  const [summary, setSummary] = useState(fallbackSummary);
  const [distribution, setDistribution] = useState(fallbackDistribution);
  const [avgRatings, setAvgRatings] = useState(fallbackAvgRatings);
  const [activeTab, setActiveTab] = useState('TV-MA');
  const carouselRef = useRef(null);

  const visibleItems = useMemo(
    () => carouselItems.filter((item) => item.rating === activeTab || (activeTab === 'Others' && !ratingTabs.slice(0, 7).includes(item.rating))),
    [activeTab]
  );

  const scrollCarousel = (offset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    API.get('/ratings')
      .then((response) => {
        const data = response.data || {};
        setSummary({ ...fallbackSummary, ...(data.summary || {}) });
        setDistribution(data.distribution || fallbackDistribution);
        setAvgRatings(data.avgRatings || fallbackAvgRatings);
      })
      .catch(() => {
        setSummary(fallbackSummary);
        setDistribution(fallbackDistribution);
        setAvgRatings(fallbackAvgRatings);
      });
  }, []);

  const renderStars = (value) => {
    const fullStars = Math.floor(value);
    const stars = Array.from({ length: 5 }).map((_, index) => {
      const isFilled = index < fullStars;
      return (
        <Star
          key={index}
          size={14}
          className={isFilled ? 'text-[#F5A623]' : 'text-[#4B4B4B]'}
          fill={isFilled ? '#F5A623' : 'none'}
          stroke={isFilled ? '#F5A623' : '#4B4B4B'}
        />
      );
    });
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C0505] text-[#E50914] shadow-[0_0_24px_rgba(229,9,20,0.16)]">
            <Award size={18} />
          </div>
          <div>
            <p className="text-[12px] uppercase tracking-[0.35em] text-[#A1A1AA]">Ratings Classification</p>
            <h1 className="text-[20px] font-bold text-white">Ratings Classification</h1>
            <p className="mt-2 max-w-2xl text-[13px] text-[#A1A1AA] leading-6">Audit movie and TV series classifications. Select a classification rating to audit indexing list.</p>
          </div>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          const rawValue = summary[card.valueKey];
          const value = card.valueKey === 'satisfaction_index' ? `${rawValue}%` : rawValue;
          const subtitle = card.subtitleKey ? `${summary[card.subtitleKey]}% of total titles` : null;
          return (
            <motion.div
              key={card.title}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-[125px] rounded-[24px] border border-white/10 bg-[#0B0B0B] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.24)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-[#A1A1AA]">{card.label}</p>
                  <p className="mt-4 text-[40px] font-bold text-white">{value}</p>
                </div>
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg} text-white`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${card.accent === '#A1A1AA' ? 'text-[#9CA3AF]' : 'text-[#22C55E]'}`}>
                  {subtitle || card.trend}
                </span>
                <div className="h-10 w-[120px] overflow-hidden rounded-[12px] bg-[#121212]">
                  <svg width="120" height="40" viewBox="0 0 120 40" className="block">
                    <polyline
                      fill="none"
                      stroke={card.accent}
                      strokeWidth="3"
                      strokeLinecap="round"
                      points={card.spark.map((point, index) => `${(index / (card.spark.length - 1)) * 120},${36 - point}`).join(' ')}
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1.1fr]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-[28px] border border-white/10 bg-[#0B0B0B] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.24)]"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.32em] text-[#A1A1AA]">Classification Distribution</p>
              <h2 className="mt-2 text-[16px] font-semibold text-white">Classification Distribution</h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#111]/90 px-4 py-2 text-[12px] font-semibold text-white transition hover:border-white/20 hover:bg-[#1a1a1a]" type="button">
              View All Classifications
            </button>
          </div>

          <div className="mt-6 xl:flex xl:items-center xl:gap-8">
            <div className="mx-auto xl:mx-0 relative w-full max-w-[360px]">
              <RechartsPieChart width={340} height={340}>
                <Pie
                  isAnimationActive
                  data={distribution}
                  dataKey="titles"
                  nameKey="rating"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                >
                  {distribution.map((entry) => (
                    <Cell key={entry.rating} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111] border border-white/10 shadow-[0_0_30px_rgba(229,9,20,0.18)]">
                  <Star size={18} className="text-[#F5A623]" />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#101010]">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-[0.32em] text-[#A1A1AA]">
                      <th className="px-4 py-4">Classification</th>
                      <th className="px-4 py-4">Titles</th>
                      <th className="px-4 py-4">% of Total</th>
                      <th className="px-4 py-4">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distribution.map((item) => (
                      <tr key={item.rating} className="border-t border-white/5">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="font-semibold text-white">{item.rating}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-white">{item.titles.toLocaleString()}</td>
                        <td className="px-4 py-4 text-[#A1A1AA]">{item.percentage}%</td>
                        <td className="px-4 py-4 text-[#A1A1AA]">{item.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
          className="rounded-[28px] border border-white/10 bg-[#0B0B0B] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.24)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.32em] text-[#A1A1AA]">Average Rating by Classification</p>
              <h2 className="mt-2 text-[16px] font-semibold text-white">Average Rating by Classification</h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#111]/90 px-4 py-2 text-[12px] font-semibold text-white transition hover:border-white/20 hover:bg-[#1a1a1a]" type="button">
              View All
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {avgRatings.map((item) => (
              <div key={item.rating} className="rounded-[22px] border border-white/10 bg-[#101010] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-white">{item.rating}</div>
                  <div className="text-sm font-semibold text-white">{item.value.toFixed(1)}</div>
                </div>
                <div className="mt-3">{renderStars(item.value)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.32em] text-[#A1A1AA]">Top Rated Titles by Classification</p>
            <h2 className="mt-2 text-[16px] font-semibold text-white">Top Rated Titles by Classification</h2>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-[#111]/90 px-4 py-2 text-[12px] font-semibold text-white transition hover:border-white/20 hover:bg-[#1a1a1a]" type="button">
            View All
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {ratingTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-4 py-2 text-[12px] font-semibold transition ${activeTab === tab ? 'bg-[#E50914] text-white border-[#E50914]' : 'bg-[#111] text-[#A1A1AA] border-white/10 hover:border-white/20'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCarousel(-260)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#111]/90 text-white transition hover:border-white/20 hover:bg-[#1a1a1a]"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel(260)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#111]/90 text-white transition hover:border-white/20 hover:bg-[#1a1a1a]"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="ratings-carousel flex gap-4 overflow-x-auto pb-2 pr-2"
          >
            {visibleItems.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="min-w-[135px] snap-start rounded-[18px] border border-white/10 bg-[#101010] p-3"
              >
                <div className="relative overflow-hidden rounded-[12px] border border-white/10 bg-[#0d0d0d] h-[190px] w-[135px]">
                  <span className="absolute left-3 top-3 inline-flex items-center justify-center rounded-full bg-[#E50914] px-2 py-1 text-[10px] font-semibold uppercase text-white shadow-[0_8px_24px_rgba(229,9,20,0.16)]">
                    {item.rating}
                  </span>
                  <MoviePoster title={item.title} year={item.year} />
                </div>
                <div className="mt-3 text-[14px] font-semibold text-white leading-tight">{item.title}</div>
                <div className="mt-2 flex items-center justify-between text-[12px] text-[#A1A1AA]">
                  <span>{item.year}</span>
                  <span className="inline-flex items-center gap-1 text-[#F5A623] font-semibold">
                    <Star size={12} /> {item.score.toFixed(1)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="max-w-2xl text-[12px] text-[#A1A1AA]">Ratings are based on Netflix internal scoring algorithm combining user engagement, critique scores and popularity metrics.</p>
      </section>
    </div>
  );
}

export default Ratings;
