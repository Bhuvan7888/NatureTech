import os
import unittest
from dotenv import load_dotenv

load_dotenv()

def calculate_reforestation_economics(damage_area_m2: float) -> tuple:
    """
    Calculate the economics and requirements for reforestation given an area.
    
    Args:
        damage_area_m2 (float): The damaged area in square meters.
        
    Returns:
        tuple: (trees_required, total_cost_usd, summary_string)
    """
    if damage_area_m2 < 0:
        raise ValueError("Damage area cannot be negative.")
        
    # 1 sapling per 4 sq meters
    trees_required = damage_area_m2 / 4.0
    
    # Load dynamic cost per tree
    cost_per_tree = float(os.getenv("COST_PER_TREE_USD", "2.50"))
    total_cost_usd = trees_required * cost_per_tree
    
    # Format the summary string
    summary_string = (f"Damage Area: {damage_area_m2:,.0f} sqm -> "
                      f"Trees Required: {trees_required:,.0f} -> "
                      f"Total Cost to Recover: ${total_cost_usd:,.0f}")
                      
    return trees_required, total_cost_usd, summary_string


class TestReforestationEconomics(unittest.TestCase):
    def test_calculate_reforestation_economics(self):
        # Test Case 1: Known scenario from requirements
        area1 = 15000
        trees1, cost1, summary1 = calculate_reforestation_economics(area1)
        self.assertEqual(trees1, 3750)
        self.assertEqual(cost1, 9375.0)
        self.assertEqual(summary1, "Damage Area: 15,000 sqm -> Trees Required: 3,750 -> Total Cost to Recover: $9,375")
        
        # Test Case 2: Zero area
        area2 = 0
        trees2, cost2, summary2 = calculate_reforestation_economics(area2)
        self.assertEqual(trees2, 0)
        self.assertEqual(cost2, 0.0)
        self.assertEqual(summary2, "Damage Area: 0 sqm -> Trees Required: 0 -> Total Cost to Recover: $0")
        
        # Test Case 3: Very large area
        area3 = 1_000_000
        trees3, cost3, summary3 = calculate_reforestation_economics(area3)
        self.assertEqual(trees3, 250000)
        self.assertEqual(cost3, 625000.0)
        self.assertEqual(summary3, "Damage Area: 1,000,000 sqm -> Trees Required: 250,000 -> Total Cost to Recover: $625,000")
        
        # Test Case 4: Fractional area (handled as float)
        area4 = 10.5
        trees4, cost4, summary4 = calculate_reforestation_economics(area4)
        self.assertEqual(trees4, 2.625)
        self.assertEqual(cost4, 6.5625)
        self.assertEqual(summary4, "Damage Area: 10 sqm -> Trees Required: 3 -> Total Cost to Recover: $7")
        
        # Test Case 5: Negative area
        with self.assertRaises(ValueError):
            calculate_reforestation_economics(-100)

if __name__ == '__main__':
    unittest.main()
