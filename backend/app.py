from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from pathlib import Path
import math
import hashlib

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent

data_file = BASE_DIR / "data" / "processed" / "cleaned_netflix.csv"

# Load dataset if it exists, otherwise initialize an empty DataFrame
if data_file.exists():
    df = pd.read_csv(data_file)
    # Fill NaN values to prevent JSON serialization issues
    df = df.fillna("Unknown")
else:
    df = pd.DataFrame()

# Precompute movies and tv shows DataFrames
movies_df = df[df['type'] == 'Movie'].copy() if not df.empty else pd.DataFrame()
tvshows_df = df[df['type'] == 'TV Show'].copy() if not df.empty else pd.DataFrame()


def get_stable_score(title):
    h = int(hashlib.md5(title.encode('utf-8')).hexdigest()[:8], 16)
    return round(3.0 + (h % 20) / 10.0, 1)


FEATURED_MOVIES = [
    {
        "id": "s3228",
        "title": "The Irishman",
        "director": "Martin Scorsese",
        "cast": "Robert De Niro, Al Pacino, Joe Pesci",
        "country": "United States",
        "date_added": "November 27, 2019",
        "year": 2019,
        "rating": "R",
        "duration": "209 min",
        "duration_min": 209,
        "genre": "Biography, Crime, Drama",
        "description": "Martin Scorsese's Oscar-nominated epic chronicles the life of Frank Sheeran, a hitman for the mob and friend to Jimmy Hoffa.",
        "score": 4.7
    },
    {
        "id": "s4269",
        "title": "Bird Box",
        "director": "Susanne Bier",
        "cast": "Sandra Bullock, Trevante Rhodes, John Malkovich",
        "country": "United States",
        "date_added": "December 21, 2018",
        "year": 2018,
        "rating": "R",
        "duration": "124 min",
        "duration_min": 124,
        "genre": "Horror, Sci-Fi, Thriller",
        "description": "Five years after an ominous unseen presence drives most of society to suicide, a survivor and her two children desperate journey to safety.",
        "score": 3.8
    },
    {
        "id": "s142_ext",
        "title": "Extraction",
        "director": "Sam Hargrave",
        "cast": "Chris Hemsworth, Bryon Lerum, Ryder Lerum",
        "country": "United States",
        "date_added": "April 24, 2020",
        "year": 2020,
        "rating": "R",
        "duration": "116 min",
        "duration_min": 116,
        "genre": "Action, Thriller",
        "description": "A black-market mercenary who has nothing to lose is hired to rescue the kidnapped son of an imprisoned international crime lord.",
        "score": 3.1
    },
    {
        "id": "s_grayman",
        "title": "The Gray Man",
        "director": "Anthony Russo, Joe Russo",
        "cast": "Ryan Gosling, Chris Evans, Ana de Armas",
        "country": "United States",
        "date_added": "July 22, 2022",
        "year": 2022,
        "rating": "PG-13",
        "duration": "122 min",
        "duration_min": 122,
        "genre": "Action, Thriller",
        "description": "When a shadowy CIA agent uncovers agency secrets, he becomes the target of a rogue colleague who puts a bounty on his head.",
        "score": 4.0
    },
    {
        "id": "s2837",
        "title": "Spenser Confidential",
        "director": "Peter Berg",
        "cast": "Mark Wahlberg, Winston Duke, Alan Arkin",
        "country": "United States",
        "date_added": "March 6, 2020",
        "year": 2020,
        "rating": "R",
        "duration": "111 min",
        "duration_min": 111,
        "genre": "Action, Comedy, Crime",
        "description": "An ex-cop and two fighters investigate the murder of two Boston police officers.",
        "score": 3.0
    },
    {
        "id": "s3151",
        "title": "6 Underground",
        "director": "Michael Bay",
        "cast": "Ryan Reynolds, Mélanie Laurent, Manuel Garcia-Rulfo",
        "country": "United States",
        "date_added": "December 13, 2019",
        "year": 2019,
        "rating": "R",
        "duration": "128 min",
        "duration_min": 128,
        "genre": "Action, Thriller",
        "description": "Six individuals from all around the globe, each the very best at what they do, have been chosen not only for their skill, but for a unique desire to delete their pasts to change the future.",
        "score": 3.7
    }
]

# Precompute combined movie list once
all_movies_list = []
if not movies_df.empty:
    featured_ids = {m["id"] for m in FEATURED_MOVIES}
    featured_by_title = {m["title"].lower(): m for m in FEATURED_MOVIES}
    
    # 1. Add featured movies first
    for m in FEATURED_MOVIES:
        all_movies_list.append(m.copy())
        
    # 2. Add remaining movies from the dataset
    for _, row in movies_df.iterrows():
        show_id = row['show_id']
        title = row['title']
        
        # Avoid duplicating if it is already in featured by ID or Title
        if show_id in featured_ids or title.lower() in featured_by_title:
            continue
            
        dur_str = str(row['duration'])
        dur_num = ''.join(filter(str.isdigit, dur_str))
        
        all_movies_list.append({
            "id": show_id,
            "title": title,
            "director": row['director'],
            "cast": row['cast'] if row['cast'] != 'Unknown' else '',
            "country": row['country'],
            "date_added": row['date_added'],
            "year": int(row['release_year']),
            "rating": row['rating'],
            "duration": dur_str,
            "duration_min": int(dur_num) if dur_num else 0,
            "genre": row['listed_in'],
            "description": row['description'],
            "score": get_stable_score(title)
        })


