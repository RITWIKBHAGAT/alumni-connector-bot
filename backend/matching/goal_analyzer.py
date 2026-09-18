"""
Career Goal Analyzer (Rule-Based, Dependency-Free)
Extracts structured career intent from student natural language goals using
only Python standard library regex and lexicon matching.
No external LLMs, no embeddings, no vector databases, no API keys.
"""

import re
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional, Set, Tuple


@dataclass
class ParsedCareerGoal:
    """Represents structured career parameters extracted from free-form text."""
    raw_goal: str
    primary_function: Optional[str] = None
    target_roles: List[str] = field(default_factory=list)
    target_skills: List[str] = field(default_factory=list)
    target_companies: List[str] = field(default_factory=list)
    target_industry: Optional[str] = None
    career_stage: Optional[str] = None
    extracted_keywords: List[str] = field(default_factory=list)
    confidence_score: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        """Converts the parsed goal to a dictionary for serialization."""
        return asdict(self)


# -----------------------------------------------------------------------------
# RULE-BASED LEXICONS & PATTERNS
# -----------------------------------------------------------------------------

# 1. Functional Domain Lexicons
FUNCTION_KEYWORDS: Dict[str, Set[str]] = {
    "Consulting": {
        "consulting", "consultant", "advisory", "strategy", "case", "cases",
        "transformation", "management consulting", "due diligence", "framework",
        "restructuring", "change management", "commercial diligence", "market sizing"
    },
    "Finance": {
        "finance", "financial", "banking", "investment banking", "private equity",
        "fp&a", "equity research", "valuation", "lbo", "m&a", "capital",
        "underwriting", "portfolio", "credit", "asset management", "dcf", "hedge fund",
        "venture capital", "vc", "corporate finance"
    },
    "Marketing": {
        "marketing", "marketer", "brand", "branding", "growth marketing",
        "product marketing", "pmm", "seo", "social media", "content",
        "retention", "acquisition", "cac", "ltv", "campaign", "advertising",
        "gtm", "go-to-market", "lifecycle marketing"
    },
    "Human Resources": {
        "hr", "human resources", "recruiting", "recruiter", "talent", "people ops",
        "hrbp", "compensation", "benefits", "learning and development", "l&d",
        "culture", "dei", "onboarding", "staffing", "talent acquisition"
    },
    "Operations": {
        "operations", "supply chain", "logistics", "lean", "six sigma",
        "procurement", "sourcing", "fulfillment", "manufacturing", "warehouse",
        "revops", "revenue operations", "inventory", "freight", "process optimization"
    },
    "Product Management": {
        "product management", "product manager", "pm", "apm", "roadmap",
        "prd", "user stories", "backlog", "features", "wireframing", "scrum",
        "agile", "product strategy", "growth pm", "tech pm"
    },
    "Business Analytics": {
        "analytics", "business analytics", "analyst", "bi", "business intelligence",
        "sql", "tableau", "power bi", "snowflake", "insights", "metrics",
        "looker", "reporting", "dashboard", "data analysis", "data analytics"
    },
    "IT": {
        "it", "information technology", "devops", "cloud", "aws", "azure",
        "cybersecurity", "cyber", "infrastructure", "systems admin", "network",
        "networking", "pmp", "sysadmin", "terraform", "kubernetes", "sre"
    },
    "Sales": {
        "sales", "account executive", "ae", "sdr", "bdr", "business development",
        "pre-sales", "solutions consultant", "deals", "quota", "pipeline",
        "client acquisition", "enterprise sales", "prospecting"
    }
}

