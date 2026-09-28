# PostgreSQL Database & Seeding Engine: Insurance Retention Platform

This directory contains the authoritative database schema, data seeding engine, and contracts for the Insurance Policy Renewal & Lapse Prevention platform.

---

## 1. Quick Start: Running PostgreSQL with Docker

### Architecture
```
Windows Host
    |
    └── Docker Desktop
            |
            └── PostgreSQL 16 Alpine Container (insurance_retention_postgres)
                    |
                    └── insurance_retention Database
```

> **Note on Ports**: To avoid conflict with any existing Windows services on port `5432`, Docker PostgreSQL is exposed on **Host Port `5433`** (`5433:5432`). PostgreSQL does **not** need to be installed on Windows.

### Step 1: Start PostgreSQL Container
```bash
docker compose up -d
```

### Step 2: Run the Database Seeding Engine
```bash
python database/seed_database.py
```

### Step 3: Start the Backend API (Node.js/Express)
```bash
cd backend
npm install
npm run dev
```

### Step 4: Start the React Frontend (Vite)
```bash
cd Frontend
npm install
npm run dev
```

Open **`http://localhost:5173/database`** to launch the interactive Database Explorer.

---

## 2. Database Connection Details

Environment configuration is read from `.env`:

| Variable | Value | Description |
|---|---|---|
| `POSTGRES_HOST` | `localhost` | Database host |
| `POSTGRES_PORT` | `5433` | Host port mapped to Docker container (5432 internal) |
| `POSTGRES_DB` | `insurance_retention` | Database name |
| `POSTGRES_USER` | `postgres` | Superuser username |
| `POSTGRES_PASSWORD` | `postgres` | Superuser password |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5433/insurance_retention` | PostgreSQL connection string |
| `BACKEND_PORT` | `3001` | Express Backend port |

---

## 3. Entity-Relationship (ER) Architecture (20K Authoritative)

```mermaid
erDiagram
    POLICY_PRODUCTS ||--o{ CUSTOMER_POLICIES : "catalog plan (1:N)"
    CUSTOMERS ||--o{ CUSTOMER_POLICIES : "holds (1:N)"
    CUSTOMER_POLICIES ||--|| PAYMENT_SUMMARY : "has (1:1)"
    CUSTOMER_POLICIES ||--|| CLAIM_SUMMARY : "has (1:1)"
    CUSTOMER_POLICIES ||--o{ RISK_SCORES : "evaluated by (1:N)"
    CUSTOMER_POLICIES ||--o{ RENEWAL_OFFERS : "receives (1:N)"
    CUSTOMER_POLICIES ||--o{ INTERACTIONS : "operational log (1:N)"
    CUSTOMER_POLICIES ||--o{ RETENTION_ACTIONS : "action queue (1:N)"
```

---

## 4. Authoritative Dataset Mapping (20,000 Records)

Primary source: `data/insurance_policies_20000.csv` (20,000 customer-policy records).

| Target Table | Columns Populated | Initial Seed Count | Ingestion Logic |
|---|---|---|---|
| `policy_products` | `policy_id`, `policy_name`, `policy_type` | **200** | Deduplicated catalog plan templates (`P001`–`P200`). |
| `customers` | `customer_id`, `customer_age`, `customer_gender`, `customer_occupation`, `customer_tenure_years` | **20,000** | Unique customer profiles (`CUST000001`–`CUST020000`). |
| `customer_policies` | `customer_policy_id`, `customer_id`, `policy_id`, `premium_amount`, `previous_premium_amount`, `premium_increase_pct`, `payment_frequency`, `days_to_renewal`, `policy_status` | **20,000** | Active customer policy contracts. |
| `payment_summary` | `customer_policy_id`, `has_late_payments`, `late_payment_count`, `avg_days_late`, `on_time_payment_rate` | **20,000** | 1:1 aggregated payment performance record. |
| `claim_summary` | `customer_policy_id`, `num_claims_last_year`, `total_claim_amount_last_year`, `rejected_claims`, `claims_approved` | **20,000** | 1:1 aggregated claims metrics record. |
| `risk_scores` | `risk_id`, `customer_policy_id`, `risk_score`, `risk_level`, `risk_reasons`, `model_version` | **0** | *Unseeded* — destination for ML Lapse-Risk Model. |
| `renewal_offers` | `offer_id`, `customer_policy_id`, `offer_type`, `offer_amount`, `discount_percentage`, `offer_sent`, `offer_accepted` | **0** | *Unseeded* — destination for Renewal-Offer Model. |
| `interactions` | `interaction_id`, `customer_id`, `customer_policy_id`, `interaction_type`, `channel`, `interaction_status`, `notes` | **0** | Operational customer touchpoints. |
| `retention_actions` | `action_id`, `customer_id`, `customer_policy_id`, `action_type`, `priority`, `reason`, `status`, `assigned_to` | **0** | Retention agent work items. |

---

## 5. Machine Learning & Analytical Views

| View Name | Rows | Description |
|---|---|---|
| `policy_model_features` | **20,000** | Base feature vector joining customers, catalog products, policy contracts, payment summaries, and claim histories without target leakage. |
| `lapse_model_inference_data` | **20,000** | Production inference view for ML scoring models. |
| `portfolio_renewals` | **20,000** | Sorted renewals queue with payment and claims metrics. |
| `retention_dashboard_summary` | **1** | Real-time aggregate KPI metrics across all underwritten policies. |

---

## 6. Backend API Endpoints

- `GET /api/database/health` — Database connection diagnostics & Docker latency.
- `GET /api/database/stats` — Live table and view counts directly from PostgreSQL.
- `GET /api/database/policy-products?page=1&limit=25&search=` — Paginated catalog products.
- `GET /api/database/customers?page=1&limit=25&search=` — Paginated customer profiles.
- `GET /api/database/customer-policies?page=1&limit=25&search=` — Paginated customer contracts.
- `GET /api/database/payment-summary?page=1&limit=25` — Paginated payment summaries.
- `GET /api/database/claim-summary?page=1&limit=25` — Paginated claim summaries.
- `GET /api/database/risk-scores?page=1&limit=25` — Paginated ML risk scores.
- `GET /api/database/renewal-offers?page=1&limit=25` — Paginated renewal offers.
- `GET /api/database/interactions?page=1&limit=25` — Paginated interactions.
- `GET /api/database/retention-actions?page=1&limit=25` — Paginated retention actions.
- `GET /api/database/customer-policy-details/:id` — Complete joined Customer 360 record.
- `GET /api/database/views/:viewName?page=1&limit=25` — Paginated view inspector.