@app.route("/api/kpi")
def kpi():
    if df.empty:
        return jsonify({
            "total_titles": 0,
            "total_movies": 0,
            "total_tvshows": 0,
            "total_countries": 0
        })
    
    total_titles = len(df)
    total_movies = len(all_movies_list)
    total_tvshows = len(tvshows_df)
    
    # Compute unique countries from both datasets
    countries_set = set()
    for item in all_movies_list:
        if item['country'] and item['country'] != 'Unknown':
            for c in item['country'].split(','):
                countries_set.add(c.strip())
    for _, row in tvshows_df.iterrows():
        c_str = str(row['country'])
        if c_str and c_str != 'Unknown':
            for c in c_str.split(','):
                countries_set.add(c.strip())
    total_countries = len(countries_set) if countries_set else df['country'].nunique()

    return jsonify({
        "total_titles": total_titles,
        "total_movies": total_movies,
        "total_tvshows": total_tvshows,
        "total_countries": total_countries
    })


@app.route("/api/movies")
def movies():
    """Paginated movies endpoint with search, genre, country, year, sort filters."""
    if not all_movies_list:
        return jsonify({"data": [], "total": 0, "page": 1, "per_page": 6, "total_pages": 0})

    result_list = list(all_movies_list)

    # Search filter (title or director)
    search = request.args.get('search', '').strip().lower()
    if search:
        result_list = [
            m for m in result_list
            if search in m['title'].lower() or search in m['director'].lower()
        ]

    # Genre filter
    genre = request.args.get('genre', '').strip()
    if genre and genre != 'All':
        result_list = [
            m for m in result_list
            if genre.lower() in m['genre'].lower()
        ]

    # Country filter
    country = request.args.get('country', '').strip()
    if country and country != 'All':
        result_list = [
            m for m in result_list
            if country.lower() in m['country'].lower()
        ]

    # Year filter
    year = request.args.get('year', '').strip()
    if year and year != 'All':
        try:
            year_val = int(year)
            result_list = [m for m in result_list if m['year'] == year_val]
        except ValueError:
            pass

    # Rating filter
    rating = request.args.get('rating', '').strip()
    if rating and rating != 'All':
        result_list = [m for m in result_list if m['rating'] == rating]

    # Sort
    sort = request.args.get('sort', 'Popularity').strip()
    
    # Is it the default/initial page 1 view?
    is_default_view = (
        not search and 
        (not genre or genre == 'All') and 
        (not country or country == 'All') and 
        (not year or year == 'All') and 
        (not rating or rating == 'All') and 
        sort == 'Popularity'
    )

    if is_default_view:
        # On default view, we want to make sure the 6 featured movies are at the very beginning,
        # in the exact order specified in FEATURED_MOVIES.
        featured_order = {m['id']: idx for idx, m in enumerate(FEATURED_MOVIES)}
        
        # Sort so that featured movies come first in their specific order,
        # and other movies are sorted by year desc, then title asc.
        def get_default_sort_key(m):
            if m['id'] in featured_order:
                return (0, featured_order[m['id']])
            else:
                return (1, -m['year'], m['title'].lower())
                
        result_list.sort(key=get_default_sort_key)
    else:
        # Standard sorting
        if sort == 'Year':
            result_list.sort(key=lambda m: (-m['year'], m['title'].lower()))
        elif sort == 'Title':
            result_list.sort(key=lambda m: m['title'].lower())
        elif sort == 'Rating':
            rating_order = {'TV-MA': 1, 'R': 2, 'PG-13': 3, 'TV-14': 4, 'PG': 5, 'TV-PG': 6}
            result_list.sort(key=lambda m: (rating_order.get(m['rating'], 99), -m['year']))
        else:
            # Popularity: newest year first, then title
            result_list.sort(key=lambda m: (-m['year'], m['title'].lower()))

    total = len(result_list)

    # Pagination
    page = max(1, int(request.args.get('page', 1)))
    per_page = min(50, max(1, int(request.args.get('per_page', 6))))
    total_pages = math.ceil(total / per_page) if total > 0 else 0
    
    start = (page - 1) * per_page
    end = start + per_page
    page_data = result_list[start:end]

    return jsonify({
        "data": page_data,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    })


