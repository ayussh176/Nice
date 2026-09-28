# PostgreSQL Database Documentation: Insurance Retention Platform

## 1. Quick Start with Docker

### Prerequisites
- Docker & Docker Compose installed

### Launch Database
```bash
# 1. Copy environment variables
cp .env.example .env

# 2. Start PostgreSQL container in background
docker compose up -d

# 3. Check logs & health status
docker compose ps
docker compose logs postgres
```

The database container automatically initializes the complete schema and views from [database/schema.sql](file:///d:/Blockchain/nice/database/schema.sql) upon first launch.

### Connect via psql / GUI Client
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `insurance_retention`
- **Username**: `postgres`
- **Password**: `postgres`
- **Connection URL**: `postgresql://postgres:postgres@localhost:5432/insurance_retention`

---

## 2. Entity-Relationship (ER) Architecture

```mermaid
erDiagram
    CUSTOMERS ||--o{ POLICIES : "holds (1:N)"
    POLICIES ||--o{ PAYMENTS : "billed via (1:N)"
    POLICIES ||--o{ CLAIMS : "incurs (1:N)"
    POLICIES ||--o{ RISK_SCORES : "evaluated by (1:N)"
    POLICIES ||--o{ RENEWAL_OFFERS : "receives (1:N)"
    POLICIES ||--o{ INTERACTIONS : "contact history (1:N)"
    POLICIES ||--o{ RETENTION_ACTIONS : "action items (1:N)"

    CUSTOMERS {
        int id PK "Identity"
        varchar customer_id UK "e.g. CUST0001"
        varchar full_name
        varchar email
        varchar phone
        int age
        varchar gender
        varchar occupation
        varchar city
        varchar country
    }

    POLICIES {
        varchar policy_id PK "e.g. POL0001"
        varchar customer_id FK
        varchar product
        numeric premium
        numeric previous_premium
        varchar payment_frequency
        date start_date
        date renewal_date
        numeric tenure_years
        varchar status "ACTIVE, RENEWED, LAPSED, CANCELLED"
        date lapse_date
    }

    PAYMENTS {
        int payment_id PK "Identity"
        varchar policy_id FK
        date due_date
        date paid_date
        numeric amount
        varchar status "PAID, LATE, MISSED"
        int days_late
    }

    CLAIMS {
        int claim_id PK "Identity"
        varchar policy_id FK
        date claim_date
        numeric claim_amount
        varchar status "APPROVED, REJECTED, PENDING"
        varchar rejection_reason
    }

    RISK_SCORES {
        int risk_id PK "Identity"
        varchar policy_id FK
        numeric risk_score "0.0000 - 1.0000"
        varchar risk_level "LOW, MEDIUM, HIGH"
        jsonb risk_reasons
        varchar model_version
    }

    RENEWAL_OFFERS {
        int offer_id PK "Identity"
        varchar policy_id FK
        int risk_id FK
        varchar offer_type
        numeric discount_percentage
        boolean installment_available
        numeric no_claim_bonus
        jsonb offer_reason
        boolean recommended
    }

    INTERACTIONS {
        int interaction_id PK "Identity"
        varchar policy_id FK
        date interaction_date
        varchar channel "PHONE, EMAIL, SMS, WHATSAPP"
        varchar interaction_type
        varchar outcome
        text notes
    }

    RETENTION_ACTIONS {
        int action_id PK "Identity"
        varchar policy_id FK
        varchar action_type
        varchar priority "LOW, MEDIUM, HIGH, CRITICAL"
        date due_date
        varchar reason
        varchar status "PENDING, COMPLETED, SKIPPED"
    }
```

---

## 3. Database Views Reference

| View Name | Primary Consumer | Purpose |
|---|---|---|
| `policy_model_features` | **ML Model Team** | Aggregated, model-ready feature vector for every policy without Cartesian join explosion. |
| `upcoming_renewals` | **React Frontend** | Portfolio & Renewal Calendar showing active policies, expiry countdown, risk levels, and offers. |
| `high_risk_policies` | **React Frontend** | Immediate high-risk watchlist and total calculated premium at risk. |
| `customer_360` | **React Frontend** | Complete 360-degree customer overview (policies, claims, active premium, pending tasks). |
| `retention_action_queue`| **React Frontend** | Smart Action Center queue prioritized by `CRITICAL` -> `HIGH` -> `MEDIUM` -> `LOW`. |
| `lapsed_customers` | **React Frontend** | Lapsed Customer Win-Back center with historical policy metrics and targeted discount packages. |

---

## 4. Key Useful Queries

### 1. Retrieve High-Risk Policies with Total Premium at Risk
```sql
SELECT 
    COUNT(*) AS high_risk_count,
    SUM(premium_at_risk) AS total_premium_at_risk
FROM high_risk_policies;
```

### 2. Fetch Priority Action Queue for Front Desk Agents
```sql
SELECT 
    action_id,
    customer_name,
    customer_phone,
    product,
    priority,
    action_type,
    reason,
    due_date
FROM retention_action_queue
WHERE status = 'PENDING'
ORDER BY 
    CASE priority 
        WHEN 'CRITICAL' THEN 1 
        WHEN 'HIGH' THEN 2 
        WHEN 'MEDIUM' THEN 3 
        ELSE 4 
    END,
    due_date ASC
LIMIT 10;
```

### 3. Customer 360 Profile Lookup
```sql
SELECT * FROM customer_360 WHERE customer_id = 'CUST0016';
```
