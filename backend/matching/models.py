"""
Alumni Profile Data Models
Defines typed models for Alumni Profiles and Matchmaking Engine outputs.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class AlumniProfile(BaseModel):
    id: str = Field(..., description="Unique alumni identifier (e.g. ALUM-001)")
    name: str = Field(..., description="Fictional full name")
    graduation_year: int = Field(..., description="Year of graduation")
    degree: str = Field(..., description="Degree obtained and major (e.g. MBA in Strategy & Finance)")
    current_company: str = Field(..., description="Current employer company name")
    current_role: str = Field(..., description="Current job title")
    industry: str = Field(..., description="Industry vertical")
    function: str = Field(
        ...,
        description="One of: Consulting, Finance, Marketing, Human Resources, Operations, Product Management, Business Analytics, IT, Sales"
    )
    skills: List[str] = Field(default_factory=list, description="Key functional and technical skills")
    location: str = Field(..., description="City and state/country")
    years_of_experience: int = Field(..., ge=0, description="Total years in the workforce")
    career_summary: str = Field(..., description="Narrative summary of career path and focus")

    # Optional compatibility fields (with defaults)
    company: Optional[str] = Field(None, description="Alias for current_company")
    bio: Optional[str] = Field(None, description="Alias for career_summary")
    major: Optional[str] = Field(None, description="Field of study")
    is_fictional: bool = Field(True, description="Safety flag confirming synthetic/test record")
    email: Optional[str] = Field(None, description="Fictional contact email")
    linkedin_url: Optional[str] = Field(None, description="Fictional LinkedIn profile URL")
    mentorship_topics: List[str] = Field(
        default_factory=list,
        description="Specific topics the alumnus is willing to advise students on"
    )
    preferred_contact_method: str = Field(
        "Virtual Coffee Chat",
        description="Preferred outreach medium (e.g., Email, LinkedIn, Virtual Coffee Chat)"
    )
    availability_status: str = Field(
        "Actively Mentoring",
        description="Current availability status"
    )


class MatchResult(BaseModel):
    alumnus: AlumniProfile
    similarity_score: float = Field(..., ge=0.0, le=1.0, description="Match confidence score between 0.0 and 1.0")
    match_percentage: int = Field(0, ge=0, le=100, description="Match score scaled to percentage (0-100)")
    match_reasons: List[str] = Field(
        default_factory=list,
        description="Bullet points explaining why this alumnus was matched (for outreach generation)"
    )
