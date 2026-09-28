# InsureRenew Frontend Data Contract (20,000 Records Architecture)

This document defines the contract between the **React Frontend** (`Frontend/src/...`), the **Express Backend API** (`backend/server.js`), and the **PostgreSQL Database** (`database/schema.sql`).

---

## 1. Database & Navigation Structure

The application features:
1. **Retention Dashboard** (`/`)
2. **Portfolio & Renewals** (`/portfolio-renewals`)
3. **Lapse Risk Analysis** (`/lapse-risk-analysis`)
4. **Renewal Offers** (`/renewal-offers`)
5. **Smart Reminders** (`/smart-reminders`)
6. **Customer Details** (`/customer-details`)
7. **Database Explorer** (`/database` & `/data`) — *Interactive PostgreSQL management & live record explorer*

---

## 2. PostgreSQL Tables & Endpoints

| Table | Count | Endpoint | Description |
|---|---|---|---|
| `policy_products` | 200 | `GET /api/database/policy-products` | Plan catalog templates (`P001` - `P200`). |
| `customers` | 20,000 | `GET /api/database/customers` | Customer profiles and tenure. |
| `customer_policies` | 20,000 | `GET /api/database/customer-policies` | Subscriptions, premiums, and renewal days. |
| `payment_summary` | 20,000 | `GET /api/database/payment-summary` | Delinquencies and on-time payment rates. |
| `claim_summary` | 20,000 | `GET /api/database/claim-summary` | Annual claims and payout amounts. |
| `risk_scores` | 0* | `GET /api/database/risk-scores` | ML-generated churn probabilities and levels. |
| `renewal_offers` | 0* | `GET /api/database/renewal-offers` | Targeted discount offers. |
| `interactions` | 0* | `GET /api/database/interactions` | Operational logs. |
| `retention_actions` | 0* | `GET /api/database/retention-actions` | Retention action work items. |

*Initial seed is 0; populated at runtime or by ML inference pipeline.

---

## 3. Database Explorer Feature Specifications

The Database Explorer page (`/database`) provides:
- **Connection Diagnostics**: Live PostgreSQL 16 status, host (`localhost:5433`), Docker engine, latency monitor.
- **Table Metrics Cards**: Real-time counts for all 9 PostgreSQL tables and analytical views.
- **Server-Side Pagination & Search**: Query any table with customizable page sizes (10, 25, 50, 100), column sorting, and multi-field ILIKE filtering.
- **Record Inspector (Customer 360)**: Visual modal rendering joined customer demographics, policy plan, contract terms, payment performance, and claims history.
- **ERD Architecture View**: Interactive relational schema documentation.