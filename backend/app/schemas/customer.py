from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CustomerDirectoryItem(BaseModel):
    customer_id: str
    policy_id: str
    customer_name: str
    customer_initials: str
    customer_tier: str
    customer_city: str
    customer_state: str
    policy_type: str
    product_name: str
    sum_insured: float
    premium_amount: float
    previous_premium_amount: float
    premium_increase_pct: float
    renewal_date: str
    days_to_renewal: int
    renewal_urgency: str
    risk_score: int
    risk_level: str
    risk_velocity: str
    payment_grievance_status: str
    late_payment_count: int
    has_late_payments: bool
    grievance_note: str

class CustomerDirectoryResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    items: List[CustomerDirectoryItem]
    attention_count: int

class TimelineEvent(BaseModel):
    id: str
    timestamp: str
    category: str
    title: str
    description: str
    status: str
    icon: str

class LedgerTransaction(BaseModel):
    invoice_id: str
    date: str
    amount: float
    status: str
    payment_method: str
    receipt_url: Optional[str] = None

class ClaimRecord(BaseModel):
    claim_id: str
    date: str
    claim_type: str
    amount_claimed: float
    amount_approved: float
    status: str
    remarks: str

class DocumentItem(BaseModel):
    id: str
    title: str
    category: str
    file_type: str
    size: str
    issued_date: str

class CustomerDossierResponse(BaseModel):
    customer_id: str
    policy_id: str
    customer_name: str
    customer_initials: str
    customer_tier: str
    tenure_years: float
    since_year: int
    city: str
    state: str
    age: int
    occupation: str
    phone: str
    email: str
    policy_type: str
    product_name: str
    premium_amount: float
    previous_premium_amount: float
    premium_increase_pct: float
    renewal_date: str
    days_to_renewal: int
    risk_score: int
    risk_level: str
    risk_velocity: str
    ai_risk_explanation: Dict[str, Any]
    ai_renewal_recommendation: Dict[str, Any]
    timeline: List[TimelineEvent]
    ledger: List[LedgerTransaction]
    claims: List[ClaimRecord]
    documents: List[DocumentItem]

class ActionDispatchResponse(BaseModel):
    success: bool
    message: str
    policy_id: str
    action_type: str
    details: Optional[Dict[str, Any]] = None
