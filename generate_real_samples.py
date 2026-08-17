import numpy as np
from PIL import Image, ImageFilter, ImageDraw
import os

def create_forest_base(w=800, h=600, seed=42):
    np.random.seed(seed)
    # Generate Perlin-like canopy texture
    base = np.zeros((h, w, 3), dtype=np.uint8)
    
    # Base forest color layers (rich greens, deep olive, tropical forest shades)
    x = np.linspace(0, 10, w)
    y = np.linspace(0, 10, h)
    xx, yy = np.meshgrid(x, y)
    
    noise1 = np.sin(xx * 0.8 + np.cos(yy * 0.9)) * 0.5 + 0.5
    noise2 = np.cos(xx * 1.5 - np.sin(yy * 1.2)) * 0.5 + 0.5
    noise3 = np.random.normal(0, 15, (h, w))
    
    # RGB Channels for dense forest
    r = (30 + noise1 * 40 + noise3 * 0.2).clip(10, 80)
    g = (110 + noise1 * 80 + noise2 * 40 + noise3 * 0.5).clip(70, 220)
    b = (35 + noise2 * 35 + noise3 * 0.2).clip(15, 75)
    
    base[:, :, 0] = r.astype(np.uint8)
    base[:, :, 1] = g.astype(np.uint8)
    base[:, :, 2] = b.astype(np.uint8)
    
    img = Image.fromarray(base)
    # Add subtle canopy texture detail
    img = img.filter(ImageFilter.SMOOTH_MORE)
    
    # Draw a natural winding river across the forest
    draw = ImageDraw.Draw(img)
    river_points = [
        (0, int(h * 0.3)),
        (int(w * 0.25), int(h * 0.35)),
        (int(w * 0.5), int(h * 0.28)),
        (int(w * 0.75), int(h * 0.42)),
        (w, int(h * 0.45))
    ]
    draw.line(river_points, fill=(25, 70, 120), width=18, joint="curve")
    
    return img

def create_deforested_after(before_img, seed=42):
    np.random.seed(seed + 10)
    img_np = np.array(before_img).copy()
    h, w, _ = img_np.shape
    
    # Create distinct deforested clearing patches (exposed soil, brown/tan clearings)
    mask = np.zeros((h, w), dtype=bool)
    
    # Clear-cut cluster 1 (Main logging zone)
    y1, x1 = np.ogrid[:h, :w]
    c1 = (x1 - 320)**2 + (y1 - 380)**2 <= 110**2
    c2 = (x1 - 450)**2 + (y1 - 320)**2 <= 130**2
    c3 = (x1 - 580)**2 + (y1 - 400)**2 <= 90**2
    mask = c1 | c2 | c3
    
    # Add jagged logging boundaries
    x_grid, y_grid = np.meshgrid(np.linspace(0, 10, w), np.linspace(0, 10, h))
    jagged = (np.sin(x_grid * 4) + np.cos(y_grid * 4)) > 0.5
    mask = mask & jagged
    
    # Apply barren soil colors (exposed reddish-brown soil, dry timber debris)
    soil_r = np.random.randint(155, 195, (h, w), dtype=np.uint8)
    soil_g = np.random.randint(110, 145, (h, w), dtype=np.uint8)
    soil_b = np.random.randint(70, 105, (h, w), dtype=np.uint8)
    
    img_np[mask, 0] = soil_r[mask]
    img_np[mask, 1] = soil_g[mask]
    img_np[mask, 2] = soil_b[mask]
    
    res_img = Image.fromarray(img_np)
    draw = ImageDraw.Draw(res_img)
    
    # Draw dirt logging access roads connecting clearings
    road_points = [(180, 480), (320, 380), (450, 320), (580, 400), (720, 450)]
    draw.line(road_points, fill=(160, 115, 80), width=6)
    
    return res_img

def main():
    base_dir = os.path.dirname(os.path.realpath(__file__))
    before_img = create_forest_base(800, 600, seed=101)
    after_img = create_deforested_after(before_img, seed=101)
    
    before_path = os.path.join(base_dir, "sample_before.jpg")
    after_path = os.path.join(base_dir, "sample_after.jpg")
    
    before_img.save(before_path, quality=95)
    after_img.save(after_path, quality=95)
    print(f"High-res realistic satellite samples generated successfully at 800x600 in {base_dir}")

if __name__ == "__main__":
    main()
