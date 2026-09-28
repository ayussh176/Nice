# ML Data Contract: 20,000 Customer-Policy Primary Dataset

## 1. System Architecture & Information Flow

```
+--------------------------------------------------------------------------------------------------+
|                                    PostgreSQL Database                                           |
|                                                                                                  |
|   Source Dataset: data/insurance_policies_20000.csv (20,000 Records)                             |
|          |                                                                                       |
|          v                                                                                       |
|   [ Normalized Tables ]                                                                          |
|   policy_products (200) ──> customer_policies (20,000) <── customers (20,000)                    |
|                                    ├── payment_summary (20,000)                                  |
|                                    └── claim_summary (20,000)                                    |
|          |                                                                                       |
|          v                                                                                       |
|   [ Model Feature & Inference Views ]                                                            |
|   policy_model_features / lapse_model_inference_data (20,000 Rows)                                |
|          |                                                                                       |
|          +─────────────────────────────────────────┐                                             |
|          |                                         |                                             |
|          v                                         v                                             |
|   [ Lapse Risk Model ]                 [ Renewal Offer Model ]                                   |
|          |                                         |                                             |
|          v                                         v                                             |
|   Table: risk_scores                   Table: renewal_offers                                     |
|          |                                         |                                             |
|          +────────────────────┬────────────────────+                                             |
|                               |                                                                  |
|                               v                                                                  |
|                     [ React Frontend UI ]                                                        |
|     (Portfolio Calendar, High-Risk Watchlist, Action Center, Database Explorer)                  |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Model Input Contract: `policy_model_features` (20,000 Rows)

The `policy_model_features` view produces **exactly 20,000 rows** (1 row per customer policy contract).

### Feature Dictionary

| # | Feature Name | PostgreSQL Type | Nullable | Domain / Value Range | Description |
|---|---|---|---|---|---|
| 1 | `customer_policy_id` | `INT` | **No** (PK) | Auto-generated ID | Unique contract record ID |
| 2 | `customer_id` | `VARCHAR(30)` | **No** (FK) | `CUST000001` - `CUST020000` | Unique customer ID |
| 3 | `policy_id` | `VARCHAR(30)` | **No** (FK) | `P001` - `P200` | Catalog product template ID |
| 4 | `policy_name` | `VARCHAR(100)` | **No** | 200 product titles | Product plan title |
| 5 | `policy_type` | `VARCHAR(50)` | **No** | Catalog category | Product type / plan |
| 6 | `customer_age` | `INT` | **No** | 18 – 85 years | Policyholder age |
| 7 | `customer_gender` | `VARCHAR(20)` | **No** | `Male`, `Female`, `Other` | Policyholder gender |
| 8 | `customer_occupation` | `VARCHAR(100)` | Yes | Professions | Policyholder occupation |
| 9 | `customer_tenure_years`| `NUMERIC(5,2)` | **No** | 0.1 – 15.0 years | Customer lifetime tenure |
| 10 | `premium_amount` | `NUMERIC(12,2)` | **No** | Currency | Current term premium amount |
| 11 | `previous_premium_amount` | `NUMERIC(12,2)`| Yes | Currency | Prior cycle premium amount |
| 12 | `premium_increase_pct` | `NUMERIC(8,4)`| **No** | Rate | Premium price inflation rate |
| 13 | `payment_frequency` | `VARCHAR(20)` | **No** | `Annual`, `Monthly`, etc. | Billing frequency |
| 14 | `days_to_renewal` | `INT` | **No** | Integer days | Days until renewal expiration |
| 15 | `has_late_payments` | `BOOLEAN` | **No** | `TRUE` / `FALSE` | Delinquency indicator |
| 16 | `late_payment_count` | `INT` | **No** | $\ge 0$ | Count of delayed installments |
| 17 | `avg_days_late` | `NUMERIC(8,2)` | **No** | $\ge 0.00$ | Mean delay duration |
| 18 | `on_time_payment_rate` | `NUMERIC(5,2)` | **No** | $0.00 - 100.00$ | Percentage on-time performance |
| 19 | `num_claims_last_year` | `INT` | **No** | $\ge 0$ | Filed claims count |
| 20 | `total_claim_amount_last_year` | `NUMERIC(14,2)` | **No** | Currency | Aggregate indemnity payout |
| 21 | `rejected_claims` | `INT` | **No** | $\ge 0$ | Denied claims count |
| 22 | `claims_approved` | `INT` | **No** | $\ge 0$ | Approved claims count |

---

## 3. Data Leakage Prevention

The `lapse_model_inference_data` view strictly omits post-decision target variables:
- `policy_status` (target outcome)
- `risk_score` (model prediction)
- `renewal_offer_type`, `renewal_offer_amount`, `offer_accepted` (post-inference actions)