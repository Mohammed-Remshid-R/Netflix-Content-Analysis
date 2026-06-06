import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

input_file = BASE_DIR / "data" / "raw" / "netflix_titles.csv"
output_file = BASE_DIR / "data" / "processed" / "cleaned_netflix.csv"

# Ensure output directory exists
output_file.parent.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(input_file)

df['country'] = df['country'].fillna("Unknown")
df['rating'] = df['rating'].fillna("Not Rated")
df['director'] = df['director'].fillna("Unknown")

df.drop_duplicates(inplace=True)

df['date_added'] = df['date_added'].astype(str).str.strip()

# Safely parse date
df['date_added'] = pd.to_datetime(
    df['date_added'],
    errors='coerce'
)

df.to_csv(output_file, index=False)

print("Data cleaned successfully!")
