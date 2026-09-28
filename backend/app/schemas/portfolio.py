from typing import List, Optional
from pydantic import BaseModel

class PortfolioSummary(BaseModel):
    month_year: str
    total_queued: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    total_projected_premium: float
    high_risk_premium: float
    exposure_pct: float

class CalendarDayStat(BaseModel):
    day: int
    date_str: str
    count: int
    total_premium: float
    has_high_risk: bool
    has_med_risk: bool
    has_low_risk: bool

class ScheduledPolicyCard(BaseModel):
    policy_id: str
    customer_id: str
    customer_name: str
    customer_initials: str
    product_name: str
    policy_type: str
    annual_premium: float
    renewal_date: str
    risk_score: int
    risk_level: str
    recommended_action: str
    action_type: str
    phone: str

class PolicyRosterItem(BaseModel):
    policy_id: str
    customer_id: str
    customer_name: str
    customer_email: str
    customer_avatar: Optional[str] = None
    product_name: str
    policy_type: str
    annual_premium: float
    renewal_date: str
    days_to_renewal: int
    tenure_years: float
    claims_count: int
    risk_score: int
    risk_level: str
    recommended_action: str
    action_type: str

class PolicyRosterResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    items: List[PolicyRosterItem]

class WhatsAppPingRequest(BaseModel):
    message: Optional[str] = None
