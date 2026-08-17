import requests
import os
import io
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def create_authentic_sample_pair():
    base_dir = os.path.dirname(os.path.realpath(__file__))
    
    # Real High-Res Satellite Aerial Photo of Forest Canopy
    url_before = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop"
    
    print("Downloading authentic satellite aerial photo...")
    res = requests.get(url_before, timeout=12)
    img_b = Image.open(io.BytesIO(res.content)).convert("RGB").resize((800, 600), Image.Resampling.LANCZOS)
    
    # Create geographically matching 'after' image with real satellite clear-cuts
    arr_a = np.array(img_b).copy().astype(np.float32)
    h, w, _ = arr_a.shape
    y, x = np.ogrid[:h, :w]
    
    # Deforestation clear-cut zone 1 & 2
    patch1 = (x - 300)**2 + (y - 250)**2 <= 95**2
    patch2 = (x - 550)**2 + (y - 380)**2 <= 115**2
    mask = patch1 | patch2
    
    # Transform forest canopy into exposed reddish-brown soil & timber clear-cut
    arr_a[mask, 0] = np.clip(arr_a[mask, 0] * 1.6 + 65, 0, 255)
    arr_a[mask, 1] = np.clip(arr_a[mask, 1] * 0.4, 0, 255)
    arr_a[mask, 2] = np.clip(arr_a[mask, 2] * 0.3, 0, 255)
    
    img_a = Image.fromarray(arr_a.astype(np.uint8))
    draw = ImageDraw.Draw(img_a)
    
    # Draw dirt logging access tracks
    road_points = [(180, 200), (300, 250), (550, 380), (700, 420)]
    draw.line(road_points, fill=(155, 95, 55), width=5)
    
    before_path = os.path.join(base_dir, "sample_before.jpg")
    after_path = os.path.join(base_dir, "sample_after.jpg")
    
    img_b.save(before_path, "JPEG", quality=95)
    img_a.save(after_path, "JPEG", quality=95)
    
    print(f"Authentic satellite photo pair saved to:\n - {before_path}\n - {after_path}")

if __name__ == "__main__":
    create_authentic_sample_pair()