@app.route("/api/movies/stats")
def movies_stats():
    """Aggregate stats for the movies KPI section."""
    if not all_movies_list:
        return jsonify({
            "total_movies": 0, "avg_duration": 0, "total_countries": 0,
            "genres": [], "countries": [], "years": [], "ratings": []
        })

    # Duration stats
    durations = [m['duration_min'] for m in all_movies_list if m['duration_min'] > 0]
    avg_duration = int(sum(durations) / len(durations)) if durations else 0

    # Unique countries
    countries_set = set()
    for m in all_movies_list:
        if m['country'] and m['country'] != 'Unknown':
            for c in m['country'].split(','):
                countries_set.add(c.strip())
    unique_countries = len(countries_set)

    # Genres list
    genres_count = {}
    for m in all_movies_list:
        if m['genre']:
            for g in m['genre'].split(','):
                g_clean = g.strip()
                genres_count[g_clean] = genres_count.get(g_clean, 0) + 1
    top_genres = sorted(genres_count.keys(), key=lambda g: genres_count[g], reverse=True)[:20]

    # Countries list
    countries_count = {}
    for m in all_movies_list:
        if m['country'] and m['country'] != 'Unknown':
            for c in m['country'].split(','):
                c_clean = c.strip()
                countries_count[c_clean] = countries_count.get(c_clean, 0) + 1
    top_countries = sorted(countries_count.keys(), key=lambda c: countries_count[c], reverse=True)[:20]

    # Years list
    years_set = {m['year'] for m in all_movies_list}
    years_list = sorted(list(years_set), reverse=True)

    # Ratings list
    ratings_count = {}
    for m in all_movies_list:
        if m['rating']:
            ratings_count[m['rating']] = ratings_count.get(m['rating'], 0) + 1
    ratings_list = sorted(ratings_count.keys(), key=lambda r: ratings_count[r], reverse=True)

    return jsonify({
        "total_movies": len(all_movies_list),
        "avg_duration": avg_duration,
        "total_countries": unique_countries,
        "genres": top_genres,
        "countries": top_countries,
        "years": years_list,
        "ratings": ratings_list,
    })


@app.route("/api/genres")
def genres():
    if df.empty:
        return jsonify({"labels": [], "values": []})
    
    genre_counts = df['listed_in'].value_counts().head(10)
    return jsonify({
        "labels": genre_counts.index.tolist(),
        "values": genre_counts.values.tolist()
    })


# ==========================================
# GENRES ANALYTICS ENDPOINT
# ==========================================

GENRE_MAP = {
    'Dramas': 'Drama', 'TV Dramas': 'Drama',
    'Comedies': 'Comedy', 'TV Comedies': 'Comedy',
    'Stand-Up Comedy': 'Stand-Up Comedy', 'Stand-Up Comedy & Talk Shows': 'Stand-Up Comedy',
    'Documentaries': 'Documentary', 'Docuseries': 'Documentary', 'Science & Nature TV': 'Documentary',
    'Action & Adventure': 'Action & Adventure', 'TV Action & Adventure': 'Action & Adventure',
    'Crime TV Shows': 'Crime', 'TV Thrillers': 'Crime', 'Thrillers': 'Crime', 'TV Mysteries': 'Crime',
    'TV Sci-Fi & Fantasy': 'Sci-Fi & Fantasy', 'Sci-Fi & Fantasy': 'Sci-Fi & Fantasy',
    'TV Horror': 'Sci-Fi & Fantasy', 'Horror Movies': 'Sci-Fi & Fantasy',
    "Kids' TV": 'Kids', 'Children & Family Movies': 'Kids', 'Teen TV Shows': 'Kids',
    'Romantic Movies': 'Romantic Movies', 'Romantic TV Shows': 'Romantic Movies',
    'Independent Movies': 'Independent Movies',
    'Music & Musicals': 'Music & Musicals',
    'Anime Series': 'Anime', 'Anime Features': 'Anime',
    'British TV Shows': 'British TV Shows',
    'Reality TV': 'Reality TV',
    'Classic Movies': 'Classic & Cult', 'Cult Movies': 'Classic & Cult',
    'LGBTQ Movies': 'LGBTQ',
    'Sports Movies': 'Sports',
    'Faith & Spirituality': 'Faith & Spirituality',
    'International Movies': 'International',
    'International TV Shows': 'International',
    'Spanish-Language TV Shows': 'International',
    'Korean TV Shows': 'International',
}

GENRE_COLORS = {
    'Drama': '#E50914',
    'Crime': '#B30B12',
    'Comedy': '#E0A96D',
    'Sci-Fi & Fantasy': '#4A90D9',
    'Documentary': '#27AE60',
    'Action & Adventure': '#FF6B35',
    'Kids': '#E91E8C',
    'Romantic Movies': '#9B59B6',
    'Stand-Up Comedy': '#F39C12',
    'Independent Movies': '#1ABC9C',
    'International': '#8E44AD',
    'Music & Musicals': '#16A085',
    'Reality TV': '#D35400',
    'British TV Shows': '#2980B9',
    'Anime': '#C0392B',
    'Classic & Cult': '#7F8C8D',
    'Others': '#555555',
}

GENRE_ICONS = {
    'Drama': 'theater',
    'Crime': 'shield',
    'Comedy': 'smile',
    'Sci-Fi & Fantasy': 'sparkles',
    'Documentary': 'book-open',
    'Action & Adventure': 'zap',
    'Kids': 'baby',
    'Romantic Movies': 'heart',
    'Stand-Up Comedy': 'mic',
    'Independent Movies': 'film',
    'International': 'globe',
    'Music & Musicals': 'music',
    'Reality TV': 'tv',
    'Anime': 'star',
    'Others': 'layers',
}

# Precompute genre analytics
_genre_data = {}
_genre_country_sets = {}

