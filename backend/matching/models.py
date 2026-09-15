"""
Alumni Profile Data Models
Defines typed models for Alumni Profiles and Matchmaking Engine outputs.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class AlumniProfile(BaseModel):
    id: str = Field(..., description="Unique alumni identifier (e.g. ALUM-001)")
    name: str = Field(..., description="Fictional full name")
    is_fictional: bool = Field(True, description="Safety flag confirming synthetic/test record")
    email: str = Field(..., description="Fictional contact email")
    linkedin_url: str = Field(..., description="Fictional LinkedIn profile URL")
    current_role: str = Field(..., description="Current job title")
    company: str = Field(..., description="Company name")
    industry: str = Field(
        ...,
        description="One of: Consulting, Finance, Marketing, Human Resources, Operations, Product Management, Business Analytics, IT, Sales"
    )
    years_of_experience: int = Field(..., ge=0, description="Total years in the workforce")
    location: str = Field(..., description="City and state/country")
    degree: str = Field(..., description="Degree obtained (e.g., B.S., B.B.A., M.S., MBA)")
    major: str = Field(..., description="Field of study")
    graduation_year: int = Field(..., description="Year of graduation")
    skills: List[str] = Field(default_factory=list, description="Key functional and technical skills")
    bio: str = Field(..., description="Narrative summary of career path and focus")
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
    similarity_score: float = Field(..., description="Match confidence score between 0.0 and 1.0")
    match_reasons: List[str] = Field(
        default_factory=list,
        description="Bullet points explaining why this alumnus was matched (for outreach generation)"
    )
