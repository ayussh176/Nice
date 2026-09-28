from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class KPIsResponse(BaseModel):
    total_portfolio: int = Field(..., description="Total active policies underwritten")
    total_portfolio_formatted: str
    active_sync_pct: float = Field(default=99.4)
    premium_at_risk: float
    premium_at_risk_formatted: str
    critical_accounts_count: int
    due_this_month: int
    volume_share_pct: float
    renewal_rate: float
    renewal_target: float = 90.0
    renewal_gap: float
    outreach_sent: int
    outreach_total_due: int
    outreach_completed_pct: float
    outreach_pending: int
    lapsed_mtd: int
    lapse_avoided_amount: float
    lapse_avoided_amount_formatted: str
    lapse_avoided_pct: float

class RiskSegment(BaseModel):
    key: str
    label: str
    count: int
    pct: float
    color: str
    stroke_dasharray: str
    stroke_dashoffset: str

class PortfolioRiskSegmentsResponse(BaseModel):
    total_book: int
    segments: List[RiskSegment]

class RenewalTrajectoryPoint(BaseModel):
    month: str
    retained_volume: int
    lapsed_volume: int
    retention_rate_pct: float
    retained_premium_lakhs: float
    lapsed_premium_lakhs: float

class InterventionQueueSummary(BaseModel):
    critical_under_7d_count: int
    critical_under_7d_exposure: str
    elevated_under_14d_count: int

class HighRiskAccountItem(BaseModel):
    policy_id: str
    customer_id: str
    customer_name: str
    customer_initials: str
    lob_name: str
    lob_icon: str
    renewal_due_date: str
    due_in_text: str
    is_critical: bool
    annual_premium: float
    annual_premium_formatted: str
    risk_score: float
    risk_level: str
    primary_trigger: str
    trigger_icon: str
    recommended_action: str

class ActionResponse(BaseModel):
    success: bool
    message: str
    policy_id: Optional[str] = None
    action_type: str
    timestamp: str

class OverviewDashboardResponse(BaseModel):
    kpis: KPIsResponse
    risk_segments: PortfolioRiskSegmentsResponse
    trajectory: List[RenewalTrajectoryPoint]
    intervention_queue: InterventionQueueSummary
    high_risk_accounts: List[HighRiskAccountItem]
    telemetry: Dict[str, Any]
