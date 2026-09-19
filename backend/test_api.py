"""
Unit Tests for Alumni Connector Bot — FastAPI Backend
Tests endpoint handlers, request schemas, and integration with the matching engine.
"""

import os
import sys
import unittest

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import (
    app,
    root,
    analyze_goal,
    match,
    GoalAnalysisRequest,
    MatchRequest,
)


class TestFastAPIBackend(unittest.TestCase):
    def test_root_endpoint(self):
        """Verifies the root health check and discovery endpoint."""
        res = root()
        self.assertIsInstance(res, dict)
        self.assertEqual(res.get("status"), "online")
        self.assertIn("analyze_goal", res.get("endpoints", {}))
        self.assertIn("match", res.get("endpoints", {}))

    def test_analyze_goal_endpoint(self):
        """
        Verifies POST /api/analyze-goal correctly parses career goals
        and returns structured intent parameters.
        """
        req = GoalAnalysisRequest(
            career_goal="I want to break into strategy consulting and practice case interviews."
        )
        res = analyze_goal(req)

        self.assertIsInstance(res, dict)
        self.assertEqual(res.get("primary_function"), "Consulting")
        self.assertEqual(res.get("career_stage"), "Career Transition")
        self.assertIn("Case Interviews", res.get("target_skills", []))
        self.assertGreater(res.get("confidence_score", 0.0), 0.5)

    def test_match_endpoint(self):
        """
        Verifies POST /api/match analyzes the student goal, calls the matching engine,
        and returns both the structured goal and top alumni matches.
        """
        req = MatchRequest(
            career_goal="Looking to do investment banking, financial modeling, and DCF valuation.",
            selected_field="",
            top_k=5,
            strict_filter=False
        )
        res = match(req)

        self.assertIsInstance(res, dict)
        self.assertIn("analyzed_goal", res)
        self.assertIn("alumni", res)
        self.assertIn("matches", res)
        self.assertEqual(res.get("total_matches"), 5)

        # Confirm analyzed goal contains extracted intent
        analyzed = res["analyzed_goal"]
        self.assertEqual(analyzed["primary_function"], "Finance")

        # Confirm matched alumni are populated
        alumni = res["alumni"]
        self.assertEqual(len(alumni), 5)
        top_match = alumni[0]
        self.assertEqual(top_match["function"], "Finance")
        self.assertGreater(top_match["match_score"], 0.5)
        self.assertGreater(top_match["match_percentage"], 50)
        self.assertTrue(len(top_match["reasons"]) > 0)

    def test_match_with_selected_field(self):
        """
        Verifies that matching functions correctly when only a selected field is provided.
        """
        req = MatchRequest(
            career_goal="",
            selected_field="Technology & Digital",
            top_k=3,
            strict_filter=False
        )
        res = match(req)

        self.assertIsInstance(res, dict)
        self.assertEqual(res.get("total_matches"), 3)
        self.assertEqual(len(res["alumni"]), 3)
        for alum in res["alumni"]:
            self.assertIn(alum["function"], {"IT", "Product Management", "Business Analytics"})
            self.assertGreater(alum["match_percentage"], 0)


if __name__ == "__main__":
    unittest.main()