# 2. Known Roles by Standard Title (Ordered multi-word first for greedy match)
KNOWN_ROLES: List[str] = [
    # Multi-word specific titles
    "Senior Management Consultant", "Management Consultant", "Strategy Consultant",
    "Life Sciences Consultant", "Technology Consultant", "Due Diligence Consultant",
    "Investment Banking Analyst", "Investment Banking Associate", "Investment Banker",
    "Private Equity Analyst", "Private Equity Associate", "Financial Analyst",
    "FP&A Manager", "Corporate Development Associate", "Venture Capital Associate",
    "Product Marketing Manager", "Growth Marketing Director", "Growth Marketer",
    "Performance Marketing Manager", "Brand Strategy Lead", "Technical Recruiter",
    "Talent Acquisition Specialist", "HRBP Lead", "Total Rewards Analyst",
    "Supply Chain Manager", "Supply Chain Director", "Operations Manager",
    "RevOps Manager", "Lean Six Sigma Leader", "Principal Product Manager",
    "Technical Product Manager", "AI Product Manager", "Growth Product Manager",
    "Associate Product Manager", "Product Manager", "Business Intelligence Analyst",
    "Data Analyst", "Data Strategy Manager", "Risk Analytics Specialist",
    "Cloud Solutions Architect", "DevOps Engineer", "Cybersecurity Engineer",
    "Systems Administrator", "Enterprise Account Executive", "Solutions Consultant",
    "Business Development Representative", "Sales Development Representative",
    # Single-word / Core role titles
    "Consultant", "Marketer", "Recruiter", "Architect", "Analyst"
]

# Role abbreviations and common shorthand
ROLE_SYNONYMS: Dict[str, str] = {
    "pm": "Product Manager",
    "apm": "Associate Product Manager",
    "pmm": "Product Marketing Manager",
    "sdr": "Sales Development Representative",
    "bdr": "Business Development Representative",
    "ae": "Enterprise Account Executive",
    "ib analyst": "Investment Banking Analyst",
    "pe analyst": "Private Equity Analyst",
    "data scientist": "Data Analyst",
    "bi analyst": "Business Intelligence Analyst",
    "strategy consulting": "Strategy Consultant",
    "management consulting": "Management Consultant",
    "investment banking": "Investment Banking Analyst"
}

# 3. Functional and Technical Skills (Multi-word phrases prioritized)
KNOWN_SKILLS: List[str] = [
    # Consulting
    "Case Interviews", "Market Sizing", "Growth Strategy", "Commercial Due Diligence",
    "Executive Presentation", "Digital Transformation", "Change Management", "Due Diligence",
    # Finance
    "Financial Modeling", "DCF Valuation", "Valuation", "M&A", "LBO", "Equity Research",
    "Asset Management", "Capital Budgeting", "FP&A", "Portfolio Management", "Deal Sourcing",
    # Marketing
    "Product Marketing", "Growth Marketing", "Go-To-Market", "GTM", "Brand Strategy",
    "SEO", "Social Media", "Lifecycle Marketing", "Paid Acquisition", "Content Strategy",
    # HR
    "Technical Recruiting", "Executive Search", "HRBP", "Total Rewards", "Talent Acquisition",
    "People Analytics", "Compensation & Benefits", "DE&I", "Learning and Development",
    # Operations
    "Supply Chain", "Lean Six Sigma", "Logistics", "Process Optimization", "Procurement",
    "Strategic Sourcing", "RevOps", "Inventory Management", "Warehouse Management",
    # Product Management
    "Product Roadmaps", "User Research", "Agile", "Scrum", "PRD", "Feature Prioritization",
    "A/B Testing", "Wireframing", "Product Strategy", "Backlog Grooming",
    # Analytics
    "SQL", "Tableau", "Power BI", "Python", "Predictive Modeling", "Looker",
    "Snowflake", "ETL", "Dashboard Design", "Data Analysis", "Metrics",
    # IT / Engineering
    "Cloud Architecture", "AWS", "Azure", "DevOps", "Kubernetes", "Docker",
    "Terraform", "Cybersecurity", "CI/CD", "Linux", "Network Security",
    # Sales
    "Enterprise Sales", "B2B Sales", "Contract Negotiation", "Solutions Architecture",
    "Salesforce", "Outbound Prospecting", "Pipeline Management"
]

