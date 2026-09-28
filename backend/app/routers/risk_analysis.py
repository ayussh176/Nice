from fastapi import APIRouter, Query, Path, Body, HTTPException
from typing import Optional, List
from app.schemas.risk_analysis import (
    RiskExecutiveMetrics,
    TriageQueueCard,
    PolicyRiskInspection,
    DeployOfferRequest,
)
from app.services.risk_service import RiskService

router = APIRouter(prefix="/risk-analysis", tags=["Lapse Risk Analysis"])

@router.get("/metrics", response_model=RiskExecutiveMetrics)
def get_executive_metrics():
    """Retrieve top-level executive metrics for Lapse Risk Analysis dashboard."""
    return RiskService.get_executive_metrics()

@router.get("/queue", response_model=List[TriageQueueCard])
def get_triage_queue(
    filter_type: str = Query("all", description="Filter tabs: all, late_pay, disputed_claim, hike_shock"),
    search: Optional[str] = Query(None, description="Search by Policy ID, Customer ID, or City")
):
    """Retrieve priority triage queue of critical hazard policies."""
    return RiskService.get_triage_queue(filter_type=filter_type, search=search)

@router.get("/policies/{policy_id}", response_model=PolicyRiskInspection)
def get_policy_inspection(
    policy_id: str = Path(..., description="Target policy ID for deep-dive analysis")
):
    """
    Retrieve explainable lapse risk analysis (Gemini API) and 
    recommended retention workflow (OpenRouter Nemotron 3.5 Lightning).
    Strictly WhatsApp channel — voice calls removed.
    """
    inspection = RiskService.get_policy_risk_inspection(policy_id)
    if not inspection:
        raise HTTPException(status_code=404, detail=f"Policy {policy_id} not found")
    return inspection

@router.post("/policies/{policy_id}/deploy-offer")
def deploy_retention_offer(
    policy_id: str = Path(..., description="Policy ID to deploy offer for"),
    payload: DeployOfferRequest = Body(DeployOfferRequest())
):
    """Deploy targeted counter-offer strictly via WhatsApp."""
    return RiskService.deploy_retention_offer(policy_id, payload.custom_message)
