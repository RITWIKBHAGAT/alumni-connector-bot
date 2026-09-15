"""
Alumni Matching Engine (Version 1.0)
Matches a student's natural language career goal against alumni records
using a transparent, explainable weighted scoring system.
No embeddings. No external APIs. Pure Python.
"""

import json
import os
import re
from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Optional, Set, Tuple


# Keyword dictionaries mapped to functional domains
FUNCTION_LEXICON: Dict[str, Set[str]] = {
    "Consulting": {
        "consulting", "consultant", "advisory", "strategy", "case", "cases",
        "transformation", "management consulting", "due diligence", "framework",
        "restructuring", "change management", "commercial diligence"
    },
    "Finance": {
        "finance", "financial", "banking", "investment banking", "private equity",
        "fp&a", "equity research", "valuation", "lbo", "m&a", "capital",
        "underwriting", "portfolio", "credit", "asset management", "dcf", "hedge fund"
    },
    "Marketing": {
        "marketing", "marketer", "brand", "branding", "growth marketing",
        "product marketing", "pmm", "seo", "social media", "content",
        "retention", "acquisition", "cac", "ltv", "campaign", "advertising"
    },
    "Human Resources": {
        "hr", "human resources", "recruiting", "recruiter", "talent", "people ops",
        "hrbp", "compensation", "benefits", "learning and development", "l&d",
        "culture", "dei", "onboarding", "staffing"
    },
    "Operations": {
        "operations", "supply chain", "logistics", "lean", "six sigma",
        "procurement", "sourcing", "fulfillment", "manufacturing", "warehouse",
        "revops", "revenue operations", "inventory", "freight"
    },
    "Product Management": {
        "product management", "product manager", "pm", "apm", "roadmap",
        "prd", "user stories", "backlog", "features", "wireframing", "scrum",
        "agile", "product strategy", "growth pm"
    },
    "Business Analytics": {
        "analytics", "business analytics", "analyst", "bi", "business intelligence",
        "sql", "tableau", "power bi", "snowflake", "insights", "metrics",
        "looker", "reporting", "dashboard", "data analysis"
    },
    "IT": {
        "it", "information technology", "devops", "cloud", "aws", "azure",
        "cybersecurity", "cyber", "infrastructure", "systems admin", "network",
        "networking", "pmp", "sysadmin", "terraform", "kubernetes"
    },
    "Sales": {
        "sales", "account executive", "ae", "sdr", "bdr", "business development",
        "pre-sales", "solutions consultant", "deals", "quota", "pipeline",
        "client acquisition", "enterprise sales", "prospecting"
    }
}

# Role stop words to ignore when calculating role keyword overlap
ROLE_STOPWORDS: Set[str] = {
    "senior", "junior", "lead", "director", "manager", "specialist",
    "associate", "principal", "head", "officer", "vp", "executive",
    "and", "of", "in", "for", "&", "the", "to", "at", "a", "an"
}

ENGLISH_STOPWORDS: Set[str] = {
    "a", "an", "the", "and", "or", "in", "of", "to", "for", "with",
    "on", "at", "by", "is", "as", "it", "i", "me", "my", "we", "our",
    "want", "getting", "get", "into", "role", "job", "career", "work",
    "working", "looking", "break", "become", "pursue", "help", "helping"
}


@dataclass
class MatchResult:
    """Represents a matched alumnus result with explainable reasoning."""
    alumnus_name: str
    company: str
    role: str
    match_score: float
    reasons: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def __getitem__(self, key: str) -> Any:
        return getattr(self, key)


