import pandas as pd
from collections import Counter
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
data_file = BASE_DIR / "data" / "processed" / "cleaned_netflix.csv"

df = pd.read_csv(data_file)
df = df.fillna("Unknown")

directors = df[df['director'] != 'Unknown']

d_counts = Counter()
for _, row in directors.iterrows():
    for d in row['director'].split(','):
        d_counts[d.strip()] += 1

print(f"Total unique directors: {len(d_counts)}")
print(f"Total titles with directors: {len(directors)}")
print()

for d, c in d_counts.most_common(15):
    rows = directors[directors['director'].str.contains(d, regex=False, na=False)]
    country = rows['country'].mode()[0] if not rows['country'].mode().empty else 'Unknown'
    genres = rows['listed_in'].str.split(',').explode().str.strip().value_counts()
    top_genre = genres.index[0] if len(genres) > 0 else 'Unknown'
    top_title = rows.sort_values('release_year', ascending=False)['title'].iloc[0]
    print(f"{d} | {c} titles | {country} | {top_genre} | {top_title}")