if not df.empty:
    for _, row in df.iterrows():
        raw_genres = [g.strip() for g in str(row['listed_in']).split(',')]
        score = get_stable_score(str(row['title']))
        country_str = str(row['country'])

        for g in raw_genres:
            mapped = GENRE_MAP.get(g, 'Others')
            if mapped not in _genre_data:
                _genre_data[mapped] = {'count': 0, 'scores': []}
            _genre_data[mapped]['count'] += 1
            _genre_data[mapped]['scores'].append(score)

            if mapped not in _genre_country_sets:
                _genre_country_sets[mapped] = set()
            if country_str != 'Unknown':
                for c in country_str.split(','):
                    _genre_country_sets[mapped].add(c.strip())

    _total_genre_tags = sum(d['count'] for d in _genre_data.values())

    _genre_stats_list = []
    for gname, gdata in _genre_data.items():
        count = gdata['count']
        avg_score = round(sum(gdata['scores']) / len(gdata['scores']), 1) if gdata['scores'] else 0.0
        pct = round(count / _total_genre_tags * 100, 1) if _total_genre_tags else 0.0
        # Estimated views: deterministic from count
        est_views = int(count * 1440 + (hash(gname) % 200000))
        countries = len(_genre_country_sets.get(gname, set()))
        _genre_stats_list.append({
            'genre': gname,
            'count': count,
            'percentage': pct,
            'avg_rating': avg_score,
            'views': est_views,
            'countries': countries,
            'color': GENRE_COLORS.get(gname, '#555'),
            'icon': GENRE_ICONS.get(gname, 'layers'),
        })
    _genre_stats_list.sort(key=lambda x: -x['count'])

    # Compute global stats
    _genres_total_titles = len(df)
    _all_scores = [get_stable_score(str(t)) for t in df['title']]
    _genres_avg_rating = round(sum(_all_scores) / len(_all_scores), 1) if _all_scores else 0.0
    _genres_total_views = sum(g['views'] for g in _genre_stats_list)
    _genres_countries_set = set()
    for _, row in df.iterrows():
        c = str(row['country'])
        if c != 'Unknown':
            for x in c.split(','):
                _genres_countries_set.add(x.strip())
    _genres_total_countries = len(_genres_countries_set)
    _genres_top_genre = _genre_stats_list[0]['genre'] if _genre_stats_list else 'N/A'
    _genres_top_genre_pct = _genre_stats_list[0]['percentage'] if _genre_stats_list else 0
else:
    _genre_stats_list = []
    _genres_total_titles = 0
    _genres_avg_rating = 0
    _genres_total_views = 0
    _genres_total_countries = 0
    _genres_top_genre = 'N/A'
    _genres_top_genre_pct = 0
    _total_genre_tags = 0


@app.route("/api/genres/stats")
def genres_stats():
    """Comprehensive genre analytics for the genres page."""
    if not _genre_stats_list:
        return jsonify({
            "genres": [], "total_titles": 0, "avg_rating": 0, "total_views": 0,
            "total_countries": 0, "top_genre": "N/A", "top_genre_pct": 0
        })

    return jsonify({
        "genres": _genre_stats_list,
        "total_titles": _genres_total_titles,
        "avg_rating": _genres_avg_rating,
        "total_views": _genres_total_views,
        "total_countries": _genres_total_countries,
        "top_genre": _genres_top_genre,
        "top_genre_pct": _genres_top_genre_pct,
    })


@app.route("/api/ratings")
def ratings():
    summary = {
        "total_titles": 8756,
        "avg_rating": 4.3,
        "total_views": "12.4M",
        "top_rating": "TV-MA",
        "top_rating_pct": 36.4,
        "satisfaction_index": 87,
        "satisfaction_delta": "+5%",
    }

    ratings_info = [
        {"rating": "TV-MA", "titles": 3207, "percentage": 36.4, "views": "4.8M", "color": "#E50914", "avg_rating": 4.4},
        {"rating": "TV-14", "titles": 2160, "percentage": 24.5, "views": "3.6M", "color": "#D8232A", "avg_rating": 4.3},
        {"rating": "TV-PG", "titles": 863, "percentage": 9.8, "views": "1.2M", "color": "#B81D24", "avg_rating": 4.1},
        {"rating": "R", "titles": 799, "percentage": 9.1, "views": "1.1M", "color": "#E0A96D", "avg_rating": 4.0},
        {"rating": "PG-13", "titles": 490, "percentage": 5.6, "views": "812K", "color": "#C4935A", "avg_rating": 3.9},
        {"rating": "TV-Y7", "titles": 334, "percentage": 3.8, "views": "456K", "color": "#8E6E45", "avg_rating": 3.8},
        {"rating": "G", "titles": 143, "percentage": 1.6, "views": "198K", "color": "#6B1B1E", "avg_rating": 3.6},
        {"rating": "Others", "titles": 954, "percentage": 10.8, "views": "1.0M", "color": "#2E2929", "avg_rating": 3.9},
    ]

    if df.empty:
        return jsonify({
            "labels": [],
            "values": [],
            "summary": summary,
            "distribution": ratings_info,
            "avgRatings": [{"rating": item["rating"], "value": item["avg_rating"]} for item in ratings_info],
        })

    rating_counts = df['rating'].value_counts()
    labels = rating_counts.index.tolist()
    values = rating_counts.values.tolist()

    return jsonify({
        "labels": labels,
        "values": values,
        "summary": summary,
        "distribution": ratings_info,
        "avgRatings": [{"rating": item["rating"], "value": item["avg_rating"]} for item in ratings_info],
    })


