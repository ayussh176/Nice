# PostgreSQL Database & Data Seeding Engine: Insurance Retention Platform

This directory contains the database schema, data seeding engine, and data contracts for the Insurance Policy Renewal & Lapse Prevention platform.

---

## 1. Quick Start: Running PostgreSQL with Docker

### Step 1: Start PostgreSQL Container
```bash
# Start PostgreSQL 16 container in the background:
docker compose up -d
```
The Docker Compose setup mounts [database/schema.sql](file:///d:/Blockchain/nice/database/schema.sql) to automatically initialize all tables, indexes, and views on first launch.

### Step 2: Install Python Dependencies
```bash
pip install -r database/requirements.txt
```

### Step 3: Run the Database Seeding Engine
```bash
# Seed the primary 10,000-policy dataset:
python database/seed_database.py
```

### Optional: Clean Reset in Development
```bash
# Truncates tables and re-seeds cleanly:
python database/seed_database.py --reset
```

---

## 2. Database Connection Details

Environment configuration is read from `.env` (template: [.env.example](file:///d:/Blockchain/nice/.env.example)):

| Variable | Default Value | Description |
|---|---|---|
| `POSTGRES_HOST` | `localhost` | Database server host |
| `POSTGRES_PORT` | `5432` | Database port |
| `POSTGRES_DB` | `insurance_retention` | Database name |
| `POSTGRES_USER` | `postgres` | Superuser username |
| `POSTGRES_PASSWORD` | `postgres` | Superuser password |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/insurance_retention` | Full SQLAlchemy / Psycopg2 URI |

---

## 3. Entity-Relationship (ER) Architecture

```mermaid
erDiagram
    CUSTOMERS ||--o{ POLICIES : "holds (1:N)"
    POLICIES ||--|| PAYMENT_SUMMARY : "has (1:1)"
    POLICIES ||--|| CLAIM_SUMMARY : "has (1:1)"
    POLICIES ||--o{ RISK_SCORES : "evaluated by (1:N)"
    POLICIES ||--o{ RENEWAL_OFFERS : "receives (1:N)"
    POLICIES ||--o{ INTERACTIONS : "contact log (1:N)"
    POLICIES ||--o{ RETENTION_ACTIONS : "action items (1:N)"
```

---

## 4. Primary Dataset Mapping & Normalization

The primary dataset [insurance_policy_renewal_10000.csv](file:///d:/Blockchain/nice/data/insurance_policy_renewal_10000.csv) contains **10,000 rows** and is normalized as follows:

| Target Table | Columns Populated | Row Count | Ingestion Logic |
|---|---|---|---|
| `customers` | `customer_id`, `customer_age`, `customer_gender`, `customer_occupation`, `customer_city`, `customer_state`, `customer_postal_code`, `customer_country`, `customer_tenure_years` | **8,223** | Deduplicated by `customer_id`. Preserves unique policyholders. |
| `policies` | `policy_id`, `customer_id`, `policy_type`, `policy_start_date`, `policy_end_date`, `premium_amount`, `previous_premium_amount`, `premium_increase_pct`, `payment_frequency`, `policy_status`, `days_to_renewal`, `renewal_date` | **10,000** | Preserves all 10,000 unique policies. Dates normalized to `YYYY-MM-DD`. |
| `payment_summary`| `policy_id`, `has_late_payments`, `late_payment_count`, `avg_days_late`, `on_time_payment_rate` | **10,000** | 1:1 aggregated payment performance record. |
| `claim_summary` | `policy_id`, `num_claims_last_year`, `total_claim_amount_last_year`, `rejected_claims`, `claims_approved` | **10,000** | 1:1 aggregated claims metrics record. |
| `risk_scores` | `risk_id`, `policy_id`, `risk_score`, `risk_level`, `model_version` | **10,000** | Seeded with baseline reference scores (`model_version = 'historical_csv'`). |
| `renewal_offers`| `offer_id`, `policy_id`, `offer_type`, `offer_amount`, `offer_sent`, `offer_accepted`, `model_version` | **10,000** | Seeded with baseline offers (`model_version = 'historical_csv'`). |
| `interactions` | `interaction_id`, `customer_id`, `policy_id`, `interaction_type`, `channel`, `interaction_status`, `notes` | **0** | Reserved for runtime customer interaction logging. |
| `retention_actions` | `action_id`, `customer_id`, `policy_id`, `action_type`, `priority`, `reason`, `status`, `assigned_to` | **0** | Reserved for Smart Retention Action Center engine. |

---

## 5. Machine Learning Views Reference

| View Name | Target Consumer | Purpose & Fields |
|---|---|---|
| `policy_model_features` | **Data Science & ML Pipeline** | Base pre-renewal feature vector with 21 legitimate predictors (Zero Leakage). |
| `lapse_model_training_data` | **Lapse-Risk Model Training** | Contains all 21 features + `renewed` ground truth target & `lapse_target` (0/1). |
| `lapse_model_inference_data`| **Production Batch Inference** | Pure pre-renewal feature vector without targets or post-outcome fields. |

### Leakage Columns Excluded from Model Features:
- `renewed`, `policy_status`, `offer_accepted`, `renewal_date`, `risk_score`, `renewal_offer_type`, `renewal_offer_amount`.

---

## 6. Frontend-Ready Views Reference

| View Name | Primary UI Component | Key Fields & Sorting |
|---|---|---|
| `upcoming_renewals` | **Portfolio & Renewal Calendar** | Policy and customer details, risk metrics, and offer amounts sorted by `days_to_renewal ASC`. |
| `customer_360` | **Customer 360 View** | Unified portfolio summary (total policies, active premium, claim metrics, on-time rate). |
| `retention_action_queue`| **Smart Action Center** | Prioritized action items (`CRITICAL`, `HIGH`, `MEDIUM`) with suggested retention interventions. |
| `lapsed_customers` | **Lapsed Customer Win-Back** | Lapsed accounts with past policy value and claim performance for win-back campaigns. |

---

## 7. SQL Verification Queries

```sql
-- 1. Verify exact counts across all tables
SELECT 'customers' AS table_name, COUNT(*) AS count FROM customers
UNION ALL
SELECT 'policies', COUNT(*) FROM policies
UNION ALL
SELECT 'payment_summary', COUNT(*) FROM payment_summary
UNION ALL
SELECT 'claim_summary', COUNT(*) FROM claim_summary
UNION ALL
SELECT 'risk_scores', COUNT(*) FROM risk_scores
UNION ALL
SELECT 'renewal_offers', COUNT(*) FROM renewal_offers;

-- 2. Verify exact counts across all views (must all return 10,000)
SELECT 'policy_model_features' AS view_name, COUNT(*) AS count FROM policy_model_features
UNION ALL
SELECT 'lapse_model_training_data', COUNT(*) FROM lapse_model_training_data
UNION ALL
SELECT 'lapse_model_inference_data', COUNT(*) FROM lapse_model_inference_data
UNION ALL
SELECT 'upcoming_renewals', COUNT(*) FROM upcoming_renewals;

-- 3. Verify zero orphan records
SELECT 
    (SELECT COUNT(*) FROM policies WHERE customer_id NOT IN (SELECT customer_id FROM customers)) AS orphan_policies,
    (SELECT COUNT(*) FROM payment_summary WHERE policy_id NOT IN (SELECT policy_id FROM policies)) AS orphan_payments,
    (SELECT COUNT(*) FROM claim_summary WHERE policy_id NOT IN (SELECT policy_id FROM policies)) AS orphan_claims;
```
