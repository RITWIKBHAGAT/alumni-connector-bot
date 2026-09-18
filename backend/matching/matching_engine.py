"""
Alumni Matching Engine (Version 1.0)
Matches a student's natural language career goal against alumni records
using a transparent, explainable weighted scoring system.
No embeddings. No external APIs. Pure Python.
"""

import json
import os
import re
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional, Set, Tuple, Union


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


# Mapping between high-level categories and dataset domain functions
CATEGORY_TO_FUNCTIONS: Dict[str, Set[str]] = {
    "technology & digital": {"IT", "Product Management", "Business Analytics"},
    "business & consulting": {"Consulting", "Operations", "Business Analytics"},
    "finance & accounting": {"Finance"},
    "marketing & growth": {"Marketing", "Sales"},
    "people & organization": {"Human Resources"},
    "supply chain & operations": {"Operations"},
    "engineering & manufacturing": {"Operations", "IT"},
    "sales": {"Sales"},
    "consulting": {"Consulting"},
    "finance": {"Finance"},
    "marketing": {"Marketing"},
    "human resources": {"Human Resources"},
    "operations": {"Operations"},
    "product management": {"Product Management"},
    "business analytics": {"Business Analytics"},
    "it": {"IT"},
    "information technology": {"IT"},
}

# Values that indicate no filtering or neutral selection
IGNORED_FIELDS: Set[str] = {
    "", "all", "all fields", "other", "other / not sure yet", "undecided", "none"
}


