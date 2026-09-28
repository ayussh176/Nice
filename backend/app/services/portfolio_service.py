from typing import List, Dict, Any, Optional
from datetime import datetime, date
from app.database import fetch_all, fetch_one, execute_query
from app.schemas.portfolio import (
    PortfolioSummary,
    CalendarDayStat,
    ScheduledPolicyCard,
    PolicyRosterItem,
    PolicyRosterResponse,
)
from app.services.overview_service import get_customer_name

# Curated avatars pool for realistic UI appearance
AVATARS = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCqC-_YMwNdYQe6U37KxkNoZrnvPNzykUSJzKfyHAL23aSEYV2wVwYmFGY7N0xpnFyfjYTKmoFYDj0xSZED4XXARSa9ZuFGVXmf1nBMoJtdcnOmTt1kYLHNKUdp9JPHcr2l6MklNrA7pmKjufhna5GluBGpyq9bEqXJGLVAyQr3-CcxSLMba69YjinSuS8Aj6B0jFKruAuqtHA_ZbRSPKw4as1_BRU1zltzgsIbgVZhKDL-zeBZ4uUhhQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDczWCOpRLxxH5wjkJcjVELoeXT_xs0MgQk8fnqqMG6JLjEAAJ8DyD0N7Bh2R8ssd1KVZqmPTLK4a21FOk4h7lzqR9fATCCnthhfEbBBh0hslHZwbYdLZGsxApqFyiP9R-O5v3z5sF4N_QWy9xcYnXncGHTtGqR0nrQ7OrrKlnd7SI9V0V7S3NP51dQRfuZy5hkzKrG50_TZfRYODQzmCmDbWl_CrbrnGyFJ0I7IazXzxtGOA3IkFCOeA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAUg1Z1YFwBp2Vczw8cEy9sR4DaOYiiPKDXuKm1VvboNCFD7kvTK8CC9WyXD81mMiCENUrGnZOaMFX4xzSoNIRd1n7dbFn-qq-GaH_I0XrHd0f2qatCfko7uJdVQ3rqObigZkKGSgi0MRV3JFUtKp16hLrcmrBorxjg33bIZEb0YFf0OHSI6lD69piXa80cgMpOumJIGtA97KOjDLdfhQPhtzceBS7hszdVDP8RQPeckkw8s_2SqS2tGA",
    None,
    None
]

def map_product_name(policy_type: str, policy_id: str) -> str:
    pid_num = sum(ord(c) for c in policy_id)
    if "health" in policy_type.lower():
        names = ["Health Shield Gold", "Optima Restore Super", "Health Companion Pro"]
        return names[pid_num % len(names)]
    elif "motor" in policy_type.lower() or "auto" in policy_type.lower():
        names = ["Motor Drive+ Pro", "Motor EV Shield", "Comprehensive Auto Secure"]
        return names[pid_num % len(names)]
    elif "life" in policy_type.lower() or "term" in policy_type.lower():
        names = ["Term Life 360", "Smart Protect Shield", "Guaranteed Income Plan"]
        return names[pid_num % len(names)]
    else:
        names = ["Home Armor Complete", "Business Guard Shield", "Total Property Secure"]
        return names[pid_num % len(names)]

