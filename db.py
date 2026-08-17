import sqlite3
import json
import time
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'regrow.db')

def init_db():
    """Initialize the SQLite database for caching and history. Best effort."""
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            
            # Table for NGO lookups cache (valid for 24h)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS ngo_cache (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    lat_rounded REAL,
                    lon_rounded REAL,
                    results_json TEXT,
                    timestamp_sec INTEGER
                )
            ''')
            
            # Table for Analysis History
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS analysis_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp_sec INTEGER,
                    mode TEXT,
                    latitude REAL,
                    longitude REAL,
                    damage_area_m2 REAL,
                    estimated_cost_usd REAL
                )
            ''')
            
            # Index for fast cache lookups
            cursor.execute('CREATE INDEX IF NOT EXISTS idx_ngo_cache ON ngo_cache(lat_rounded, lon_rounded)')
            conn.commit()
    except Exception as e:
        print(f"Database initialization failed (best-effort): {e}")

def get_cached_ngos(lat: float, lon: float):
    """Retrieve NGOs from cache if less than 24 hours old. Rounds lat/long to 1 decimal place (~11km)."""
    try:
        lat_rnd = round(lat, 1)
        lon_rnd = round(lon, 1)
        
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT results_json, timestamp_sec FROM ngo_cache 
                WHERE lat_rounded=? AND lon_rounded=?
                ORDER BY timestamp_sec DESC LIMIT 1
            ''', (lat_rnd, lon_rnd))
            
            row = cursor.fetchone()
            if row:
                results_json, timestamp_sec = row
                # Check if older than 24 hours (86400 seconds)
                if (int(time.time()) - timestamp_sec) < 86400:
                    return json.loads(results_json)
        return None
    except Exception:
        return None

def cache_ngos(lat: float, lon: float, results: list):
    """Save NGOs to cache. Best effort."""
    try:
        lat_rnd = round(lat, 1)
        lon_rnd = round(lon, 1)
        results_json = json.dumps(results)
        timestamp_sec = int(time.time())
        
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO ngo_cache (lat_rounded, lon_rounded, results_json, timestamp_sec)
                VALUES (?, ?, ?, ?)
            ''', (lat_rnd, lon_rnd, results_json, timestamp_sec))
            conn.commit()
    except Exception:
        pass

def log_analysis(mode: str, lat: float, lon: float, damage_area_m2: float, estimated_cost_usd: float):
    """Store the analysis run in history. Best effort."""
    try:
        timestamp_sec = int(time.time())
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO analysis_history (timestamp_sec, mode, latitude, longitude, damage_area_m2, estimated_cost_usd)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (timestamp_sec, mode, lat, lon, damage_area_m2, estimated_cost_usd))
            conn.commit()
    except Exception:
        pass

# Automatically initialize tables
init_db()