@app.route("/api/release-trend")
def release_trend():
    if df.empty:
        return jsonify({"labels": [], "values": []})
    
    trend = df['release_year'].value_counts().sort_index()
    return jsonify({
        "labels": trend.index.tolist(),
        "values": trend.values.tolist()
    })


@app.route("/api/countries")
def countries():
    if df.empty:
        return jsonify({"labels": [], "values": []})
    
    country_counts = df['country'].value_counts().head(10)
    return jsonify({
        "labels": country_counts.index.tolist(),
        "values": country_counts.values.tolist()
    })


# ==========================================
# DIRECTORS ENDPOINT
# ==========================================

# Precompute director stats from CSV data
directors_list = []
director_genre_counts = {}
director_country_counts = {}
director_productivity = {"1 Title": 0, "2 - 3 Titles": 0, "4 - 6 Titles": 0, "7 - 10 Titles": 0, "10+ Titles": 0}

if not df.empty:
    from collections import Counter
    _d_counts = Counter()
    _d_rows = {}

    for _, row in df.iterrows():
        dir_str = str(row.get('director', 'Unknown'))
        if dir_str == 'Unknown':
            continue
        for d in dir_str.split(','):
            d_name = d.strip()
            if not d_name:
                continue
            _d_counts[d_name] += 1
            if d_name not in _d_rows:
                _d_rows[d_name] = []
            _d_rows[d_name].append(row)

    for d_name, count in _d_counts.most_common():
        rows = _d_rows[d_name]
        # Country: most common country
        countries_list_raw = []
        for r in rows:
            c_str = str(r['country'])
            if c_str and c_str != 'Unknown':
                for c in c_str.split(','):
                    countries_list_raw.append(c.strip())
        if countries_list_raw:
            country_counter = Counter(countries_list_raw)
            primary_country = country_counter.most_common(1)[0][0]
        else:
            primary_country = "Unknown"

        # Primary genre
        genres_list_raw = []
        for r in rows:
            g_str = str(r['listed_in'])
            if g_str and g_str != 'Unknown':
                for g in g_str.split(','):
                    genres_list_raw.append(g.strip())
        if genres_list_raw:
            genre_counter = Counter(genres_list_raw)
            primary_genre = genre_counter.most_common(1)[0][0]
        else:
            primary_genre = "Unknown"

        # Top title (by most recent release year)
        sorted_rows = sorted(rows, key=lambda r: int(r.get('release_year', 0)), reverse=True)
        top_title = str(sorted_rows[0]['title'])

        # Avg rating score (deterministic hash-based)
        score = get_stable_score(d_name)

        directors_list.append({
            "name": d_name,
            "titles": count,
            "country": primary_country,
            "genre": primary_genre,
            "topTitle": top_title,
            "score": score,
        })

        # Genre counts for sidebar
        director_genre_counts[primary_genre] = director_genre_counts.get(primary_genre, 0) + 1
        # Country counts for sidebar
        director_country_counts[primary_country] = director_country_counts.get(primary_country, 0) + 1

        # Productivity buckets
        if count == 1:
            director_productivity["1 Title"] += 1
        elif count <= 3:
            director_productivity["2 - 3 Titles"] += 1
        elif count <= 6:
            director_productivity["4 - 6 Titles"] += 1
        elif count <= 10:
            director_productivity["7 - 10 Titles"] += 1
        else:
            director_productivity["10+ Titles"] += 1