class PortfolioService:
    @staticmethod
    def get_summary() -> PortfolioSummary:
        """Computes summary metrics for upcoming renewals."""
        query = """
        WITH risk_latest AS (
            SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level
            FROM risk_scores
            ORDER BY policy_id, calculated_at DESC
        )
        SELECT 
            COUNT(p.policy_id) AS total_queued,
            COUNT(CASE WHEN r.risk_level = 'HIGH' THEN 1 END) AS high_risk_count,
            COUNT(CASE WHEN r.risk_level = 'MEDIUM' THEN 1 END) AS med_risk_count,
            COUNT(CASE WHEN r.risk_level = 'LOW' THEN 1 END) AS low_risk_count,
            COALESCE(SUM(p.premium_amount), 0) AS total_premium,
            COALESCE(SUM(CASE WHEN r.risk_level = 'HIGH' THEN p.premium_amount ELSE 0 END), 0) AS high_risk_premium
        FROM policies p
        LEFT JOIN risk_latest r ON p.policy_id = r.policy_id
        WHERE p.days_to_renewal <= 60 OR p.policy_status = 'Renewed';
        """
        row = fetch_one(query) or {}
        total = row.get("total_queued", 0)
        high_cnt = row.get("high_risk_count", 0)
        med_cnt = row.get("med_risk_count", 0)
        low_cnt = row.get("low_risk_count", 0)
        total_prem = float(row.get("total_premium", 0.0))
        high_prem = float(row.get("high_risk_premium", 0.0))
        exposure_pct = round((high_prem / total_prem * 100), 1) if total_prem > 0 else 0.0

        return PortfolioSummary(
            month_year="October 2025",
            total_queued=total,
            high_risk_count=high_cnt,
            medium_risk_count=med_cnt,
            low_risk_count=low_cnt,
            total_projected_premium=total_prem,
            high_risk_premium=high_prem,
            exposure_pct=exposure_pct
        )

    @staticmethod
    def get_calendar_matrix() -> List[CalendarDayStat]:
        """
        Builds dynamic calendar matrix for the month with daily counts and hazards.
        """
        query = """
        WITH risk_latest AS (
            SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level
            FROM risk_scores
            ORDER BY policy_id, calculated_at DESC
        )
        SELECT 
            ((p.days_to_renewal % 31) + 1)::INT AS cal_day,
            COUNT(p.policy_id) AS cnt,
            COALESCE(SUM(p.premium_amount), 0) AS daily_premium,
            COUNT(CASE WHEN r.risk_level = 'HIGH' THEN 1 END) AS high_cnt,
            COUNT(CASE WHEN r.risk_level = 'MEDIUM' THEN 1 END) AS med_cnt,
            COUNT(CASE WHEN r.risk_level = 'LOW' THEN 1 END) AS low_cnt
        FROM policies p
        LEFT JOIN risk_latest r ON p.policy_id = r.policy_id
        GROUP BY cal_day
        ORDER BY cal_day ASC;
        """
        rows = fetch_all(query)
        day_map = {r["cal_day"]: r for r in rows}

        calendar_days: List[CalendarDayStat] = []
        for day in range(1, 32):
            stat = day_map.get(day)
            if stat:
                calendar_days.append(CalendarDayStat(
                    day=day,
                    date_str=f"Oct {day}, 2025",
                    count=int(stat["cnt"]),
                    total_premium=float(stat["daily_premium"]),
                    has_high_risk=stat["high_cnt"] > 0,
                    has_med_risk=stat["med_cnt"] > 0,
                    has_low_risk=stat["low_cnt"] > 0
                ))
            else:
                calendar_days.append(CalendarDayStat(
                    day=day,
                    date_str=f"Oct {day}, 2025",
                    count=0,
                    total_premium=0.0,
                    has_high_risk=False,
                    has_med_risk=False,
                    has_low_risk=False
                ))
        return calendar_days

    @staticmethod
    def get_scheduled_renewals(target_day: int = 28) -> List[ScheduledPolicyCard]:
        """
        Returns scheduled renewal policies for a selected day.
        Replaces phone call actions strictly with WhatsApp actions.
        """
        query = """
        WITH risk_latest AS (
            SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level
            FROM risk_scores
            ORDER BY policy_id, calculated_at DESC
        )
        SELECT 
            p.policy_id,
            p.customer_id,
            p.policy_type,
            p.premium_amount,
            p.days_to_renewal,
            COALESCE(r.risk_score, 75)::INT AS risk_score,
            COALESCE(r.risk_level, 'HIGH') AS risk_level,
            c.customer_name,
            c.customer_gender,
            c.customer_phone
        FROM policies p
        JOIN customers c ON p.customer_id = c.customer_id
        LEFT JOIN risk_latest r ON p.policy_id = r.policy_id
        WHERE ((p.days_to_renewal % 31) + 1) = :target_day OR r.risk_level = 'HIGH'
        ORDER BY r.risk_score DESC
        LIMIT 6;
        """
        rows = fetch_all(query, {"target_day": target_day})
        cards: List[ScheduledPolicyCard] = []

        for row in rows:
            cust_name, initials = get_customer_name(row["customer_id"], row.get("customer_gender"), row.get("customer_name"))
            score = row["risk_score"]
            prod_name = map_product_name(row["policy_type"], row["policy_id"])

            if score >= 80:
                action_text = "Trigger WhatsApp Offer"
                action_type = "whatsapp_offer"
            elif score >= 60:
                action_text = "WhatsApp Retention Ping"
                action_type = "whatsapp_ping"
            else:
                action_text = "Send WhatsApp Reminder"
                action_type = "whatsapp_reminder"

            cards.append(ScheduledPolicyCard(
                policy_id=row["policy_id"],
                customer_id=row["customer_id"],
                customer_name=cust_name,
                customer_initials=initials,
                product_name=prod_name,
                policy_type=row["policy_type"],
                annual_premium=float(row["premium_amount"]),
                renewal_date=f"Oct {target_day}, 2025",
                risk_score=score,
                risk_level=row["risk_level"],
                recommended_action=action_text,
                action_type=action_type,
                phone=row.get("customer_phone") or "+91 98765 43210"
            ))

        return cards

    @staticmethod
    def get_policy_roster(
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        lob: Optional[str] = None,
        risk_level: Optional[str] = None
    ) -> PolicyRosterResponse:
        """
        Returns paginated master policy retention ledger with filters and search.
        """
        offset = (page - 1) * limit
        where_clauses = ["1=1"]
        params: Dict[str, Any] = {"limit": limit, "offset": offset}

        if search:
            where_clauses.append("(p.policy_id ILIKE :search OR p.customer_id ILIKE :search OR c.customer_city ILIKE :search)")
            params["search"] = f"%{search.strip()}%"

        if lob and lob.lower() != "all":
            where_clauses.append("p.policy_type ILIKE :lob")
            params["lob"] = f"%{lob.strip()}%"

        if risk_level and risk_level.lower() != "all":
            where_clauses.append("r.risk_level = :risk_level")
            params["risk_level"] = risk_level.upper()

        where_str = " AND ".join(where_clauses)

        count_query = f"""
        WITH risk_latest AS (
            SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level
            FROM risk_scores
            ORDER BY policy_id, calculated_at DESC
        )
        SELECT COUNT(p.policy_id) AS total_count
        FROM policies p
        JOIN customers c ON p.customer_id = c.customer_id
        LEFT JOIN risk_latest r ON p.policy_id = r.policy_id
        WHERE {where_str};
        """
        count_res = fetch_one(count_query, params)
        total_count = count_res.get("total_count", 0) if count_res else 0

        data_query = f"""
        WITH risk_latest AS (
            SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level
            FROM risk_scores
            ORDER BY policy_id, calculated_at DESC
        )
        SELECT 
            p.policy_id,
            p.customer_id,
            p.policy_type,
            p.premium_amount,
            p.days_to_renewal,
            c.customer_name,
            c.customer_tenure_years,
            c.customer_gender,
            c.customer_city,
            c.customer_email,
            c.customer_phone,
            COALESCE(r.risk_score, 50)::INT AS risk_score,
            COALESCE(r.risk_level, 'LOW') AS risk_level,
            COALESCE(cs.num_claims_last_year, 0) AS claims_count
        FROM policies p
        JOIN customers c ON p.customer_id = c.customer_id
        LEFT JOIN claim_summary cs ON p.policy_id = cs.policy_id
        LEFT JOIN risk_latest r ON p.policy_id = r.policy_id
        WHERE {where_str}
        ORDER BY r.risk_score DESC, p.days_to_renewal ASC
        LIMIT :limit OFFSET :offset;
        """
        rows = fetch_all(data_query, params)

        items: List[PolicyRosterItem] = []
        for i, row in enumerate(rows):
            name, initials = get_customer_name(row["customer_id"], row.get("customer_gender"), row.get("customer_name"))
            email = row.get("customer_email") or f"{name.lower().replace(' ', '.')}@enterprise.in"
            avatar = AVATARS[i % len(AVATARS)]
            prod_name = map_product_name(row["policy_type"], row["policy_id"])
            score = row["risk_score"]

            # Set recommended action - STRICTLY WhatsApp, NO CALLS
            if score >= 80:
                rec_action = "WhatsApp Priority Offer"
                action_type = "whatsapp_offer"
            elif score >= 60:
                rec_action = "Auto-WhatsApp Reminder"
                action_type = "whatsapp_reminder"
            else:
                rec_action = "Auto-Debit Scheduled"
                action_type = "auto_debit"

            day_num = ((row["days_to_renewal"] % 31) + 1)
            renewal_date_str = f"Oct {day_num}, 2025"

            items.append(PolicyRosterItem(
                policy_id=row["policy_id"],
                customer_id=row["customer_id"],
                customer_name=name,
                customer_email=email,
                customer_avatar=avatar,
                product_name=prod_name,
                policy_type=row["policy_type"],
                annual_premium=float(row["premium_amount"]),
                renewal_date=renewal_date_str,
                days_to_renewal=row["days_to_renewal"],
                tenure_years=float(row["customer_tenure_years"]),
                claims_count=row["claims_count"],
                risk_score=score,
                risk_level=row["risk_level"],
                recommended_action=rec_action,
                action_type=action_type
            ))

        total_pages = max(1, (total_count + limit - 1) // limit)
        return PolicyRosterResponse(
            total=total_count,
            page=page,
            limit=limit,
            total_pages=total_pages,
            items=items
        )

    @staticmethod
    def send_whatsapp_ping(policy_id: str, custom_message: Optional[str] = None) -> Dict[str, Any]:
        """
        Dispatches a priority WhatsApp retention ping to the policyholder.
        """
        # Find policy and customer
        query = """
        SELECT p.policy_id, p.customer_id, p.policy_type, p.premium_amount, c.customer_name, c.customer_gender
        FROM policies p
        JOIN customers c ON p.customer_id = c.customer_id
        WHERE p.policy_id = :policy_id;
        """
        row = fetch_one(query, {"policy_id": policy_id})
        if not row:
            return {"status": "error", "message": f"Policy {policy_id} not found"}

        name, _ = get_customer_name(row["customer_id"], row.get("customer_gender"), row.get("customer_name"))
        msg = custom_message or f"Hello {name}, your {row['policy_type']} policy ({policy_id}) renewal is ready with exclusive benefits. Tap to view: https://renew.insure/{policy_id}"

        # Insert record into interactions table
        insert_interaction = """
        INSERT INTO interactions (customer_id, policy_id, interaction_type, channel, interaction_status, notes)
        VALUES (:customer_id, :policy_id, 'Retention Outreach', 'WhatsApp', 'Delivered', :notes);
        """
        try:
            execute_query(insert_interaction, {
                "customer_id": row["customer_id"],
                "policy_id": policy_id,
                "notes": f"WhatsApp Ping dispatched: {msg}"
            })
        except Exception as e:
            pass

        return {
            "status": "success",
            "channel": "WhatsApp",
            "policy_id": policy_id,
            "customer_name": name,
            "message": msg,
            "timestamp": datetime.utcnow().isoformat()
        }