# 4. Target Companies (synthetic dataset companies + major target employers)
KNOWN_COMPANIES: List[str] = [
    # Dataset synthetic companies
    "Apex Strategy Partners", "Apex Strategy", "Trinity Advisory Group", "Trinity Advisory",
    "Beacon Digital Consulting", "Beacon Digital", "Vanguard Strategy Partners", "Vanguard Strategy",
    "Granite Peak Capital", "BlueHaven Partners", "Crestline Financial", "Starlight Media",
    "Catalyst Health", "Aura Consumer Brands", "Pulse Mobile", "Nexus Tech", "Veritas Robotics",
    "Summit Logistics", "Skyward Aerospace", "AeroTech", "Horizon Cloud", "SecurePoint Cyber",
    "Solara Power", "GreenGrid Energy", "Ironclad Defense", "Novis Bio", "Meridian Therapeutics",
    # Industry benchmark companies often mentioned by students
    "McKinsey", "Bain", "BCG", "Goldman Sachs", "Morgan Stanley", "J.P. Morgan", "JPMorgan",
    "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Salesforce", "Deloitte",
    "PwC", "EY", "KPMG"
]

# 5. Career Stage & Intent Regular Expression Patterns
STAGE_PATTERNS: List[Tuple[str, str]] = [
    ("Internship", r"\b(intern|internship|summer intern|summer analyst|co-op)\b"),
    ("Entry-Level", r"\b(entry[- ]level|new grad|fresh grad|recent graduate|graduate program|junior analyst|starting out)\b"),
    ("Career Transition", r"\b(break into|breaking into|pivot|pivoting|transition|transitioning|switch|switching into|cross-functional)\b"),
    ("Mid-Senior", r"\b(senior|lead|manager|director|head of|vp|partner|executive|principal)\b")
]


# -----------------------------------------------------------------------------
# ANALYZER CLASS
# -----------------------------------------------------------------------------