@app.route("/api/directors")
def directors_endpoint():
    """Paginated directors endpoint with search, sort, country, genre filters."""
    if not directors_list:
        return jsonify({
            "data": [], "total": 0, "page": 1, "per_page": 10, "total_pages": 0,
            "total_directors": 0, "total_titles": 0, "avg_productivity": 0, "total_countries": 0,
            "genre_distribution": [], "country_distribution": [], "productivity_distribution": []
        })

    result = list(directors_list)

    # Search filter
    search = request.args.get('search', '').strip().lower()
    if search:
        result = [
            d for d in result
            if search in d['name'].lower() or search in d['country'].lower() or search in d['genre'].lower()
        ]

    # Country filter
    country_f = request.args.get('country', '').strip()
    if country_f and country_f != 'All':
        result = [d for d in result if d['country'] == country_f]

    # Genre filter
    genre_f = request.args.get('genre', '').strip()
    if genre_f and genre_f != 'All':
        result = [d for d in result if d['genre'] == genre_f]

    # Sort
    sort_by = request.args.get('sort', 'Productivity').strip()
    if sort_by == 'Productivity':
        result.sort(key=lambda d: (-d['titles'], d['name'].lower()))
    elif sort_by == 'Name':
        result.sort(key=lambda d: d['name'].lower())
    elif sort_by == 'Rating':
        result.sort(key=lambda d: (-d['score'], d['name'].lower()))
    elif sort_by == 'Country':
        result.sort(key=lambda d: (d['country'].lower(), -d['titles']))
    else:
        result.sort(key=lambda d: (-d['titles'], d['name'].lower()))

    total = len(result)

    # Compute stats from full (unfiltered) list
    total_directors = len(directors_list)
    total_titles_all = sum(d['titles'] for d in directors_list)
    avg_prod = round(total_titles_all / total_directors, 2) if total_directors else 0
    unique_countries = len(set(d['country'] for d in directors_list if d['country'] != 'Unknown'))

    # Genre distribution (top genres by director count)
    genre_dist = sorted(director_genre_counts.items(), key=lambda x: -x[1])[:8]
    genre_distribution = [{"genre": g, "count": c} for g, c in genre_dist]

    # Country distribution (top countries by director count)
    country_dist = sorted(director_country_counts.items(), key=lambda x: -x[1])[:6]
    country_distribution = [{"country": c, "count": cnt} for c, cnt in country_dist]

    # Productivity distribution for donut chart
    productivity_distribution = [
        {"label": label, "value": val}
        for label, val in director_productivity.items()
    ]
    total_for_pct = sum(v["value"] for v in productivity_distribution)
    for item in productivity_distribution:
        item["percentage"] = round(item["value"] / total_for_pct * 100, 1) if total_for_pct else 0

    # Unique genres and countries for filter dropdowns
    all_genres = sorted(set(d['genre'] for d in directors_list if d['genre'] != 'Unknown'))
    all_countries = sorted(set(d['country'] for d in directors_list if d['country'] != 'Unknown'))

    # Pagination
    page = max(1, int(request.args.get('page', 1)))
    per_page = min(50, max(1, int(request.args.get('per_page', 10))))
    total_pages = math.ceil(total / per_page) if total > 0 else 0

    start = (page - 1) * per_page
    end = start + per_page
    page_data = result[start:end]

    return jsonify({
        "data": page_data,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "total_directors": total_directors,
        "total_titles": total_titles_all,
        "avg_productivity": avg_prod,
        "total_countries": unique_countries,
        "genre_distribution": genre_distribution,
        "country_distribution": country_distribution,
        "productivity_distribution": productivity_distribution,
        "all_genres": all_genres,
        "all_countries": all_countries,
    })

# ==========================================
# TV SHOWS ENDPOINT
# ==========================================

FEATURED_TVSHOWS = [
    {
        "id": "s3686",
        "title": "Stranger Things",
        "director": "Unknown",
        "cast": "Winona Ryder, David Harbour, Millie Bobby Brown, Finn Wolfhard, Gaten Matarazzo, Caleb McLaughlin, Noah Schnapp, Sadie Sink, Natalia Dyer, Charlie Heaton, Joe Keery, Maya Hawke, Priah Ferguson, Cara Buono, Brett Gelman, Jamie Campbell Bower",
        "country": "United States",
        "date_added": "Unknown",
        "year": 2016,
        "rating": "TV-14",
        "duration": "4 Seasons",
        "seasons": 4,
        "genre": "TV Horror, TV Mysteries, TV Sci-Fi & Fantasy",
        "description": "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
        "score": 4.8
    },
    {
        "id": "s5941",
        "title": "Breaking Bad",
        "director": "Unknown",
        "cast": "Bryan Cranston, Aaron Paul, Anna Gunn, Dean Norris, Betsy Brandt, RJ Mitte, Bob Odenkirk, Jonathan Banks, Giancarlo Esposito",
        "country": "United States",
        "date_added": "Unknown",
        "year": 2008,
        "rating": "TV-MA",
        "duration": "5 Seasons",
        "seasons": 5,
        "genre": "Crime TV Shows, TV Dramas, TV Thrillers",
        "description": "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
        "score": 5.0
    },
    {
        "id": "s3118",
        "title": "The Witcher",
        "director": "Unknown",
        "cast": "Henry Cavill, Anya Chalotra, Freya Allan, Joey Batey, Eamon Farren, MyAnna Buring, Mimî M. Khayisa, Anna Shaffer, Royce Pierreson, Wilson Mbomio, Mahesh Jadu",
        "country": "Poland, United States",
        "date_added": "Unknown",
        "year": 2019,
        "rating": "TV-MA",
        "duration": "3 Seasons",
        "seasons": 3,
        "genre": "International TV Shows, TV Action & Adventure, TV Sci-Fi & Fantasy",
        "description": "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
        "score": 4.6
    },
    {
        "id": "s1699",
        "title": "The Crown",
        "director": "Unknown",
        "cast": "Olivia Colman, Helena Bonham Carter, Tobias Menzies, Claire Foy, Matt Smith, Vanessa Kirby, John Lithgow, Imelda Staunton, Jonathan Pryce, Lesley Manville, Dominic West, Elizabeth Devicki",
        "country": "United Kingdom",
        "date_added": "Unknown",
        "year": 2016,
        "rating": "TV-MA",
        "duration": "6 Seasons",
        "seasons": 6,
        "genre": "British TV Shows, International TV Shows, TV Dramas",
        "description": "Based on historical events, this dramatization tells the story of Queen Elizabeth II and the political and personal events that shaped her reign.",
        "score": 4.7
    },
    {
        "id": "s109",
        "title": "Money Heist",
        "director": "Unknown",
        "cast": "Úrsula Corberó, Álvaro Morte, Itziar Ituño, Pedro Alonso, Paco Tous, Alba Flores, Miguel Herrán, Jaime Lorente, Esther Acebo, Enrique Arce, María Pedraza, Darko Perić, Kiti Mánver",
        "country": "Spain",
        "date_added": "Unknown",
        "year": 2017,
        "rating": "TV-MA",
        "duration": "5 Seasons",
        "seasons": 5,
        "genre": "Crime TV Shows, International TV Shows, TV Dramas",
        "description": "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
        "score": 4.4
    },
    {
        "id": "s2328",
        "title": "Dark",
        "director": "Unknown",
        "cast": "Louis Hofmann, Oliver Masucci, Jördis Triebel, Maja Schöne, Karoline Eichhorn, Sebastian Rudolph, Anatole Taubman, Mark Waschke, Stephan Kampwirth, Anne Ratte-Polle, Andreas Pietschmann, Lisa Vicari, Angela Winkler, Michael Mendl",
        "country": "Germany",
        "date_added": "Unknown",
        "year": 2017,
        "rating": "TV-MA",
        "duration": "3 Seasons",
        "seasons": 3,
        "genre": "International TV Shows, TV Dramas, TV Mysteries",
        "description": "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
        "score": 4.6
    }
]

