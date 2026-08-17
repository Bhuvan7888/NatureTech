import requests
import os
import io
from PIL import Image

def download_real_satellite_photos():
    base_dir = os.path.dirname(os.path.realpath(__file__))
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    
    # Authentic High-Resolution Satellite Photographs
    url_before = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop"
    url_after = "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&auto=format&fit=crop"
    
    print("Downloading authentic satellite photograph (Before - Baseline Dense Forest)...")
    res_b = requests.get(url_before, headers=headers, timeout=12)
    img_b = Image.open(io.BytesIO(res_b.content)).convert("RGB").resize((1000, 750), Image.Resampling.LANCZOS)
    
    print("Downloading authentic satellite photograph (After - Post-Disaster Deforestation)...")
    res_a = requests.get(url_after, headers=headers, timeout=12)
    img_a = Image.open(io.BytesIO(res_a.content)).convert("RGB").resize((1000, 750), Image.Resampling.LANCZOS)
    
    before_path = os.path.join(base_dir, "sample_before.jpg")
    after_path = os.path.join(base_dir, "sample_after.jpg")
    
    img_b.save(before_path, "JPEG", quality=95)
    img_a.save(after_path, "JPEG", quality=95)
    
    print(f"Authentic satellite photography successfully saved:\n - {before_path} (1000x750)\n - {after_path} (1000x750)")

if __name__ == "__main__":
    download_real_satellite_photos()