class AlumniMatchingEngine:
    """
    Explainable Matching Engine that ranks alumni profiles against a student's
    career goal using transparent weighted scoring.
    """

    # Scoring Weights (Sum to 1.00)
    WEIGHT_FUNCTION = 0.35
    WEIGHT_ROLE = 0.25
    WEIGHT_SKILLS = 0.20
    WEIGHT_INDUSTRY = 0.10
    WEIGHT_COMPANY = 0.10

    def __init__(self, data_path: Optional[str] = None):
        """Initializes the engine and loads alumni profiles."""
        if data_path is None:
            # Default to data/alumni_data.json relative to this file
            base_dir = os.path.dirname(os.path.abspath(__file__))
            data_path = os.path.join(base_dir, "data", "alumni_data.json")

        self.data_path = data_path
        self.alumni_profiles = self._load_data(data_path)

    def _load_data(self, path: str) -> List[Dict[str, Any]]:
        """Loads and parses the alumni dataset from JSON."""
        if not os.path.exists(path):
            raise FileNotFoundError(f"Alumni data file not found at: {path}")
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if not isinstance(data, list):
            raise ValueError(f"Expected a JSON list of alumni, got {type(data)}")
        return data

    @staticmethod
    def _tokenize(text: str) -> List[str]:
        """Converts text into normalized lowercase tokens."""
        return re.findall(r"\b[a-z0-9+#.-]+\b", text.lower())

    def _score_function(self, goal_lower: str, goal_tokens: Set[str], function_name: str) -> Tuple[float, Optional[str]]:
        """Calculates function alignment score (0.0 to WEIGHT_FUNCTION)."""
        func_lower = function_name.lower()
        # Direct function name match in query
        if func_lower in goal_lower:
            return self.WEIGHT_FUNCTION, f"Direct Function Match: Target domain aligns with {function_name} (+{self.WEIGHT_FUNCTION:.2f})"

        # Lexicon / synonymous domain terms
        domain_terms = FUNCTION_LEXICON.get(function_name, set())
        matched_terms = [term for term in domain_terms if term in goal_lower]
        if matched_terms:
            # Scale based on matches
            score = self.WEIGHT_FUNCTION * min(1.0, len(matched_terms) * 0.6)
            terms_str = ", ".join(f"'{t}'" for t in matched_terms[:3])
            return score, f"Function Alignment: Goal mentions domain keywords ({terms_str}) for {function_name} (+{score:.2f})"

        return 0.0, None

    def _score_role(self, goal_lower: str, goal_tokens: Set[str], role: str) -> Tuple[float, Optional[str]]:
        """Calculates current role relevance score (0.0 to WEIGHT_ROLE)."""
        role_lower = role.lower()
        # Check if entire role title or significant subphrase matches
        if role_lower in goal_lower:
            return self.WEIGHT_ROLE, f"Exact Role Match: Goal explicitly targets role '{role}' (+{self.WEIGHT_ROLE:.2f})"

        # Clean role tokens
        role_tokens = {t for t in self._tokenize(role_lower) if len(t) > 1 and t not in ROLE_STOPWORDS and t not in ENGLISH_STOPWORDS}
        if not role_tokens:
            return 0.0, None

        goal_clean_tokens = goal_tokens - ENGLISH_STOPWORDS
        overlap = role_tokens.intersection(goal_clean_tokens)
        if overlap:
            overlap_ratio = len(overlap) / len(role_tokens)
            score = round(self.WEIGHT_ROLE * min(1.0, overlap_ratio * 1.2), 2)
            terms_str = ", ".join(f"'{t}'" for t in sorted(overlap))
            return score, f"Role Relevance: Alumnus's role '{role}' shares keywords ({terms_str}) (+{score:.2f})"

        return 0.0, None

    def _score_skills(self, goal_lower: str, goal_tokens: Set[str], skills: List[str]) -> Tuple[float, Optional[str]]:
        """Calculates skills match score (0.0 to WEIGHT_SKILLS)."""
        if not skills:
            return 0.0, None

        goal_clean_tokens = goal_tokens - ENGLISH_STOPWORDS
        matched_skills = []
        for skill in skills:
            skill_lower = skill.lower()
            # Direct multi-word phrase match in goal
            if len(skill_lower) > 3 and skill_lower in goal_lower:
                matched_skills.append(skill)
                continue

            # Token overlap for multi-word skills (ignoring generic stopwords)
            skill_tokens = {t for t in self._tokenize(skill_lower) if len(t) > 1 and t not in ENGLISH_STOPWORDS}
            if skill_tokens and len(skill_tokens.intersection(goal_clean_tokens)) >= max(1, len(skill_tokens) // 2):
                matched_skills.append(skill)

        if matched_skills:
            # 1 skill match = 60% of skill weight, 2+ = 100%
            ratio = min(1.0, 0.6 + 0.4 * (len(matched_skills) - 1))
            score = round(self.WEIGHT_SKILLS * ratio, 2)
            matched_str = ", ".join(matched_skills[:3])
            return score, f"Skills Match: Mentors skills requested in your goal ({matched_str}) (+{score:.2f})"

        return 0.0, None

    def _score_industry(self, goal_lower: str, goal_tokens: Set[str], industry: str) -> Tuple[float, Optional[str]]:
        """Calculates industry alignment score (0.0 to WEIGHT_INDUSTRY)."""
        ind_lower = industry.lower()
        if ind_lower in goal_lower:
            return self.WEIGHT_INDUSTRY, f"Industry Match: Company operates in '{industry}' (+{self.WEIGHT_INDUSTRY:.2f})"

        ind_tokens = {t for t in self._tokenize(ind_lower) if len(t) > 1 and t not in ENGLISH_STOPWORDS and t not in {"services"}}
        goal_clean_tokens = goal_tokens - ENGLISH_STOPWORDS
        overlap = ind_tokens.intersection(goal_clean_tokens)
        if overlap:
            score = round(self.WEIGHT_INDUSTRY * (len(overlap) / len(ind_tokens)), 2)
            terms_str = ", ".join(f"'{t}'" for t in sorted(overlap))
            return score, f"Industry Sector: Alignment with {industry} ({terms_str}) (+{score:.2f})"

        return 0.0, None

    def _score_company(self, goal_lower: str, company: str) -> Tuple[float, Optional[str]]:
        """Calculates company relevance score (0.0 to WEIGHT_COMPANY)."""
        comp_lower = company.lower()
        if comp_lower in goal_lower:
            return self.WEIGHT_COMPANY, f"Target Company: Alumnus works directly at '{company}' (+{self.WEIGHT_COMPANY:.2f})"

        # Check company core name (e.g. 'Apex Strategy' in 'Apex Strategy Partners')
        comp_parts = comp_lower.split()
        if len(comp_parts) > 1:
            core_name = " ".join(comp_parts[:2])
            if core_name in goal_lower:
                score = round(self.WEIGHT_COMPANY * 0.8, 2)
                return score, f"Target Company: Alumnus works at '{company}' (+{score:.2f})"

        return 0.0, None

    def _score_profile(self, goal: str, profile: Dict[str, Any]) -> Tuple[float, List[str]]:
        """Scores an individual profile and generates explainable reasons."""
        goal_lower = goal.lower()
        goal_tokens = set(self._tokenize(goal_lower))
        reasons: List[str] = []
        total_score = 0.0

        # 1. Function Match (35%)
        func_score, func_reason = self._score_function(
            goal_lower, goal_tokens, profile.get("function", "")
        )
        total_score += func_score
        if func_reason:
            reasons.append(func_reason)

        # 2. Role Relevance (25%)
        role_score, role_reason = self._score_role(
            goal_lower, goal_tokens, profile.get("current_role", "")
        )
        total_score += role_score
        if role_reason:
            reasons.append(role_reason)

        # 3. Skills Match (20%)
        skills_score, skills_reason = self._score_skills(
            goal_lower, goal_tokens, profile.get("skills", [])
        )
        total_score += skills_score
        if skills_reason:
            reasons.append(skills_reason)

        # 4. Industry Match (10%)
        ind_score, ind_reason = self._score_industry(
            goal_lower, goal_tokens, profile.get("industry", "")
        )
        total_score += ind_score
        if ind_reason:
            reasons.append(ind_reason)

        # 5. Company Relevance (10%)
        comp_score, comp_reason = self._score_company(
            goal_lower, profile.get("current_company", "")
        )
        total_score += comp_score
        if comp_reason:
            reasons.append(comp_reason)

        # Normalize score to 2 decimal places (0.0 to 1.0)
        total_score = min(1.0, round(total_score, 2))

        # Fallback reason if zero score
        if not reasons:
            reasons.append("General alumni community match (no direct keyword overlap with goal)")

        return total_score, reasons

    def match(self, career_goal: str, top_k: int = 5) -> List[MatchResult]:
        """
        Matches a student's career goal against all alumni profiles
        and returns the top_k ranked results.
        """
        if not career_goal or not career_goal.strip():
            # If empty query, return empty list or top by experience
            return []

        scored_profiles: List[Tuple[float, int, MatchResult]] = []

        for profile in self.alumni_profiles:
            score, reasons = self._score_profile(career_goal, profile)
            # Tie-breaker: years of experience
            exp = profile.get("years_of_experience", 0)

            result = MatchResult(
                alumnus_name=profile.get("name", "Unknown"),
                company=profile.get("current_company", "Unknown"),
                role=profile.get("current_role", "Unknown"),
                match_score=score,
                reasons=reasons
            )
            scored_profiles.append((score, exp, result))

        # Sort descending by match_score, then by experience
        scored_profiles.sort(key=lambda item: (item[0], item[1]), reverse=True)

        # Return top_k results
        return [item[2] for item in scored_profiles[:top_k]]
