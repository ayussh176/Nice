from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class RiskExecutiveMetrics(BaseModel):
    total_premium_at_risk: float
    critical_policies_count: int
    projected_cycle_increase: float
    critical_churn_ratio_pct: float
    churn_ratio_delta: float
    total_portfolio_count: int
    low_risk_count: int
    low_risk_pct: float
    medium_risk_count: int
    medium_risk_pct: float
    high_risk_count: int
    high_risk_pct: float
    engine_version: str
    precision_pct: float
    last_batch_run: str

class TriageQueueCard(BaseModel):
    policy_id: str
    customer_id: str
    customer_name: str
    customer_avatar: Optional[str] = None
    policy_type: str
    annual_premium: float
    risk_score: int
    risk_level: str
    days_to_renewal: int
    days_late: int
    primary_trigger_category: str
    primary_driver_text: str

class RiskFactorAttribution(BaseModel):
    name: str
    detail: str
    points: int
    severity: str

class PrescribedWorkflow(BaseModel):
    recommended_channel: str
    channel_rationale: str
    approved_counter_offer: str
    offer_details: str
    retention_probability_pct: int
    whatsapp_message_preview: str

class PolicyRiskInspection(BaseModel):
    policy_id: str
    customer_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    customer_avatar: Optional[str] = None
    city: str
    state: str
    policy_type: str
    annual_premium: float
    premium_increase_pct: float
    days_to_renewal: int
    renewal_date: str
    tenure_years: float
    risk_score: int
    risk_level: str
    on_time_payment_rate: float
    late_payment_count: int
    num_claims: int
    rejected_claims: int
    ai_explanation_headline: str
    ai_explanation_summary: str
    attribution_factors: List[RiskFactorAttribution]
    prescribed_workflow: PrescribedWorkflow

class DeployOfferRequest(BaseModel):
    custom_message: Optional[str] = None
    channel: str = "WhatsApp"
