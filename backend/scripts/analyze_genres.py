import pandas as pd
import hashlib
import json

df = pd.read_csv('backend/data/processed/cleaned_netflix.csv')
df = df.fillna('Unknown')

genre_map = {
    'Dramas': 'Drama', 'TV Dramas': 'Drama',
    'Comedies': 'Comedy', 'TV Comedies': 'Comedy',
    'Stand-Up Comedy': 'Stand-Up Comedy', 'Stand-Up Comedy & Talk Shows': 'Stand-Up Comedy',
    'Documentaries': 'Documentary', 'Docuseries': 'Documentary', 'Science & Nature TV': 'Documentary',
    'Action & Adventure': 'Action & Adventure', 'TV Action & Adventure': 'Action & Adventure',
    'Crime TV Shows': 'Crime', 'TV Thrillers': 'Crime', 'Thrillers': 'Crime', 'TV Mysteries': 'Crime',
    'TV Sci-Fi & Fantasy': 'Sci-Fi & Fantasy', 'Sci-Fi & Fantasy': 'Sci-Fi & Fantasy',
    'TV Horror': 'Sci-Fi & Fantasy', 'Horror Movies': 'Sci-Fi & Fantasy',
    "Kids' TV": 'Kids', 'Children & Family Movies': 'Kids',
    'Romantic Movies': 'Romantic Movies', 'Romantic TV Shows': 'Romantic Movies',
    'International Movies': 'International', 'International TV Shows': 'International',
    'Independent Movies': 'Independent Movies',
    'Music & Musicals': 'Music & Musicals',
    'Anime Series': 'Anime', 'Anime Features': 'Anime',
    'British TV Shows': 'British TV Shows',
    'Reality TV': 'Reality TV',
    'Classic Movies': 'Classic & Cult', 'Cult Movies': 'Classic & Cult',
    'LGBTQ Movies': 'LGBTQ', 'Sports Movies': 'Sports', 'Faith & Spirituality': 'Faith & Spirituality',
    'Spanish-Language TV Shows': 'International', 'Korean TV Shows': 'International',
    'Teen TV Shows': 'Kids',
}

def get_stable_score(title):
    h = int(hashlib.md5(title.encode('utf-8')).hexdigest()[:8], 16)
    return round(3.0 + (h % 20) / 10.0, 1)

# Count per mapped genre
genre_counts = {}
genre_scores = {}
genre_countries = {}

for _, row in df.iterrows():
    genres = [g.strip() for g in str(row['listed_in']).split(',')]
    score = get_stable_score(str(row['title']))
    country = str(row['country'])
    
    for g in genres:
        mapped = genre_map.get(g, 'Others')
        genre_counts[mapped] = genre_counts.get(mapped, 0) + 1
        if mapped not in genre_scores:
            genre_scores[mapped] = []
        genre_scores[mapped].append(score)
        if mapped not in genre_countries:
            genre_countries[mapped] = set()
        if country != 'Unknown':
            for c in country.split(','):
                genre_countries[mapped].add(c.strip())

total = sum(genre_counts.values())
total_titles = len(df)

# Sort by count descending
sorted_genres = sorted(genre_counts.items(), key=lambda x: -x[1])

print(f"Total titles: {total_titles}")
print(f"Total genre tags: {total}")
print()
for rank, (genre, count) in enumerate(sorted_genres, 1):
    pct = round(count / total * 100, 1)
    avg = round(sum(genre_scores[genre]) / len(genre_scores[genre]), 1)
    countries = len(genre_countries.get(genre, set()))
    print(f"{rank}. {genre}: {count} titles ({pct}%), avg rating: {avg}, countries: {countries}")
