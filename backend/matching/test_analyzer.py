"""
Unit Tests for Rule-Based Career Goal Analyzer
Verifies extraction accuracy, explainability, and edge cases for:
1. Consulting goal
2. Finance goal
3. Marketing goal
4. Goal with specific skills (SQL, Tableau)
5. Blank, whitespace, and unclear goals
6. Structured integration with AlumniMatchingEngine
7. Dictionary serialization
"""

import unittest
from goal_analyzer import CareerGoalAnalyzer, ParsedCareerGoal
from matching_engine import AlumniMatchingEngine, MatchResult


class TestCareerGoalAnalyzer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.analyzer = CareerGoalAnalyzer()
        cls.engine = AlumniMatchingEngine()

    def test_consulting_goal(self):
        """
        Test Case 1: Consulting Goal
        Verifies extraction of Consulting domain, consulting roles,
        case interview skills, target company, and career transition stage.
        """
        goal = (
            "I want to break into strategy consulting and practice case interviews "
            "and market sizing at Apex Strategy Partners."
        )
        parsed = self.analyzer.analyze(goal)

        self.assertIsInstance(parsed, ParsedCareerGoal)
        self.assertEqual(parsed.primary_function, "Consulting")
        self.assertEqual(parsed.career_stage, "Career Transition")
        self.assertIn("Case Interviews", parsed.target_skills)
        self.assertIn("Market Sizing", parsed.target_skills)
        self.assertIn("Apex Strategy Partners", parsed.target_companies)
        self.assertTrue(
            any("Consultant" in role for role in parsed.target_roles),
            f"Expected a consultant role, got: {parsed.target_roles}"
        )
        self.assertGreater(parsed.confidence_score, 0.5)
        self.assertIn("consulting", parsed.extracted_keywords)

    def test_finance_goal(self):
        """
        Test Case 2: Finance Goal
        Verifies extraction of Finance domain, investment banking roles,
        valuation skills, target company, and internship intent.
        """
        goal = (
            "Looking for a summer analyst internship in investment banking "
            "to do financial modeling, DCF valuation, and M&A at Goldman Sachs."
        )
        parsed = self.analyzer.analyze(goal)

        self.assertIsInstance(parsed, ParsedCareerGoal)
        self.assertEqual(parsed.primary_function, "Finance")
        self.assertEqual(parsed.career_stage, "Internship")
        self.assertIn("Financial Modeling", parsed.target_skills)
        self.assertTrue(
            "DCF Valuation" in parsed.target_skills or "Valuation" in parsed.target_skills
        )
        self.assertIn("M&A", parsed.target_skills)
        self.assertIn("Goldman Sachs", parsed.target_companies)
        self.assertTrue(
            any("Analyst" in r or "Investment" in r for r in parsed.target_roles),
            f"Expected banking analyst role, got: {parsed.target_roles}"
        )
        self.assertGreater(parsed.confidence_score, 0.5)

    def test_marketing_goal(self):
        """
        Test Case 3: Marketing Goal
        Verifies extraction of Marketing domain, PMM role,
        GTM and SEO skills.
        """
        goal = (
            "I want to become a Product Marketing Manager leading "
            "GTM launches, product marketing, and SEO for tech startups."
        )
        parsed = self.analyzer.analyze(goal)

        self.assertIsInstance(parsed, ParsedCareerGoal)
        self.assertEqual(parsed.primary_function, "Marketing")
        self.assertIn("Product Marketing Manager", parsed.target_roles)
        self.assertIn("SEO", parsed.target_skills)
        self.assertTrue(
            "GTM" in parsed.target_skills or "Product Marketing" in parsed.target_skills
        )
        self.assertGreater(parsed.confidence_score, 0.5)

    def test_goal_with_specific_skill(self):
        """
        Test Case 4: Goal with Specific Technical Skills
        Verifies extraction of exact technical skills (SQL, Tableau) and
        correct domain inference to Business Analytics.
        """
        goal = "I want to work with SQL and Tableau to build executive reporting dashboards."
        parsed = self.analyzer.analyze(goal)

        self.assertIsInstance(parsed, ParsedCareerGoal)
        self.assertEqual(parsed.primary_function, "Business Analytics")
        self.assertIn("SQL", parsed.target_skills)
        self.assertIn("Tableau", parsed.target_skills)
        self.assertGreaterEqual(len(parsed.target_skills), 2)
        self.assertIn("sql", parsed.extracted_keywords)
        self.assertIn("tableau", parsed.extracted_keywords)

    def test_blank_and_unclear_goal(self):
        """
        Test Case 5: Blank, Whitespace, and Unclear Goals
        Verifies safe and graceful handling without exceptions.
        """
        # 1. Pure empty string
        empty_res = self.analyzer.analyze("")
        self.assertIsInstance(empty_res, ParsedCareerGoal)
        self.assertEqual(empty_res.raw_goal, "")
        self.assertIsNone(empty_res.primary_function)
        self.assertEqual(empty_res.target_skills, [])
        self.assertEqual(empty_res.target_roles, [])
        self.assertEqual(empty_res.target_companies, [])
        self.assertIsNone(empty_res.career_stage)
        self.assertEqual(empty_res.confidence_score, 0.0)

        # 2. Whitespace only
        ws_res = self.analyzer.analyze("    \t \n   ")
        self.assertIsNone(ws_res.primary_function)
        self.assertEqual(ws_res.target_skills, [])
        self.assertEqual(ws_res.confidence_score, 0.0)

        # 3. Unclear / conversational query with no career keywords
        vague_res = self.analyzer.analyze("hello there, I am looking for general advice about things")
        self.assertIsInstance(vague_res, ParsedCareerGoal)
        self.assertIsNone(vague_res.primary_function)
        self.assertEqual(vague_res.target_skills, [])
        self.assertEqual(vague_res.target_roles, [])
        self.assertLessEqual(vague_res.confidence_score, 0.2)

    def test_engine_structured_integration(self):
        """
        Test Case 6: Structured Integration with AlumniMatchingEngine
        Verifies that parsed goals can be passed to match_structured(...)
        and yield ranked MatchResult instances.
        """
        goal_text = "I want to get into management consulting and practice case interviews."
        parsed = self.engine.analyze_goal(goal_text)

        # Confirm analyzer worked through engine convenience method
        self.assertEqual(parsed.primary_function, "Consulting")

        # Run structured matching
        results = self.engine.match_structured(parsed, top_k=5)
        self.assertEqual(len(results), 5)
        for r in results:
            self.assertIsInstance(r, MatchResult)
            self.assertGreater(r.match_score, 0.0)

        # Top match should be in Consulting
        self.assertEqual(results[0].function, "Consulting")

    def test_to_dict_serialization(self):
        """
        Test Case 7: Serialization to Dict
        Verifies that .to_dict() returns all required fields for future API consumption.
        """
        goal = "Internship in product management building roadmaps at Google"
        parsed = self.analyzer.analyze(goal)
        d = parsed.to_dict()

        expected_keys = [
            "raw_goal", "primary_function", "target_roles",
            "target_skills", "target_companies", "target_industry",
            "career_stage", "extracted_keywords", "confidence_score"
        ]
        for key in expected_keys:
            self.assertIn(key, d)

        self.assertEqual(d["primary_function"], "Product Management")
        self.assertEqual(d["career_stage"], "Internship")
        self.assertIn("Google", d["target_companies"])


if __name__ == "__main__":
    unittest.main()
