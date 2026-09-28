from fastapi import APIRouter, Query, Path, Body
from typing import Optional, List
from app.schemas.portfolio import (
    PortfolioSummary,
    CalendarDayStat,
    ScheduledPolicyCard,
    PolicyRosterResponse,
    WhatsAppPingRequest,
)
from app.services.portfolio_service import PortfolioService

router = APIRouter(prefix="/portfolio", tags=["Portfolio & Renewals"])

@router.get("/summary", response_model=PortfolioSummary)
def get_portfolio_summary():
    """Retrieve executive summary and hazard exposure for portfolio renewals."""
    return PortfolioService.get_summary()

@router.get("/calendar", response_model=List[CalendarDayStat])
def get_calendar():
    """Retrieve day-by-day renewal matrix and hazard levels for monthly calendar."""
    return PortfolioService.get_calendar_matrix()

@router.get("/scheduled-renewals", response_model=List[ScheduledPolicyCard])
def get_scheduled_renewals(
    day: int = Query(28, description="Day of month to inspect scheduled renewals for")
):
    """Retrieve scheduled policy renewal cards for a specific date (WhatsApp actions only)."""
    return PortfolioService.get_scheduled_renewals(target_day=day)

@router.get("/policies", response_model=PolicyRosterResponse)
def get_policy_roster(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    lob: Optional[str] = Query(None, description="Line of business filter: Health, Motor, Life, Home"),
    risk: Optional[str] = Query(None, description="Risk level filter: HIGH, MEDIUM, LOW")
):
    """Retrieve filterable, paginated master policy retention ledger."""
    return PortfolioService.get_policy_roster(
        page=page,
        limit=limit,
        search=search,
        lob=lob,
        risk_level=risk
    )

@router.post("/policies/{policy_id}/whatsapp-ping")
def send_whatsapp_ping(
    policy_id: str = Path(..., description="Target policy ID"),
    payload: WhatsAppPingRequest = Body(WhatsAppPingRequest())
):
    """Dispatch WhatsApp retention ping to the policyholder (voice calls disabled)."""
    return PortfolioService.send_whatsapp_ping(policy_id, payload.message)
