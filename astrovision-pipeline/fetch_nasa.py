import requests
import psycopg2
import os
from dotenv import load_dotenv

# load env
load_dotenv()

# DB CONFIG dari env
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

cursor = conn.cursor()

# NASA API
API_KEY = "DEMO_KEY"
url = f"https://api.nasa.gov/neo/rest/v1/feed?api_key={API_KEY}"

response = requests.get(url)
data = response.json()

for date in data["near_earth_objects"]:
    for obj in data["near_earth_objects"][date]:
        cursor.execute("""
            INSERT INTO asteroids (id, name, magnitude, is_hazardous, approach_date)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING;
        """, (
            obj["id"],
            obj["name"],
            obj["absolute_magnitude_h"],
            obj["is_potentially_hazardous_asteroid"],
            date
        ))

conn.commit()
cursor.close()
conn.close()

print("🚀 NASA data inserted successfully")