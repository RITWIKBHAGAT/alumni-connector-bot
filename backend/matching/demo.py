"""
Alumni Matching Engine — Interactive & Visual Demo
Demonstrates the explainable weighted matching engine on sample student career goals.
"""

import sys
from matching_engine import AlumniMatchingEngine


def print_results(goal: str, selected_field: str = "", top_k: int = 5):
    engine = AlumniMatchingEngine()
    parsed = engine.analyze_goal(goal) if goal else None
    results = engine.match(career_goal=goal, selected_field=selected_field, top_k=top_k)

    field_label = f" | FIELD: \"{selected_field}\"" if selected_field else ""
    print("=" * 80)
    print(f"STUDENT CAREER GOAL: \"{goal}\"{field_label}")
    if parsed and parsed.raw_goal:
        print("PARSED STRUCTURED GOAL:")
        print(f"  • Primary Function: {parsed.primary_function or 'None'}")
        print(f"  • Target Roles:     {', '.join(parsed.target_roles) or 'None'}")
        print(f"  • Target Skills:    {', '.join(parsed.target_skills) or 'None'}")
        print(f"  • Target Companies: {', '.join(parsed.target_companies) or 'None'}")
        print(f"  • Career Stage:     {parsed.career_stage or 'None'}")
        print(f"  • Confidence Score: {parsed.confidence_score:.2f}")
    print("=" * 80)
    print(f"Top {len(results)} Alumnus Recommendations:\n")

    for i, res in enumerate(results, 1):
        print(f"  [{i}] {res.alumnus_name} ({res.alumnus_id}) — Match Percentage: {res.match_percentage}% (Score: {res.match_score:.2f})")
        print(f"      Company:    {res.company}")
        print(f"      Role:       {res.role}")
        print(f"      Degree:     {res.degree} (Class of {res.graduation_year})")
        print(f"      Location:   {res.location} | Experience: {res.years_of_experience} yrs")
        print(f"      Skills:     {', '.join(res.skills)}")
        print("      Why Matched:")
        for reason in res.reasons:
            print(f"       - {reason}")
        print("-" * 80)
    print()


def main():
    if len(sys.argv) > 1:
        custom_goal = " ".join(sys.argv[1:])
        print_results(custom_goal)
        return

    # Sample Demonstration Scenarios
    print("\n" + "#" * 80)
    print("#  ALUMNI MATCHING ENGINE (v2.0) — DEMONSTRATION RUN")
    print("#" * 80 + "\n")

    # Scenario 1: Standard Natural Language Goal
    print_results("I want to get into strategy consulting and work on growth advisory.")

    # Scenario 2: Goal with Selected Field Boost
    print_results(
        "I want to do financial modeling and valuation.",
        selected_field="Finance & Accounting"
    )

    # Scenario 3: Selected Field without Natural Language Goal
    print_results("", selected_field="Technology & Digital")


if __name__ == "__main__":
    main()
