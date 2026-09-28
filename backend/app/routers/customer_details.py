from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from app.schemas.customer import CustomerDirectoryResponse, CustomerDossierResponse, ActionDispatchResponse
from app.services.customer_service import CustomerService

router = APIRouter(prefix="/customers", tags=["Customer Details & Roster"])

@router.get("", response_model=CustomerDirectoryResponse)
def get_customer_directory(
    search: Optional[str] = Query(None, description="Search by customer name, customer ID, or policy ID"),
    risk_tier: Optional[str] = Query(None, description="Filter by risk tier (All Tiers, High Risk, Medium Risk, Low Risk)"),
    lob: Optional[str] = Query(None, description="Filter by line of business / product name"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    """
    Returns paginated customer retention directory from real database records,
    with risk scoring, telemetry, and priority status.
    """
    return CustomerService.get_customer_directory(
        search=search,
        risk_tier=risk_tier,
        lob=lob,
        page=page,
        limit=limit
    )

@router.get("/{identifier}/dossier", response_model=CustomerDossierResponse)
def get_customer_dossier(identifier: str):
    """
    Returns full 360-degree inspection dossier for a selected customer/policy.
    Integrates Gemini API for explainable actuarial risk factor attribution
    and NVIDIA Nemotron (OpenRouter) for prescribed retention intervention.
    """
    return CustomerService.get_customer_dossier(identifier)

@router.post("/{policy_id}/whatsapp", response_model=ActionDispatchResponse)
def dispatch_whatsapp(policy_id: str):
    """
    Dispatches targeted WhatsApp message with personalized retention offer link.
    Note: Voice calls are disabled; strictly WhatsApp outreach.
    """
    return CustomerService.dispatch_whatsapp_action(policy_id)

@router.post("/{policy_id}/ping", response_model=ActionDispatchResponse)
def dispatch_smart_ping(policy_id: str):
    """
    Dispatches automated smart renewal reminder ping with instant 1-click renewal link.
    """
    return CustomerService.dispatch_smart_ping(policy_id)

@router.post("/{policy_id}/intervene", response_model=ActionDispatchResponse)
def apply_intervention(policy_id: str, discount_pct: Optional[float] = Query(12.0)):
    """
    Deploys counter-offer retention discount voucher directly to policy term.
    """
    return CustomerService.apply_intervention(policy_id, discount_pct=discount_pct)
