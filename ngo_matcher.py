import json
import os
import requests
import unittest
from unittest.mock import patch, MagicMock
from dotenv import load_dotenv
import db

load_dotenv()

def get_fallback_ngos():
    """Load the fallback NGOs from the local JSON file."""
    fallback_path = os.path.join(os.path.dirname(__file__), 'data', 'fallback_ngos.json')
    try:
        with open(fallback_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading fallback NGOs: {e}")
        return []

def find_nearby_ngos(lat: float, lon: float, radius_km: float = None):
    """
    Query the OpenStreetMap Overpass API for nearby NGOs, forestry offices, or nature clubs.
    Falls back to a local JSON dataset if the API fails, times out, or returns zero results.
    """
    # Check cache first
    cached = db.get_cached_ngos(lat, lon)
    if cached:
        print("Using cached NGOs.")
        return cached

    # Load config
    radius_km = radius_km or float(os.getenv("NGO_SEARCH_RADIUS_KM", "50.0"))
    overpass_url = os.getenv("OVERPASS_API_ENDPOINT", "https://overpass-api.de/api/interpreter")
    timeout_sec = int(os.getenv("OVERPASS_TIMEOUT_SEC", "15"))

    # Convert radius to meters
    radius_m = radius_km * 1000
    
    query = f"""
    [out:json][timeout:{timeout_sec}];
    (
      node["office"="ngo"](around:{radius_m},{lat},{lon});
      node["office"="forestry"](around:{radius_m},{lat},{lon});
      node["club"="nature"](around:{radius_m},{lat},{lon});
    );
    out body;
    """
    
    try:
        # Use HTTPS and a descriptive User-Agent
        response = requests.get(
            overpass_url, 
            params={'data': query}, 
            headers={'User-Agent': 'ReGrowApp/1.0'}, 
            timeout=timeout_sec
        )
        response.raise_for_status()
        data = response.json()
        
        results = []
        for element in data.get('elements', []):
            tags = element.get('tags', {})
            
            # Extract category based on the tags we queried for
            category = "NGO"
            if tags.get('office') == 'forestry':
                category = "Forestry"
            elif tags.get('club') == 'nature':
                category = "Nature Club"
                
            name = tags.get('name', 'Unnamed Organization')
            contact = tags.get('contact:email') or tags.get('email') or tags.get('phone') or 'Contact info unavailable'
            website = tags.get('website') or tags.get('contact:website') or 'No website'
            
            # Format location as lat/lon if address is missing
            location = f"{element.get('lat')}, {element.get('lon')}"
            if 'addr:city' in tags:
                location = tags['addr:city']
                
            results.append({
                "name": name,
                "category": category,
                "contact": contact,
                "website": website,
                "location": location,
                "source": "OpenStreetMap"
            })
            
        if not results:
            print("Overpass returned zero results, using fallback.")
            return get_fallback_ngos()
            
        db.cache_ngos(lat, lon, results)
        return results

    except Exception as e:
        print(f"Overpass API failed ({e}), using fallback.")
        return get_fallback_ngos()


class TestNGOMatcher(unittest.TestCase):
    
    @patch('requests.get')
    def test_overpass_success_with_results(self, mock_get):
        # Mock a successful API response
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "elements": [
                {
                    "type": "node",
                    "id": 12345,
                    "lat": 37.7749,
                    "lon": -122.4194,
                    "tags": {
                        "name": "Test NGO",
                        "office": "ngo",
                        "contact:email": "test@testngo.org",
                        "website": "https://testngo.org",
                        "addr:city": "San Francisco"
                    }
                }
            ]
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        results = find_nearby_ngos(37.7749, -122.4194)
        
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name'], "Test NGO")
        self.assertEqual(results[0]['contact'], "test@testngo.org")
        self.assertEqual(results[0]['website'], "https://testngo.org")
        self.assertEqual(results[0]['location'], "San Francisco")
        self.assertEqual(results[0]['source'], "OpenStreetMap")
        mock_get.assert_called_once()

    @patch('requests.get')
    def test_overpass_success_zero_results_triggers_fallback(self, mock_get):
        # Mock a successful API response but with no elements
        mock_response = MagicMock()
        mock_response.json.return_value = {"elements": []}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        results = find_nearby_ngos(0.0, 0.0)
        
        # Fallback dataset has 3 elements
        self.assertEqual(len(results), 3)
        self.assertEqual(results[0]['source'], "Fallback Database")
        
    @patch('requests.get')
    def test_overpass_failure_triggers_fallback(self, mock_get):
        # Mock a network or HTTP error
        mock_get.side_effect = requests.exceptions.RequestException("API Error")

        results = find_nearby_ngos(0.0, 0.0)
        
        self.assertEqual(len(results), 3)
        self.assertEqual(results[0]['source'], "Fallback Database")


if __name__ == '__main__':
    unittest.main()
