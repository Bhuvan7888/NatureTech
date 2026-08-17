import os
import io
import base64
import requests
from PIL import Image
from typing import Dict, Any, Tuple, Optional

# Microsoft Planetary Computer STAC API endpoint
STAC_API_URL = "https://planetarycomputer.microsoft.com/api/stac/v1/search"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

HEADERS = {
    "User-Agent": "ReGrow-Disaster-Recovery-Platform/2.0 (naturetech@regrow.org)"
}

def geocode_location(query: str) -> Optional[Dict[str, Any]]:
    """
    Resolve place name query (e.g. 'Amazon Rainforest', 'California') to latitude/longitude.
    """
    try:
        params = {
            "q": query,
            "format": "json",
            "limit": 1
        }
        res = requests.get(NOMINATIM_URL, params=params, headers=HEADERS, timeout=4)
        if res.status_code == 200 and res.json():
            item = res.json()[0]
            return {
                "display_name": item.get("display_name"),
                "latitude": float(item.get("lat")),
                "longitude": float(item.get("lon"))
            }
    except Exception as e:
        print(f"Geocoding error for '{query}': {e}")
    return None

def image_to_base64(pil_img: Image.Image) -> str:
    """Convert PIL Image to PNG Base64 data URI."""
    buffered = io.BytesIO()
    pil_img.save(buffered, format="PNG")
    img_bytes = buffered.getvalue()
    encoded = base64.b64encode(img_bytes).decode("utf-8")
    return f"data:image/png;base64,{encoded}"

def fetch_stac_sentinel_image(lat: float, lon: float, date_range: str, max_cloud: int = 50) -> Tuple[Optional[str], Optional[str]]:
    """
    Search STAC API for Sentinel-2 cloud-free satellite preview image.
    Returns (base64_data_uri, datetime_string).
    """
    delta = 0.05  # ~5km bounding box
    bbox = [lon - delta, lat - delta, lon + delta, lat + delta]
    
    payloads = [
        # Strategy 1: Filter by cloud cover
        {
            "collections": ["sentinel-2-l2a"],
            "bbox": bbox,
            "datetime": date_range,
            "query": {"eo:cloud_cover": {"lt": max_cloud}},
            "limit": 5
        },
        # Strategy 2: Any cloud cover fallback
        {
            "collections": ["sentinel-2-l2a"],
            "bbox": bbox,
            "datetime": date_range,
            "limit": 5
        }
    ]

    for payload in payloads:
        try:
            res = requests.post(STAC_API_URL, json=payload, headers=HEADERS, timeout=4)
            if res.status_code == 200:
                data = res.json()
                features = data.get("features", [])
                if features:
                    features.sort(key=lambda x: x.get("properties", {}).get("eo:cloud_cover", 100))
                    best_item = features[0]
                    item_id = best_item.get("id")
                    dt_str = best_item.get("properties", {}).get("datetime", "")[:10]

                    # Candidate preview URLs
                    urls_to_try = []
                    if "rendered_preview" in best_item.get("assets", {}):
                        urls_to_try.append(best_item["assets"]["rendered_preview"].get("href"))
                    if "thumbnail" in best_item.get("assets", {}):
                        urls_to_try.append(best_item["assets"]["thumbnail"].get("href"))
                    if item_id:
                        urls_to_try.append(f"https://planetarycomputer.microsoft.com/api/data/v1/item/preview.png?collection=sentinel-2-l2a&item={item_id}&assets=visual&asset_bidx=visual%7C1%2C2%2C3&nodata=0&format=png")

                    for preview_url in urls_to_try:
                        if not preview_url:
                            continue
                        try:
                            img_res = requests.get(preview_url, headers=HEADERS, timeout=5)
                            if img_res.status_code == 200 and len(img_res.content) > 500:
                                pil_img = Image.open(io.BytesIO(img_res.content)).convert("RGB")
                                return image_to_base64(pil_img), dt_str
                        except Exception:
                            continue
        except Exception as e:
            print(f"STAC Search attempt failed for lat={lat}, lon={lon}: {e}")

    return None, None

def fetch_live_sentinel_pair(lat: float, lon: float) -> Dict[str, Any]:
    """
    Automatically search & fetch before (historic) and after (recent) Sentinel-2 satellite tiles.
    """
    # 1. Fetch recent satellite image (past 1-2 years)
    after_b64, after_date = fetch_stac_sentinel_image(lat, lon, "2024-01-01/2026-08-17", max_cloud=40)
    if not after_b64:
        after_b64, after_date = fetch_stac_sentinel_image(lat, lon, "2023-01-01/2026-08-17", max_cloud=80)
    
    # 2. Fetch baseline historic satellite image (prior period)
    before_b64, before_date = fetch_stac_sentinel_image(lat, lon, "2020-01-01/2023-12-31", max_cloud=30)
    if not before_b64:
        before_b64, before_date = fetch_stac_sentinel_image(lat, lon, "2018-01-01/2023-12-31", max_cloud=60)

    # Fallback to sample images if STAC API is constrained or location is out of bounds
    base_dir = os.path.dirname(os.path.realpath(__file__))
    sample_before_path = os.path.join(base_dir, "sample_before.jpg")
    sample_after_path = os.path.join(base_dir, "sample_after.jpg")

    if not before_b64 and os.path.exists(sample_before_path):
        with open(sample_before_path, "rb") as f:
            before_b64 = f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode('utf-8')}"
        before_date = "Baseline Archive (Sample)"

    if not after_b64 and os.path.exists(sample_after_path):
        with open(sample_after_path, "rb") as f:
            after_b64 = f"data:image/jpeg;base64,{base64.b64encode(f.read()).decode('utf-8')}"
        after_date = "Recent Imagery (Sample)"

    return {
        "success": True,
        "latitude": lat,
        "longitude": lon,
        "before_image": before_b64,
        "after_image": after_b64,
        "before_date": before_date or "Baseline",
        "after_date": after_date or "Recent"
    }

def fetch_live_climate(lat: float, lon: float) -> Dict[str, Any]:
    """
    Fetch real-time weather & wildfire propagation risk telemetry from Open-Meteo.
    """
    try:
        params = {
            "latitude": lat,
            "longitude": lon,
            "current_weather": "true"
        }
        res = requests.get(OPEN_METEO_URL, params=params, headers=HEADERS, timeout=4)
        if res.status_code == 200:
            cw = res.json().get("current_weather", {})
            temp_c = cw.get("temperature", 25.0)
            wind_speed = cw.get("windspeed", 10.0)
            wind_dir = cw.get("winddirection", 180)
            
            risk_score = "Moderate"
            if temp_c > 30.0 and wind_speed > 25.0:
                risk_score = "Critical High"
            elif temp_c > 25.0 or wind_speed > 15.0:
                risk_score = "Elevated"
            else:
                risk_score = "Low"

            return {
                "latitude": lat,
                "longitude": lon,
                "temperature_c": temp_c,
                "wind_speed_kmh": wind_speed,
                "wind_direction_deg": wind_dir,
                "fire_spread_risk": risk_score,
                "source": "Open-Meteo Weather Service"
            }
    except Exception as e:
        print(f"Climate fetch error: {e}")

    return {
        "latitude": lat,
        "longitude": lon,
        "temperature_c": 24.5,
        "wind_speed_kmh": 12.0,
        "wind_direction_deg": 210,
        "fire_spread_risk": "Moderate",
        "source": "Fallback Environmental Telemetry"
    }
