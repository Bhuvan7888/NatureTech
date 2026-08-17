import os
import io
import json
import base64
import tempfile
import numpy as np
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional

from reforestation_economics import calculate_reforestation_economics
from ngo_matcher import find_nearby_ngos
import db
import live_satellite

# Import existing CV logic from deforestation_ui safely
import deforestation_ui

app = FastAPI(
    title="Re-Grow Active Recovery API",
    description="Backend REST API for Satellite Deforestation & Forest Fire Detection and Active Recovery Planning",
    version="2.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def image_to_base64(pil_image: Image.Image) -> str:
    """Convert PIL Image to base64 data URI string."""
    buffered = io.BytesIO()
    pil_image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{img_str}"

def file_to_base64(file_path: str) -> str:
    """Read image file and convert to base64 data URI."""
    with open(file_path, "rb") as f:
        img_bytes = f.read()
    ext = os.path.splitext(file_path)[1].lower().replace(".", "")
    if ext in ["jpg", "jpeg"]:
        mime = "image/jpeg"
    elif ext == "png":
        mime = "image/png"
    else:
        mime = "image/png"
    encoded = base64.b64encode(img_bytes).decode("utf-8")
    return f"data:{mime};base64,{encoded}"

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Re-Grow Active Recovery API", "version": "2.0.0"}

@app.get("/api/samples")
def get_sample_images():
    """Return pre-packaged sample before and after images as base64 strings."""
    base_dir = os.path.dirname(os.path.realpath(__file__))
    before_path = os.path.join(base_dir, "sample_before.jpg")
    after_path = os.path.join(base_dir, "sample_after.jpg")
    
    if not os.path.exists(before_path) or not os.path.exists(after_path):
        raise HTTPException(status_code=404, detail="Sample images not found")
        
    return {
        "before_image": file_to_base64(before_path),
        "after_image": file_to_base64(after_path),
        "default_lat": 18.5204,
        "default_lon": 73.8567
    }

@app.get("/api/live/geocode")
def geocode_place(query: str):
    """Resolve location place name to lat/lon coordinates."""
    res = live_satellite.geocode_location(query)
    if not res:
        raise HTTPException(status_code=404, detail=f"Location '{query}' not found.")
    return res

@app.get("/api/live/climate")
def get_live_climate(lat: float, lon: float):
    """Retrieve live weather and wildfire propagation telemetry from Open-Meteo."""
    return live_satellite.fetch_live_climate(lat, lon)

@app.post("/api/live/fetch-satellite")
def fetch_live_satellite_tiles(latitude: float = Form(...), longitude: float = Form(...)):
    """Fetch cloud-free Sentinel-2 before & after satellite tiles from STAC API."""
    return live_satellite.fetch_live_sentinel_pair(latitude, longitude)

@app.get("/api/ngos")
def get_ngos(lat: float, lon: float, radius_km: Optional[float] = 50.0):
    """Retrieve nearby NGOs using OpenStreetMap Overpass API with local fallback."""
    ngos = find_nearby_ngos(lat, lon, radius_km)
    return {"latitude": lat, "longitude": lon, "radius_km": radius_km, "ngos": ngos}

@app.get("/api/history")
def get_analysis_history():
    """Retrieve recorded analysis history from SQLite database."""
    try:
        with db.sqlite3.connect(db.DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, timestamp_sec, mode, latitude, longitude, damage_area_m2, estimated_cost_usd
                FROM analysis_history
                ORDER BY timestamp_sec DESC
                LIMIT 50
            ''')
            rows = cursor.fetchall()
            history = [
                {
                    "id": r[0],
                    "timestamp": r[1],
                    "mode": r[2],
                    "latitude": r[3],
                    "longitude": r[4],
                    "damage_area_m2": r[5],
                    "estimated_cost_usd": r[6]
                }
                for r in rows
            ]
            return {"history": history}
    except Exception as e:
        return {"history": [], "error": str(e)}

@app.post("/api/analyze")
async def analyze_satellite_images(
    before_image: UploadFile = File(...),
    after_image: UploadFile = File(...),
    mode: str = Form("deforestation"), # "deforestation" or "fire"
    pixel_resolution: float = Form(1.0),
    min_area: int = Form(100),
    latitude: float = Form(0.0),
    longitude: float = Form(0.0)
):
    """
    Main Satellite Analysis Endpoint.
    Processes uploaded before/after satellite images using computer vision,
    calculates damage metrics, trees required & USD cost, queries nearby NGOs,
    logs results to SQLite DB, and returns visual overlay & data.
    """
    try:
        # Save before image to temp file
        before_bytes = await before_image.read()
        before_ext = os.path.splitext(before_image.filename)[1].lower() or ".jpg"
        with tempfile.NamedTemporaryFile(delete=False, suffix=before_ext) as tmp_before:
            tmp_before.write(before_bytes)
            tmp_before_path = tmp_before.name

        # Save after image to temp file
        after_bytes = await after_image.read()
        after_ext = os.path.splitext(after_image.filename)[1].lower() or ".jpg"
        with tempfile.NamedTemporaryFile(delete=False, suffix=after_ext) as tmp_after:
            tmp_after.write(after_bytes)
            tmp_after_path = tmp_after.name

        # Convert to GeoTIFF / get image path and shape using existing helper
        before_path, before_shape = deforestation_ui.save_uploaded_file(
            type("UploadedFileMock", (), {"name": before_image.filename, "getvalue": lambda *a: before_bytes})()
        )
        after_path, after_shape = deforestation_ui.save_uploaded_file(
            type("UploadedFileMock", (), {"name": after_image.filename, "getvalue": lambda *a: after_bytes})()
        )

        damaged_area_m2 = 0.0
        region_count = 0
        damage_percentage = 0.0
        region_details = []
        visualization_b64 = ""

        total_analyzed_area = float(before_shape[0] * before_shape[1] * (pixel_resolution ** 2))

        if mode.lower() in ["deforestation", "deforestation analysis"]:
            actual_mode = "Deforestation Analysis"
            deforested_area, num_regions, deforested_mask, region_info = deforestation_ui.identify_barren_areas(
                before_path,
                after_path,
                before_shape,
                pixel_resolution,
                min_area
            )
            damaged_area_m2 = float(deforested_area)
            region_count = int(num_regions)
            damage_percentage = (damaged_area_m2 / max(total_analyzed_area, 1.0)) * 100.0

            # Generate visual overlay
            viz_img = deforestation_ui.create_deforestation_visualization(after_path, deforested_mask)
            visualization_b64 = image_to_base64(viz_img)

            # Format region breakdown table
            for r in region_info:
                region_details.append({
                    "id": r["id"],
                    "area_m2": round(r["area"], 2),
                    "area_ha": round(r["area"] / 10000.0, 4),
                    "percentage": round(r["area_percentage"], 2),
                    "centroid": [float(r["centroid"][0]), float(r["centroid"][1])],
                    "bbox": [int(x) for x in r["bbox"]]
                })

        else:
            actual_mode = "Forest Fire Detection"
            before_pil = Image.open(before_path)
            after_pil = Image.open(after_path)
            before_np = np.array(before_pil)
            after_np = np.array(after_pil)

            burn_area, num_burn_regions, burn_visualization = deforestation_ui.detect_forest_fires(before_np, after_np)
            damaged_area_m2 = float(burn_area * (pixel_resolution ** 2))
            region_count = int(num_burn_regions)
            damage_percentage = min((damaged_area_m2 / max(total_analyzed_area, 1.0)) * 100.0, 100.0)

            visualization_b64 = image_to_base64(burn_visualization)

        # Reforestation Economics
        trees_required, total_cost_usd, summary_str = calculate_reforestation_economics(damaged_area_m2)

        # Log analysis to SQLite database
        db.log_analysis(actual_mode, latitude, longitude, damaged_area_m2, total_cost_usd)

        # Match nearby NGOs
        ngos = find_nearby_ngos(latitude, longitude)

        # Cleanup temporary files safely
        for path in [tmp_before_path, tmp_after_path, before_path, after_path]:
            if os.path.exists(path):
                try:
                    os.unlink(path)
                except Exception:
                    pass

        return {
            "success": True,
            "mode": actual_mode,
            "metrics": {
                "damaged_area_m2": round(damaged_area_m2, 2),
                "damaged_area_ha": round(damaged_area_m2 / 10000.0, 4),
                "total_analyzed_area_m2": round(total_analyzed_area, 2),
                "damage_percentage": round(damage_percentage, 2),
                "region_count": region_count,
            },
            "economics": {
                "trees_required": int(trees_required),
                "total_cost_usd": round(total_cost_usd, 2),
                "summary": summary_str
            },
            "visualization": visualization_b64,
            "region_details": region_details,
            "ngos": ngos,
            "coordinates": {
                "latitude": latitude,
                "longitude": longitude
            }
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
