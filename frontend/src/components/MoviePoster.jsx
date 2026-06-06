import React, { useState, useEffect } from 'react';

// Global cache for movie posters
const posterCache = {};

function MoviePoster({ title, year }) {
  const [posterUrl, setPosterUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!title) return;

    const cacheKey = `${title}_${year || ''}`;
    if (posterCache[cacheKey]) {
      setPosterUrl(posterCache[cacheKey]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const query = encodeURIComponent(title);
    const apiKey = 'thewdb'; // OMDb public key
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&t=${query}${year ? `&y=${year}` : ''}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.Response === 'True' && data.Poster && data.Poster !== 'N/A') {
          posterCache[cacheKey] = data.Poster;
          setPosterUrl(data.Poster);
        } else {
          // fallback: try without year if year was supplied
          if (year) {
            fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${query}`)
              .then(res => res.json())
              .then(data2 => {
                if (data2.Response === 'True' && data2.Poster && data2.Poster !== 'N/A') {
                  posterCache[cacheKey] = data2.Poster;
                  setPosterUrl(data2.Poster);
                } else {
                  posterCache[cacheKey] = null;
                  setPosterUrl(null);
                }
              })
              .catch(() => {
                posterCache[cacheKey] = null;
                setPosterUrl(null);
              })
              .finally(() => setLoading(false));
            return;
          }
          posterCache[cacheKey] = null;
          setPosterUrl(null);
        }
      })
      .catch(() => {
        setPosterUrl(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [title, year]);

  if (loading) {
    return (
      <div className="w-full h-full bg-[#111] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-neutral-800 border-t-[#E50914] rounded-full animate-spin" />
      </div>
    );
  }

  if (!posterUrl) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#0a0a0a] flex flex-col items-center justify-center p-3 text-center relative select-none">
        <svg className="text-[#E50914]/20 mb-2" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 9.5a.5.5 0 0 1-.5.5h-2v2a.5.5 0 0 1-1 0v-2H5a.5.5 0 0 1 0-1h2V6a.5.5 0 0 1 1 0v2h2a.5.5 0 0 1 .5.5z"/></svg>
        <span className="text-[10px] font-black text-neutral-300 tracking-wider uppercase leading-tight line-clamp-3 px-1">{title}</span>
        <div className="absolute bottom-10 px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-[7px] text-neutral-600 font-bold uppercase tracking-widest">
          NETFLIX
        </div>
      </div>
    );
  }

  return (
    <img
      src={posterUrl}
      alt={title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
  );
}

export default MoviePoster;
