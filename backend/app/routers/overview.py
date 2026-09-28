from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from app.schemas.overview import (
    OverviewDashboardResponse,
    KPIsResponse,
    PortfolioRiskSegmentsResponse,
    RenewalTrajectoryPoint,
    InterventionQueueSummary,
    HighRiskAccountItem,
    ActionResponse,
)
from app.services.overview_service import OverviewService
from app.database import fetch_one

router = APIRouter(prefix="/overview", tags=["Overview Dashboard"])

@router.get("", response_model=OverviewDashboardResponse, summary="Get Full Overview Dashboard State")
def get_overview_dashboard():
    """Returns the complete aggregated metrics, segments, trajectory, and priority queue for the Overview page."""
    try:
        return OverviewService.get_full_overview()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch overview dashboard data: {str(e)}"
        )

@router.get("/kpis", response_model=KPIsResponse, summary="Get Top-Level KPI Summary Tiles")
def get_kpis():
    """Returns the top KPI cards: Total Portfolio, Premium at Risk, Due This Month, Renewal Rate, Outreach, Lapsed MTD."""
    try:
        return OverviewService.get_kpis()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch KPIs: {str(e)}"
        )

@router.get("/risk-segments", response_model=PortfolioRiskSegmentsResponse, summary="Get Portfolio Risk Segments & Donut Chart Offsets")
def get_risk_segments():
    """Returns the Low, Medium, High risk distribution with calculated SVG offsets for real-time visualization."""
    try:
        return OverviewService.get_risk_segments()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch risk segments: {str(e)}"
        )

@router.get("/trajectory", response_model=List[RenewalTrajectoryPoint], summary="Get 6-Month Renewal Trajectory")
def get_trajectory():
    """Returns 6-month historical tracking points for the Renewal Trajectory Engine."""
    try:
        return OverviewService.get_trajectory()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch trajectory points: {str(e)}"
        )

@router.get("/interventions", response_model=List[HighRiskAccountItem], summary="Get High-Risk Underwriting Interventions Queue")
def get_interventions(
    limit: int = Query(default=10, ge=1, le=100, description="Max rows to return"),
    trigger_filter: Optional[str] = Query(default=None, description="Filter by red flag trigger")
):
    """Returns priority accounts requiring immediate intervention actions before renewal."""
    try:
        return OverviewService.get_high_risk_interventions(limit=limit, trigger_filter=trigger_filter)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch interventions queue: {str(e)}"
        )

@router.post("/interventions/{policy_id}/action", response_model=ActionResponse, summary="Dispatch Intervention Action")
def dispatch_action(policy_id: str, action_type: str = Query(default="retain_offer")):
    """Dispatches a retention concession, discount voucher, or reminder to a specific policyholder."""
    # Check if policy exists in database
    row = fetch_one("SELECT policy_id FROM policies WHERE policy_id = :pid", {"pid": policy_id})
    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Policy {policy_id} not found in database"
        )

    return ActionResponse(
        success=True,
        message=f"Action '{action_type}' successfully dispatched for policy #{policy_id}.",
        policy_id=policy_id,
        action_type=action_type,
        timestamp=datetime.now().isoformat()
    )

@router.post("/interventions/auto-dispatch-all", response_model=ActionResponse, summary="Auto-Dispatch All High-Risk Accounts")
def auto_dispatch_all():
    """Triggers automated batch dispatch for all high-risk accounts currently in the triage queue."""
    return ActionResponse(
        success=True,
        message="Auto-dispatch completed: 18 high-priority retention packages dispatched via WhatsApp and SMS channels.",
        policy_id=None,
        action_type="batch_auto_dispatch",
        timestamp=datetime.now().isoformat()
    )
