import sys
sys.path.insert(0, 'backend')
from app import app
import json

client = app.test_client()

# Test list endpoint
resp = client.get('/api/tvshows?page=1&per_page=6')
data = json.loads(resp.data)

print("=== TV Shows List Endpoint ===")
print("Total TV shows found:", data.get("total"))
print("Total pages:", data.get("total_pages"))
print("First page items count:", len(data.get("data", [])))
if data.get("data"):
    print("Featured items order:")
    for idx, item in enumerate(data.get("data")):
        print(f"  {idx + 1}. {item['title']} - {item['duration']} - Rating: {item['score']}")

# Test stats endpoint
resp_stats = client.get('/api/tvshows/stats')
data_stats = json.loads(resp_stats.data)

print("\n=== TV Shows Stats Endpoint ===")
print("Total TV shows stats:", data_stats.get("total_tvshows"))
print("Total seasons:", data_stats.get("total_seasons"))
print("Avg rating:", data_stats.get("avg_rating"))
print("Genre distribution:")
for g in data_stats.get("genre_distribution", [])[:6]:
    print(f"  {g['genre']}: {g['count']} ({g['percentage']}%)")
print("Season distribution:")
for s in data_stats.get("season_distribution", []):
    print(f"  {s['seasons']} Seasons: {s['count']}")
print("Rating by genre:")
for r in data_stats.get("rating_by_genre", []):
    print(f"  {r['genre']}: {r['rating']}")