@dataclass
class MatchResult:
    """Represents a matched alumnus result with explainable reasoning and full profile data."""
    alumnus_name: str
    company: str
    role: str
    match_score: float
    reasons: List[str]
    # Detailed profile fields from alumni dataset
    alumnus_id: str = ""
    graduation_year: int = 0
    degree: str = ""
    industry: str = ""
    function: str = ""
    location: str = ""
    skills: List[str] = field(default_factory=list)
    years_of_experience: int = 0
    career_summary: str = ""
    # Frontend-friendly percentage score (0-100)
    match_percentage: int = 0

    def to_dict(self) -> Dict[str, Any]:
        """Converts result to a dictionary with both backend and frontend-compatible keys."""
        d = asdict(self)
        # Add frontend-friendly property aliases
        d["matchPercentage"] = self.match_percentage
        d["name"] = self.alumnus_name
        d["id"] = self.alumnus_id
        d["current_company"] = self.company
        d["current_role"] = self.role
        d["graduationYear"] = self.graduation_year
        d["yearsOfExperience"] = self.years_of_experience
        d["careerSummary"] = self.career_summary
        return d

    def __getitem__(self, key: str) -> Any:
        """Supports dictionary-like access with alias support."""
        alias_map = {
            "name": "alumnus_name",
            "id": "alumnus_id",
            "current_company": "company",
            "current_role": "role",
            "matchPercentage": "match_percentage",
            "graduationYear": "graduation_year",
            "yearsOfExperience": "years_of_experience",
            "careerSummary": "career_summary"
        }
        attr = alias_map.get(key, key)
        if hasattr(self, attr):
            return getattr(self, attr)
        raise KeyError(key)


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

    # Alignment Boost when Selected Field is provided
    WEIGHT_FIELD_BOOST = 0.15

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

    def _score_selected_field(
        self,
        selected_field: str,
        profile: Dict[str, Any],
        standalone: bool = False
    ) -> Tuple[float, Optional[str], bool]:
        """
        Evaluates alignment between the student's selected field and the alumnus's function and industry.
        Returns: (score, reason, is_match)
        """
        field_norm = selected_field.strip().lower()
        if not field_norm or field_norm in IGNORED_FIELDS:
            return 0.0, None, True

        func_name = profile.get("function", "")
        func_lower = func_name.lower()
        ind_name = profile.get("industry", "")
        ind_lower = ind_name.lower()

        is_direct_func = (field_norm == func_lower) or (field_norm in func_lower) or (func_lower in field_norm)
        is_direct_ind = (field_norm in ind_lower) or (ind_lower in field_norm)

        # Check high-level category mapping
        mapped_functions = CATEGORY_TO_FUNCTIONS.get(field_norm, set())
        is_mapped_func = func_name in mapped_functions

        # Check token overlap with function or industry
        field_tokens = {t for t in self._tokenize(field_norm) if t not in ENGLISH_STOPWORDS}
        func_tokens = set(self._tokenize(func_lower))
        ind_tokens = set(self._tokenize(ind_lower))
        overlap = field_tokens.intersection(func_tokens.union(ind_tokens))

        if is_direct_func or is_direct_ind or is_mapped_func or overlap:
            if standalone:
                # Standalone search where only selected_field is specified
                if is_direct_func:
                    score = 0.75
                    match_type = f"Direct Domain ({func_name})"
                elif is_direct_ind:
                    score = 0.70
                    match_type = f"Direct Industry ({ind_name})"
                elif is_mapped_func:
                    score = 0.65
                    match_type = f"Discipline Track ({func_name})"
                else:
                    score = 0.50
                    match_type = f"Field Keywords ({', '.join(sorted(overlap))})"
                reason = f"Target Field Match: Alumnus matches selected field '{selected_field}' [{match_type}] (+{score:.2f})"
            else:
                # Boost added on top of existing goal score
                boost = self.WEIGHT_FIELD_BOOST if (is_direct_func or is_mapped_func or is_direct_ind) else round(self.WEIGHT_FIELD_BOOST * 0.6, 2)
                score = boost
                reason = f"Target Field Boost: Alumnus operates in selected field '{selected_field}' (+{score:.2f})"

            return score, reason, True

        return 0.0, None, False

    def _score_profile(
        self,
        goal: str,
        profile: Dict[str, Any],
        selected_field: Optional[str] = None,
        strict_filter: bool = False
    ) -> Tuple[float, List[str], bool]:
        """Scores an individual profile against career goal and selected field."""
        goal_lower = goal.lower()
        goal_tokens = set(self._tokenize(goal_lower))
        has_goal = len(goal.strip()) > 0
        reasons: List[str] = []

        field_clean = selected_field.strip() if selected_field else ""
        has_field = bool(field_clean) and field_clean.lower() not in IGNORED_FIELDS

        # 1. Strict Filtering Check: Strictly require primary function match (do NOT use industry)
        if has_field and strict_filter:
            func_name = profile.get("function", "")
            func_lower = func_name.lower()
            field_norm = field_clean.lower()

            is_direct_func = (field_norm == func_lower) or (field_norm in func_lower) or (func_lower in field_norm)
            mapped_functions = CATEGORY_TO_FUNCTIONS.get(field_norm, set())
            is_mapped_func = any(m.lower() == func_lower for m in mapped_functions)

            if not (is_direct_func or is_mapped_func):
                return 0.0, [], False

        # 2. Field Alignment Scoring
        field_score = 0.0
        if has_field:
            field_score, field_reason, _ = self._score_selected_field(
                field_clean, profile, standalone=(not has_goal)
            )
            if field_reason:
                reasons.append(field_reason)

        # If goal is empty, use standalone field scoring
        if not has_goal:
            if field_score > 0:
                total_score = min(1.0, round(field_score, 2))
                return total_score, reasons, True
            return 0.0, [], False

        # 2. Free-text Goal Scoring
        total_score = 0.0

        # Function Match (35%)
        func_score, func_reason = self._score_function(
            goal_lower, goal_tokens, profile.get("function", "")
        )
        total_score += func_score
        if func_reason:
            reasons.append(func_reason)

        # Role Relevance (25%)
        role_score, role_reason = self._score_role(
            goal_lower, goal_tokens, profile.get("current_role", "")
        )
        total_score += role_score
        if role_reason:
            reasons.append(role_reason)

        # Skills Match (20%)
        skills_score, skills_reason = self._score_skills(
            goal_lower, goal_tokens, profile.get("skills", [])
        )
        total_score += skills_score
        if skills_reason:
            reasons.append(skills_reason)

        # Industry Match (10%)
        ind_score, ind_reason = self._score_industry(
            goal_lower, goal_tokens, profile.get("industry", "")
        )
        total_score += ind_score
        if ind_reason:
            reasons.append(ind_reason)

        # Company Relevance (10%)
        comp_score, comp_reason = self._score_company(
            goal_lower, profile.get("current_company", "")
        )
        total_score += comp_score
        if comp_reason:
            reasons.append(comp_reason)

        # Add Field Alignment Boost if applicable
        if has_field and field_score > 0:
            total_score += field_score

        # Normalize score to 2 decimal places (0.0 to 1.0)
        total_score = min(1.0, round(total_score, 2))

        # Fallback reason if zero score
        if not reasons:
            reasons.append("General alumni community match (no direct keyword overlap with goal)")

        return total_score, reasons, True

    def match(
        self,
        career_goal: str = "",
        selected_field: Optional[Union[str, int]] = None,
        top_k: int = 5,
        strict_filter: bool = False
    ) -> List[MatchResult]:
        """
        Matches a student's career goal and optional selected field against all alumni profiles
        and returns the top_k ranked results.

        Backwards compatibility: If an integer is passed as the 2nd argument (e.g. match("goal", 5)),
        it is recognized as top_k.
        """
        # Handle positional backwards compatibility where 2nd argument is top_k integer
        if isinstance(selected_field, int):
            top_k = selected_field
            selected_field = None

        goal_clean = career_goal.strip() if career_goal else ""
        field_clean = selected_field.strip() if (isinstance(selected_field, str) and selected_field) else ""
        has_field = bool(field_clean) and field_clean.lower() not in IGNORED_FIELDS

        # If both goal and selected_field are empty, return empty list
        if not goal_clean and not has_field:
            return []

        scored_profiles: List[Tuple[float, int, MatchResult]] = []

        for profile in self.alumni_profiles:
            score, reasons, is_valid = self._score_profile(
                goal_clean, profile, selected_field=field_clean, strict_filter=strict_filter
            )
            if not is_valid:
                continue

            # Tie-breaker: years of experience
            exp = profile.get("years_of_experience", 0)

            result = MatchResult(
                alumnus_id=profile.get("id", ""),
                alumnus_name=profile.get("name", "Unknown"),
                company=profile.get("current_company", "Unknown"),
                role=profile.get("current_role", "Unknown"),
                match_score=score,
                reasons=reasons,
                graduation_year=profile.get("graduation_year", 0),
                degree=profile.get("degree", ""),
                industry=profile.get("industry", ""),
                function=profile.get("function", ""),
                location=profile.get("location", ""),
                skills=profile.get("skills", []),
                years_of_experience=exp,
                career_summary=profile.get("career_summary", ""),
                match_percentage=int(round(score * 100)),
            )
            scored_profiles.append((score, exp, result))

        # Sort descending by match_score, then by experience
        scored_profiles.sort(key=lambda item: (item[0], item[1]), reverse=True)

        # Return top_k results
        return [item[2] for item in scored_profiles[:top_k]]
