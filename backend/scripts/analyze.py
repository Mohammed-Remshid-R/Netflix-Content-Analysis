import pandas as pd
from pathlib import Path

csv_path = Path(__file__).resolve().parent.parent / "data" / "processed" / "cleaned_netflix.csv"
df = pd.read_csv(csv_path)

print("=== COLUMNS ===")
print(list(df.columns))
print(f"\n=== TOTAL ROWS: {len(df)} ===")

movies = df[df['type'] == 'Movie']
tvshows = df[df['type'] == 'TV Show']
print(f"Total Movies: {len(movies)}")
print(f"Total TV Shows: {len(tvshows)}")

print(f"\nUnique countries: {df['country'].nunique()}")
print(f"Unique directors: {df['director'].nunique()}")

print("\n=== TOP 10 RATINGS ===")
print(df['rating'].value_counts().head(10))

print("\n=== SAMPLE MOVIES (first 10) ===")
sample = movies.head(10)[['show_id','title','director','country','release_year','rating','duration','listed_in']]
for _, row in sample.iterrows():
    print(f"  {row['title']} | {row['director']} | {row['country']} | {row['release_year']} | {row['rating']} | {row['duration']} | {row['listed_in']}")

print(f"\n=== DURATION STATS (Movies) ===")
durations = movies['duration'].str.extract(r'(\d+)').astype(float)
print(f"Avg duration: {durations[0].mean():.0f} min")
print(f"Total runtime: {durations[0].sum():.0f} min")

print(f"\n=== GENRES (listed_in) top 10 ===")
# listed_in contains comma-separated genres
all_genres = df['listed_in'].str.split(', ').explode()
print(all_genres.value_counts().head(15))

print(f"\n=== YEAR RANGE ===")
print(f"Min year: {df['release_year'].min()}, Max year: {df['release_year'].max()}")
