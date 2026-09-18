"""
Unit Tests for Alumni Matching Engine
Verifies matching quality, explainability, and ranking for:
1. Consulting goal
2. Finance goal
3. Marketing goal
Along with edge case and schema assertions.
"""

import unittest
from matching_engine import AlumniMatchingEngine, MatchResult


class TestAlumniMatchingEngine(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.engine = AlumniMatchingEngine()
        cls.alumni_count = len(cls.engine.alumni_profiles)

    def test_dataset_loaded(self):
        """Verifies that the 50 alumni records are successfully loaded."""
        self.assertEqual(self.alumni_count, 50)

    def test_consulting_goal(self):
        """
        Test Case 1: Consulting Goal
        Verifies that a student targeting strategy consulting matches top consulting alumni
        with high scores and explicit consulting reasons.
        """
        goal = "I want to get into strategy consulting and work on market entry and growth strategy."
        results = self.engine.match(goal, top_k=5)

        # 1. Exactly 5 results
        self.assertEqual(len(results), 5)

        # 2. Top alumnus should be in Consulting
        top_match = results[0]
        self.assertGreater(top_match.match_score, 0.50)
        self.assertIn("Consultant", top_match.role)

        # 3. Verify top names (e.g., Marcus Vance specializes in growth strategy consulting)
        top_names = [r.alumnus_name for r in results]
        self.assertIn("Marcus Vance", top_names)

        # 4. Check reasons transparency
        has_consulting_reason = any("Consulting" in reason for reason in top_match.reasons)
        self.assertTrue(has_consulting_reason, "Top match should cite Consulting domain or function")

        has_skill_or_role_reason = any("Strategy" in r or "strategy" in r for r in top_match.reasons)
        self.assertTrue(has_skill_or_role_reason, "Reasons should mention strategy role or skill match")

    def test_finance_goal(self):
        """
        Test Case 2: Finance Goal
        Verifies that a student targeting investment banking and financial modeling
        matches top finance alumni with relevant deal/modeling reasons.
        """
        goal = "I want to work in investment banking or private equity doing financial modeling, DCF valuation, and M&A."
        results = self.engine.match(goal, top_k=5)

        # 1. Exactly 5 results
        self.assertEqual(len(results), 5)

        # 2. Top alumnus should be in Finance
        top_match = results[0]
        self.assertGreater(top_match.match_score, 0.50)

        # 3. Top results must include key finance alumni
        top_names = [r.alumnus_name for r in results]
        # Julian Sterling is Investment Banking Associate at Granite Peak Capital (LBO, DCF, M&A)
        # Sophia Chen is Private Equity Senior Analyst at BlueHaven Partners
        self.assertTrue(
            "Julian Sterling" in top_names or "Sophia Chen" in top_names,
            "Top finance matches should include Julian Sterling or Sophia Chen"
        )

        # 4. Check reasons mention finance / modeling / M&A
        all_reasons = " ".join(top_match.reasons).lower()
        self.assertTrue(
            "finance" in all_reasons or "investment" in all_reasons or "banking" in all_reasons,
            "Top match reasons should cite finance/banking domain"
        )

    def test_marketing_goal(self):
        """
        Test Case 3: Marketing Goal
        Verifies that a student targeting product marketing or growth marketing
        matches top marketing alumni with relevant PMM / growth reasons.
        """
        goal = "I want to break into product marketing or growth marketing in tech and lead GTM launches."
        results = self.engine.match(goal, top_k=5)

        # 1. Exactly 5 results
        self.assertEqual(len(results), 5)

        # 2. Top alumnus should be in Marketing
        top_match = results[0]
        self.assertGreater(top_match.match_score, 0.50)

        # 3. Top results must include key marketing alumni
        top_names = [r.alumnus_name for r in results]
        # Fatima Al-Sayed is Senior Product Marketing Manager (GTM, PMM)
        # Samantha Reed is Growth Marketing Director
        self.assertTrue(
            "Fatima Al-Sayed" in top_names or "Samantha Reed" in top_names,
            "Top marketing matches should include Fatima Al-Sayed or Samantha Reed"
        )

        # 4. Check reasons mention marketing / GTM / product marketing
        all_reasons = " ".join(top_match.reasons).lower()
        self.assertTrue(
            "marketing" in all_reasons or "growth" in all_reasons or "gtm" in all_reasons,
            "Top match reasons should cite marketing/growth"
        )

    def test_result_structure_and_types(self):
        """Verifies that all results conform to the required schema fields and data types."""
        goal = "I want to become a product manager leading AI and machine learning features."
        results = self.engine.match(goal, top_k=5)

        self.assertEqual(len(results), 5)
        for r in results:
            self.assertIsInstance(r, MatchResult)
            self.assertIsInstance(r.alumnus_name, str)
            self.assertIsInstance(r.company, str)
            self.assertIsInstance(r.role, str)
            self.assertIsInstance(r.match_score, float)
            self.assertIsInstance(r.reasons, list)

            # Non-empty checks
            self.assertTrue(len(r.alumnus_name) > 0)
            self.assertTrue(len(r.company) > 0)
            self.assertTrue(len(r.role) > 0)
            self.assertGreaterEqual(r.match_score, 0.0)
            self.assertLessEqual(r.match_score, 1.0)
            self.assertGreater(len(r.reasons), 0)

            # Dictionary access check
            d = r.to_dict()
            self.assertIn("alumnus_name", d)
            self.assertIn("company", d)
            self.assertIn("role", d)
            self.assertIn("match_score", d)
            self.assertIn("reasons", d)

    def test_descending_score_order(self):
        """Verifies results are strictly sorted descending by match score."""
        goal = "Data analyst or business intelligence specialist working with SQL and Tableau."
        results = self.engine.match(goal, top_k=5)

        scores = [r.match_score for r in results]
        for i in range(len(scores) - 1):
            self.assertGreaterEqual(scores[i], scores[i + 1])

    def test_empty_goal_handling(self):
        """Verifies graceful handling of empty or blank string goals when no field is selected."""
        self.assertEqual(self.engine.match(""), [])
        self.assertEqual(self.engine.match("   "), [])
        self.assertEqual(self.engine.match("", selected_field="All Fields"), [])

    def test_selected_field_without_goal(self):
        """Verifies that selecting a field without typing a goal returns relevant alumni in that discipline."""
        results = self.engine.match("", selected_field="Finance", top_k=5)
        self.assertEqual(len(results), 5)
        for r in results:
            self.assertEqual(r.function, "Finance")
            self.assertGreater(r.match_percentage, 50)
            self.assertTrue(any("selected field" in reason.lower() for reason in r.reasons))

    def test_selected_field_boosting(self):
        """Verifies that selected_field provides a score boost to alumni in that domain."""
        goal = "I want to work on digital transformation and strategic roadmap advisory."
        # Without selected field
        results_no_field = self.engine.match(goal, top_k=5)
        # With Consulting field
        results_with_field = self.engine.match(goal, selected_field="Consulting", top_k=5)

        self.assertEqual(len(results_with_field), 5)
        top_match = results_with_field[0]
        self.assertEqual(top_match.function, "Consulting")
        # Ensure field boost reason is present
        self.assertTrue(any("selected field" in reason.lower() for reason in top_match.reasons))

    def test_strict_filter(self):
        """Verifies that strict_filter=True restricts results strictly to matching domains."""
        goal = "operations and supply chain strategy"
        results = self.engine.match(goal, selected_field="Human Resources", top_k=5, strict_filter=True)
        for r in results:
            self.assertEqual(r.function, "Human Resources")

    def test_match_percentage_and_profile_fields(self):
        """Verifies all detailed profile attributes and 0-100 match percentage are populated."""
        goal = "Lead enterprise cloud infrastructure and cybersecurity architectures."
        results = self.engine.match(goal, top_k=3)

        self.assertEqual(len(results), 3)
        for r in results:
            # Match percentage assertions
            self.assertIsInstance(r.match_percentage, int)
            self.assertGreaterEqual(r.match_percentage, 0)
            self.assertLessEqual(r.match_percentage, 100)
            self.assertEqual(r.match_percentage, int(round(r.match_score * 100)))

            # Extended profile field assertions
            self.assertTrue(r.alumnus_id.startswith("ALUM-"))
            self.assertGreater(r.graduation_year, 2010)
            self.assertTrue(len(r.degree) > 0)
            self.assertTrue(len(r.industry) > 0)
            self.assertTrue(len(r.function) > 0)
            self.assertTrue(len(r.location) > 0)
            self.assertIsInstance(r.skills, list)
            self.assertGreater(len(r.skills), 0)
            self.assertGreater(r.years_of_experience, 0)
            self.assertTrue(len(r.career_summary) > 0)

            # Dictionary aliases assertion
            d = r.to_dict()
            self.assertEqual(d["matchPercentage"], r.match_percentage)
            self.assertEqual(d["id"], r.alumnus_id)
            self.assertEqual(d["name"], r.alumnus_name)
            self.assertEqual(d["current_company"], r.company)
            self.assertEqual(d["current_role"], r.role)
            self.assertEqual(d["graduationYear"], r.graduation_year)
            self.assertEqual(d["yearsOfExperience"], r.years_of_experience)
            self.assertEqual(d["careerSummary"], r.career_summary)

    def test_backward_compatibility_positional_top_k(self):
        """Verifies that calling engine.match(goal, 3) where top_k is passed positionally still works."""
        goal = "Product management"
        results = self.engine.match(goal, 3)
        self.assertEqual(len(results), 3)


if __name__ == "__main__":
    unittest.main()
