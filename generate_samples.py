import numpy as np
from PIL import Image

def create_image(color, filename):
    img = np.zeros((200, 200, 3), dtype=np.uint8)
    img[:] = color
    Image.fromarray(img).save(filename)

# Create "before" image (mostly green)
before = np.zeros((200, 200, 3), dtype=np.uint8)
before[:] = [34, 139, 34] # Forest green
Image.fromarray(before).save('sample_before.jpg')

# Create "after" image (some brown/barren areas, and maybe some red for fire)
after = np.copy(before)
# Deforestation area
after[50:100, 50:100] = [139, 69, 19] # Saddle brown
# Fire area
after[120:170, 120:170] = [255, 0, 0] # Red
Image.fromarray(after).save('sample_after.jpg')