def map_show_genres(genre_list_str):
    genres = [g.strip().lower() for g in genre_list_str.split(',')]
    if any(x in g for g in genres for x in ['sci-fi', 'fantasy', 'horror', 'mystery', 'anime']):
        return 'Sci-Fi & Fantasy'
    if any(x in g for g in genres for x in ['crime', 'action', 'thriller', 'adventure']):
        return 'Crime'
    if any(x in g for g in genres for x in ['drama', 'romantic']):
        return 'Drama'
    if any(x in g for g in genres for x in ['comed', 'stand-up', 'talk']):
        return 'Comedy'
    if any(x in g for g in genres for x in ['docu', 'science', 'nature']):
        return 'Documentary'
    return 'Others'

def parse_seasons(dur_str):
    dur_num = ''.join(filter(str.isdigit, str(dur_str)))
    return int(dur_num) if dur_num else 1

all_tvshows_list = []
tvshows_genre_distribution = {"Drama": 0, "Crime": 0, "Sci-Fi & Fantasy": 0, "Comedy": 0, "Documentary": 0, "Others": 0}
tvshows_season_counts = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10+": 0}
tvshows_genre_scores = {"Drama": [], "Crime": [], "Sci-Fi & Fantasy": [], "Comedy": [], "Documentary": [], "Others": []}

if not tvshows_df.empty:
    featured_ids = {t["id"] for t in FEATURED_TVSHOWS}
    featured_by_title = {t["title"].lower(): t for t in FEATURED_TVSHOWS}
    
    # 1. Add featured shows first
    for t in FEATURED_TVSHOWS:
        all_tvshows_list.append(t.copy())
        
        mapped_g = map_show_genres(t["genre"])
        tvshows_genre_distribution[mapped_g] += 1
        
        s_val = t["seasons"]
        s_key = str(s_val) if s_val < 10 else "10+"
        tvshows_season_counts[s_key] = tvshows_season_counts.get(s_key, 0) + 1
        
        tvshows_genre_scores[mapped_g].append(t["score"])
        
    # 2. Add remaining shows from dataset
    for _, row in tvshows_df.iterrows():
        show_id = row['show_id']
        title = row['title']
        
        # Check if mapped to "Money Heist" or similar featured item
        if title.lower() == "la casa de papel":
            continue
            
        if show_id in featured_ids or title.lower() in featured_by_title:
            continue
            
        dur_str = str(row['duration'])
        seasons = parse_seasons(dur_str)
        
        score = get_stable_score(title)
        mapped_g = map_show_genres(row['listed_in'])
        
        show_obj = {
            "id": show_id,
            "title": title,
            "director": row['director'],
            "cast": row['cast'] if row['cast'] != 'Unknown' else '',
            "country": row['country'],
            "date_added": row['date_added'],
            "year": int(row['release_year']),
            "rating": row['rating'],
            "duration": dur_str,
            "seasons": seasons,
            "genre": row['listed_in'],
            "description": row['description'],
            "score": score
        }
        all_tvshows_list.append(show_obj)
        
        tvshows_genre_distribution[mapped_g] += 1
        
        s_key = str(seasons) if seasons < 10 else "10+"
        tvshows_season_counts[s_key] = tvshows_season_counts.get(s_key, 0) + 1
        
        tvshows_genre_scores[mapped_g].append(score)

# Precalculate final stats
tvshows_total_count = len(all_tvshows_list)
tvshows_total_seasons = sum(t["seasons"] for t in all_tvshows_list)
tvshows_avg_rating = round(sum(t["score"] for t in all_tvshows_list) / tvshows_total_count, 1) if tvshows_total_count else 0.0

# Unique countries and genres lists for filters
tvshows_countries_set = set()
for t in all_tvshows_list:
    if t['country'] and t['country'] != 'Unknown':
        for c in t['country'].split(','):
            tvshows_countries_set.add(c.strip())
tvshows_countries_list = sorted(list(tvshows_countries_set))

