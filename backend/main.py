"""
Alumni Connector Bot — Minimal FastAPI Backend
Exposes career goal analysis and explainable alumni matchmaking as HTTP REST APIs.
"""

import os
import sys
from typing import Any, Dict, List, Optional

# Ensure project root and backend directories are in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
for p in (current_dir, parent_dir):
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, Field
except ImportError:
    # Graceful fallback shim allowing the module and handlers to be imported and tested
    # even before 'pip install -r backend/requirements.txt' is run in the environment.
    class BaseModel:
        def __init__(self, **data):
            for k, v in data.items():
                setattr(self, k, v)

        def dict(self):
            return self.__dict__

    def Field(default=None, **kwargs):
        return default

    class FastAPI:
        def __init__(self, **kwargs):
            self.title = kwargs.get("title", "Alumni Connector Bot API")
            self.routes = []

        def post(self, path):
            def decorator(func):
                return func
            return decorator

        def get(self, path):
            def decorator(func):
                return func
            return decorator

        def add_middleware(self, *args, **kwargs):
            pass

    class CORSMiddleware:
        pass


try:
    from backend.matching.matching_engine import AlumniMatchingEngine
    from backend.matching.goal_analyzer import CareerGoalAnalyzer
except ImportError:
    from matching.matching_engine import AlumniMatchingEngine
    from matching.goal_analyzer import CareerGoalAnalyzer


# ---------------------------------------------------------------------------
# FastAPI Application Initialization
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Alumni Connector Bot API",
    description="Explainable Alumni Matchmaking & Career Goal Analysis API",
    version="1.0.0"
)

# Enable CORS for local and web frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize singletons for CareerGoalAnalyzer and AlumniMatchingEngine
analyzer = CareerGoalAnalyzer()
engine = AlumniMatchingEngine()


# ---------------------------------------------------------------------------
# Pydantic Request & Response Schemas
# ---------------------------------------------------------------------------

class GoalAnalysisRequest(BaseModel):
    career_goal: str = Field(..., description="Student's free-text career ambition or target domain")


class MatchRequest(BaseModel):
    career_goal: str = Field(default="", description="Student's free-text career ambition")
    selected_field: Optional[str] = Field(default="", description="Selected academic/career discipline")
    top_k: int = Field(default=5, description="Maximum number of alumni to return")
    strict_filter: bool = Field(default=False, description="Strictly limit matches to the selected field")


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    """Health check and API discovery route."""
    return {
        "service": "Alumni Connector Bot API",
        "status": "online",
        "endpoints": {
            "analyze_goal": "POST /api/analyze-goal",
            "match": "POST /api/match"
        }
    }


@app.post("/api/analyze-goal")
def analyze_goal(request: GoalAnalysisRequest) -> Dict[str, Any]:
    """
    Analyzes a student's natural-language career goal and returns structured intent parameters.
    """
    parsed = analyzer.analyze(request.career_goal)
    return parsed.to_dict()


@app.post("/api/match")
def match(request: MatchRequest) -> Dict[str, Any]:
    """
    Analyzes the career goal, passes the structured intent to the matching engine,
    and returns the structured goal alongside ranked alumni matches.
    """
    # 1. Analyze the student's career goal
    parsed_goal = analyzer.analyze(request.career_goal)

    # 2. Match alumni using structured goal and optional selected field
    matched_results = engine.match_structured(
        parsed_goal=parsed_goal,
        selected_field=request.selected_field,
        top_k=request.top_k,
        strict_filter=request.strict_filter
    )

    # 3. Format alumni profiles for frontend consumption
    alumni_list = [res.to_dict() for res in matched_results]

    return {
        "analyzed_goal": parsed_goal.to_dict(),
        "alumni": alumni_list,
        "matches": alumni_list,
        "total_matches": len(alumni_list)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
