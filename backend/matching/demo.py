"""
Alumni Matching Engine — Interactive & Visual Demo
Demonstrates the explainable weighted matching engine on sample student career goals.
"""

import sys
from matching_engine import AlumniMatchingEngine


def print_results(goal: str, top_k: int = 5):
    engine = AlumniMatchingEngine()
    results = engine.match(goal, top_k=top_k)

    print("=" * 80)
    print(f"STUDENT CAREER GOAL: \"{goal}\"")
    print("=" * 80)
    print(f"Top {len(results)} Alumnus Recommendations:\n")

    for i, res in enumerate(results, 1):
        print(f"  [{i}] {res.alumnus_name} — Match Score: {res.match_score * 100:.0f}% ({res.match_score:.2f})")
        print(f"      Company: {res.company}")
        print(f"      Role:    {res.role}")
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

    # Sample Demonstration Goals
    demo_goals = [
        "I want to get into strategy consulting.",
        "I want to break into investment banking or private equity with strong financial modeling.",
        "I want to pursue product marketing or growth marketing in tech.",
    ]

    print("\n" + "#" * 80)
    print("#  ALUMNI MATCHING ENGINE (v1.0) — DEMONSTRATION RUN")
    print("#" * 80 + "\n")

    for goal in demo_goals:
        print_results(goal)


if __name__ == "__main__":
    main()
