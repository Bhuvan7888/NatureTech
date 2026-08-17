# Re-Grow: Active Recovery Platform

A powerful tool for analyzing deforestation and forest fires using satellite imagery and translating that damage directly into actionable, economic recovery plans. Re-Grow uses advanced computer vision techniques to detect and measure areas affected by disasters, calculates the required saplings and cost to restore the ecosystem, and automatically matches you with local conservation NGOs in the impact zone.

## Features

- **Satellite Analysis**: Upload and analyze before/after satellite images to detect deforested areas and forest fire burn scars.
- **Active Recovery Pipeline**: Automatically calculates the number of saplings required (1 per 4 m²) and the total estimated USD cost to restore the destroyed land.
- **Geospatial NGO Matchmaking**: Securely queries the OpenStreetMap Overpass API to find local forestry, nature, and NGO organizations within a 50km radius of the damage. Features a robust SQLite cache and an offline fallback dataset for 100% uptime.
- **Data Logging**: Keeps a historical SQLite database of all analyses, coordinates, and costs for long-term tracking.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Bhuvan7888/NatureTech.git
cd NatureTech
```

2. Configure your Environment Variables:
```bash
cp .env.example .env
```
*(Optionally modify `.env` to change search radius, timeouts, or the cost per tree).*

3. Install requirements (using `uv` or `pip`):
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Usage

1. Run the application:
```bash
python run.py
```

2. Open your web browser and navigate to `http://localhost:8501`

3. **Run an Analysis:**
   - Open **Advanced Settings** and input the exact Latitude and Longitude of the target area.
   - Select a "before" image and an "after" image.
   - Choose your analysis mode (Deforestation or Forest Fire) and click Analyze.
   - Scroll down to view the **Active Recovery Action Plan** and connect with local NGOs!

## Project Structure

```
Re-Grow/
├── deforestation_ui.py       # Streamlit user interface and unified pipeline
├── ngo_matcher.py            # Overpass API geospatial matchmaking logic
├── reforestation_economics.py# Cost and sapling requirement algorithms
├── db.py                     # SQLite caching and history logging
├── data/
│   └── fallback_ngos.json    # Offline fallback dataset of top Indian NGOs
├── run.py                    # Application runner
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Built With
- **Streamlit**: Web Framework
- **OpenStreetMap Overpass API**: Geospatial querying
- **OpenCV & scikit-image**: Computer Vision Processing
- **SQLite**: Caching and Analytics DB