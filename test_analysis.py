import sys
import numpy as np
from PIL import Image

try:
    from deforestation_ui import identify_barren_areas, detect_forest_fires
    
    before_img = 'sample_before.jpg'
    after_img = 'sample_after.jpg'
    
    # Need image_shape for identify_barren_areas
    img = Image.open(before_img)
    shape = (img.height, img.width, 3)
    
    print("Testing Deforestation Analysis...")
    area, regions, mask, info = identify_barren_areas(before_img, after_img, shape)
    print(f"Deforestation: Area={area}, Regions={regions}")
    
    print("\nTesting Forest Fire Detection...")
    fire_area, fire_regions, fire_vis = detect_forest_fires(before_img, after_img)
    print(f"Fire Detection: Area={fire_area}, Regions={fire_regions}")
    
    print("\nAll analysis modes completed successfully!")
    sys.exit(0)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