tvshows_genres_set = set()
for t in all_tvshows_list:
    if t['genre'] and t['genre'] != 'Unknown':
        for g in t['genre'].split(','):
            tvshows_genres_set.add(g.strip())
tvshows_genres_list = sorted(list(tvshows_genres_set))

tvshows_years_list = sorted(list(set(t['year'] for t in all_tvshows_list)), reverse=True)


@app.route("/api/tvshows")
def tvshows():
    """Paginated TV Shows endpoint with search, genre, country, year, rating, and sort."""
    if not all_tvshows_list:
        return jsonify({"data": [], "total": 0, "page": 1, "per_page": 6, "total_pages": 0})
        
    result_list = list(all_tvshows_list)
    
    # Search filter
    search = request.args.get('search', '').strip().lower()
    if search:
        result_list = [
            t for t in result_list
            if search in t['title'].lower() or search in t['director'].lower() or search in t['cast'].lower()
        ]
        
    # Genre filter
    genre = request.args.get('genre', '').strip()
    if genre and genre != 'All':
        result_list = [
            t for t in result_list
            if genre.lower() in t['genre'].lower()
        ]
        
    # Country filter
    country = request.args.get('country', '').strip()
    if country and country != 'All':
        result_list = [
            t for t in result_list
            if country.lower() in t['country'].lower()
        ]
        
    # Year filter
    year = request.args.get('year', '').strip()
    if year and year != 'All':
        try:
            year_val = int(year)
            result_list = [t for t in result_list if t['year'] == year_val]
        except ValueError:
            pass
            
    # Rating filter
    rating = request.args.get('rating', '').strip()
    if rating and rating != 'All':
        result_list = [t for t in result_list if t['rating'] == rating]
        
    # Sort
    sort = request.args.get('sort', 'Popularity').strip()
    
    is_default_view = (
        not search and 
        (not genre or genre == 'All') and 
        (not country or country == 'All') and 
        (not year or year == 'All') and 
        (not rating or rating == 'All') and 
        sort == 'Popularity'
    )
    
    if is_default_view:
        # On default view page 1, featured shows come first
        featured_order = {t['id']: idx for idx, t in enumerate(FEATURED_TVSHOWS)}
        def get_default_sort_key(t):
            if t['id'] in featured_order:
                return (0, featured_order[t['id']])
            else:
                return (1, -t['year'], t['title'].lower())
        result_list.sort(key=get_default_sort_key)
    else:
        # Standard sorting
        if sort == 'Year':
            result_list.sort(key=lambda t: (-t['year'], t['title'].lower()))
        elif sort == 'Title':
            result_list.sort(key=lambda t: t['title'].lower())
        elif sort == 'Rating':
            result_list.sort(key=lambda t: (-t['score'], t['title'].lower()))
        elif sort == 'Seasons':
            result_list.sort(key=lambda t: (-t['seasons'], t['title'].lower()))
        else:
            # Popularity/Default
            result_list.sort(key=lambda t: (-t['year'], t['title'].lower()))
            
    total = len(result_list)
    
    # Pagination
    page = max(1, int(request.args.get('page', 1)))
    per_page = min(50, max(1, int(request.args.get('per_page', 6))))
    total_pages = math.ceil(total / per_page) if total > 0 else 0
    
    start = (page - 1) * per_page
    end = start + per_page
    page_data = result_list[start:end]
    
    return jsonify({
        "data": page_data,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    })


@app.route("/api/tvshows/stats")
def tvshows_stats():
    """Aggregate stats for TV Shows sidebar charts and KPIs."""
    if not all_tvshows_list:
        return jsonify({
            "total_tvshows": 0, "total_seasons": 0, "total_countries": 0, "avg_rating": 0.0,
            "genre_distribution": [], "season_distribution": [], "rating_by_genre": [],
            "all_genres": [], "all_countries": [], "all_years": []
        })
        
    genre_dist_list = []
    for g, count in tvshows_genre_distribution.items():
        pct = round((count / tvshows_total_count) * 100, 1) if tvshows_total_count else 0.0
        genre_dist_list.append({
            "genre": g,
            "count": count,
            "percentage": pct
        })
    genre_dist_list.sort(key=lambda x: -x["count"])
    
    season_keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']
    season_dist_list = [
        {"seasons": sk, "count": tvshows_season_counts.get(sk, 0)}
        for sk in season_keys
    ]
    
    rating_by_genre_list = []
    for g, scores in tvshows_genre_scores.items():
        avg_score = round(sum(scores) / len(scores), 1) if scores else 0.0
        rating_by_genre_list.append({
            "genre": g,
            "rating": avg_score
        })
    rating_by_genre_list.sort(key=lambda x: -x["rating"])
    
    return jsonify({
        "total_tvshows": tvshows_total_count,
        "total_seasons": tvshows_total_seasons,
        "total_countries": len(tvshows_countries_list),
        "avg_rating": tvshows_avg_rating,
        "genre_distribution": genre_dist_list,
        "season_distribution": season_dist_list,
        "rating_by_genre": rating_by_genre_list,
        "all_genres": tvshows_genres_list,
        "all_countries": tvshows_countries_list,
        "all_years": tvshows_years_list
    })


import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