class CareerGoalAnalyzer:
    """
    Rule-based, explainable parser that extracts structured career intent
    from student natural language text using Python regex and dictionary matching.
    """

    def __init__(self):
        # Precompile stage regex patterns for speed
        self._compiled_stages = [
            (stage_name, re.compile(pattern, re.IGNORECASE))
            for stage_name, pattern in STAGE_PATTERNS
        ]

    @staticmethod
    def _normalize(text: str) -> str:
        """Converts text to cleaned lowercase string."""
        return " ".join(text.strip().lower().split())

    @staticmethod
    def _extract_tokens(text: str) -> Set[str]:
        """Extracts alphanumeric word tokens from normalized text."""
        return set(re.findall(r"\b[a-z0-9+#.&/-]+\b", text.lower()))

    def _extract_primary_function(self, text_lower: str, tokens: Set[str]) -> Tuple[Optional[str], float, List[str]]:
        """
        Calculates domain keyword frequency across the 9 domain functions.
        Returns: (best_function, confidence, matched_keywords)
        """
        domain_scores: Dict[str, int] = {}
        domain_matches: Dict[str, List[str]] = {}

        for domain, keywords in FUNCTION_KEYWORDS.items():
            matched = []
            score = 0
            # Direct domain name mention receives strong weight (+3)
            if domain.lower() in text_lower:
                score += 3
                matched.append(domain.lower())

            # Keyword matching
            for kw in keywords:
                if " " in kw:
                    # Multi-word phrase check in text
                    if kw in text_lower:
                        score += 2
                        matched.append(kw)
                else:
                    # Single word token check
                    if kw in tokens:
                        score += 1
                        matched.append(kw)

            if score > 0:
                domain_scores[domain] = score
                domain_matches[domain] = matched

        if not domain_scores:
            return None, 0.0, []

        # Find domain with highest score
        best_domain = max(domain_scores.items(), key=lambda item: item[1])[0]
        max_score = domain_scores[best_domain]
        # Heuristic confidence scaling (capped at 1.0)
        confidence = min(1.0, round(max_score / 5.0, 2))
        return best_domain, confidence, domain_matches[best_domain]

    def _extract_skills(self, text_lower: str, tokens: Set[str]) -> List[str]:
        """Identifies skills from the known skills lexicon."""
        matched_skills: List[str] = []
        for skill in KNOWN_SKILLS:
            skill_lower = skill.lower()
            if " " in skill_lower or "&" in skill_lower or "/" in skill_lower:
                if skill_lower in text_lower:
                    matched_skills.append(skill)
            else:
                # Single-token skill (e.g. "SQL", "Python", "AWS")
                if skill_lower in tokens:
                    matched_skills.append(skill)
        return matched_skills

    def _extract_roles(self, text_lower: str) -> List[str]:
        """Identifies job titles / roles from the known roles lexicon and abbreviations."""
        matched_roles: List[str] = []
        for role in KNOWN_ROLES:
            role_lower = role.lower()
            # Boundary check using regex to avoid substring collisions
            pattern = r"\b" + re.escape(role_lower) + r"\b"
            if re.search(pattern, text_lower):
                matched_roles.append(role)

        # Check abbreviations and synonyms
        for abbr, standard_role in ROLE_SYNONYMS.items():
            pattern = r"\b" + re.escape(abbr) + r"\b"
            if re.search(pattern, text_lower) and standard_role not in matched_roles:
                matched_roles.append(standard_role)

        # Remove generic single-word roles if a more specific multi-word role was already matched
        # (e.g., keep "Management Consultant" and discard duplicate "Consultant")
        specific_roles = [r for r in matched_roles if len(r.split()) > 1]
        if specific_roles:
            filtered = []
            for r in matched_roles:
                if len(r.split()) == 1:
                    # Check if covered by any multi-word role
                    if not any(r.lower() in spec.lower() for spec in specific_roles):
                        filtered.append(r)
                else:
                    filtered.append(r)
            return filtered

        return matched_roles

    def _extract_companies(self, text_lower: str) -> List[str]:
        """Identifies target companies from the known company list."""
        matched_companies: List[str] = []
        for comp in KNOWN_COMPANIES:
            comp_lower = comp.lower()
            pattern = r"\b" + re.escape(comp_lower) + r"\b"
            if re.search(pattern, text_lower):
                matched_companies.append(comp)

        # Deduplicate parent/child substrings (e.g., prefer "Apex Strategy Partners" over "Apex Strategy")
        deduped = []
        for c in matched_companies:
            if not any(c != other and c in other for other in matched_companies):
                deduped.append(c)
        return deduped

    def _extract_career_stage(self, text_lower: str) -> Optional[str]:
        """Classifies student career stage / intent level."""
        for stage_name, pattern in self._compiled_stages:
            if pattern.search(text_lower):
                return stage_name
        return None

    def analyze(self, goal: str) -> ParsedCareerGoal:
        """
        Parses a natural-language career goal string and returns a structured ParsedCareerGoal.
        Safely handles empty, vague, or short queries.
        """
        cleaned_goal = goal.strip() if goal else ""
        if not cleaned_goal:
            return ParsedCareerGoal(
                raw_goal="",
                primary_function=None,
                target_roles=[],
                target_skills=[],
                target_companies=[],
                target_industry=None,
                career_stage=None,
                extracted_keywords=[],
                confidence_score=0.0
            )

        text_lower = self._normalize(cleaned_goal)
        tokens = self._extract_tokens(text_lower)

        # 1. Primary Function
        best_func, func_conf, func_keywords = self._extract_primary_function(text_lower, tokens)

        # 2. Skills
        skills = self._extract_skills(text_lower, tokens)

        # 3. Roles
        roles = self._extract_roles(text_lower)

        # 4. Companies
        companies = self._extract_companies(text_lower)

        # 5. Career Stage / Intent
        stage = self._extract_career_stage(text_lower)

        # 6. Distinct keywords set for explainability
        all_keywords = sorted(list(set(func_keywords + [s.lower() for s in skills] + [r.lower() for r in roles])))

        # 7. Aggregate confidence
        confidence = func_conf
        if skills:
            confidence = min(1.0, round(confidence + 0.15 * len(skills), 2))
        if roles:
            confidence = min(1.0, round(confidence + 0.20 * len(roles), 2))
        if companies:
            confidence = min(1.0, round(confidence + 0.10, 2))

        return ParsedCareerGoal(
            raw_goal=cleaned_goal,
            primary_function=best_func,
            target_roles=roles,
            target_skills=skills,
            target_companies=companies,
            target_industry=None,  # Function is the primary domain in this dataset
            career_stage=stage,
            extracted_keywords=all_keywords,
            confidence_score=confidence
        )
