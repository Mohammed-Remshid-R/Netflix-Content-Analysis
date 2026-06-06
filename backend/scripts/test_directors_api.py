import sys
sys.path.insert(0, 'backend')
from app import app
import json

client = app.test_client()
resp = client.get('/api/directors?page=1&per_page=5')
data = json.loads(resp.data)

print("=== Directors API Response ===")
print(f"Total Directors: {data['total_directors']}")
print(f"Total Titles: {data['total_titles']}")
print(f"Avg Productivity: {data['avg_productivity']}")
print(f"Total Countries: {data['total_countries']}")
print(f"Total Pages: {data['total_pages']}")
print(f"\nTop 5 Directors:")
for d in data['data']:
    print(f"  {d['name']} | {d['titles']} titles | {d['country']} | {d['genre']} | {d['topTitle']} | {d['score']}")

print(f"\nGenre Distribution:")
for g in data['genre_distribution']:
    print(f"  {g['genre']}: {g['count']}")

print(f"\nCountry Distribution:")
for c in data['country_distribution']:
    print(f"  {c['country']}: {c['count']}")

print(f"\nProductivity Distribution:")
for p in data['productivity_distribution']:
    print(f"  {p['label']}: {p['value']} ({p['percentage']}%)")
