# Machine Learning Data Contract: Lapse-Risk & Renewal-Offer Models

## 1. System Architecture & Role of PostgreSQL

PostgreSQL serves as the authoritative single source of truth for the entire Insurance Policy Renewal & Lapse Prevention platform.

```
+-----------------------------------------------------------------------------------------------+
|                                PostgreSQL Database Layer                                      |
|                                                                                               |
|  [ Training Pipeline ]                   [ Batch Inference Pipeline ]                         |
|  View: lapse_model_training_data          View: lapse_model_inference_data / policy_model_features|
|  (Features + Target 'renewed')            (21 Pure Pre-Renewal Features - Zero Leakage)       |
|            |                                           |                                      |
|            v                                           v                                      |
|   +------------------+                       +-------------------+                            |
|   |  Model Training  |                       |  Lapse Prediction |                            |
|   |  & Validation    |                       |  & Offer Engine   |                            |
|   +------------------+                       +---------+---------+                            |
|                                                        |                                      |
|                     +----------------------------------+----------------------------------+   |
|                     |                                                                     |   |
|                     v                                                                     v   |
|         [ Writes Lapse Scores ]                                               [ Writes Offer Recs ]   |
|           Table: risk_scores                                                   Table: renewal_offers  |
+-----------------------------------------------------------------------------------------------+
```

---

## 2. Model Feature Specification (`policy_model_features` & `lapse_model_inference_data`)

The database exposes **21 pre-renewal features** at exactly **1 row per policy** without any row multiplication or synthetic artifacts.

| # | Feature Column | PostgreSQL Type | Nullable | Description & Domain | Sample Value |
|---|---|---|---|---|---|
| 1 | `policy_id` | `VARCHAR(30)` | **No** (PK) | Unique Policy Identifier | `"P00201"` |
| 2 | `customer_id` | `VARCHAR(30)` | **No** (FK) | Unique Customer Identifier | `"CUST00001"` |
| 3 | `customer_age` | `INT` | **No** | Policyholder age in years (21–72) | `29` |
| 4 | `customer_gender` | `VARCHAR(20)` | **No** | Gender (`Male`, `Female`, `Other`) | `"Male"` |
| 5 | `customer_occupation` | `VARCHAR(100)` | Yes | Profession / Occupation | `"Doctor"` |
| 6 | `customer_city` | `VARCHAR(100)` | Yes | City of residence | `"Kolkata"` |
| 7 | `customer_state` | `VARCHAR(50)` | Yes | State / Province | `"West Bengal"` |
| 8 | `customer_country` | `VARCHAR(60)` | Yes | Country | `"India"` |
| 9 | `customer_tenure_years` | `NUMERIC(4,1)` | **No** | Lifetime customer tenure (0.6–8.4 yrs) | `2.7` |
| 10 | `policy_type` | `VARCHAR(30)` | **No** | Product category (`Home`, `Travel`, `Car`, `Health`, `Life`) | `"Life"` |
| 11 | `premium_amount` | `NUMERIC(12,2)` | **No** | Current policy premium (₹4,500 – ₹44,550) | `27250.00` |
| 12 | `previous_premium_amount`| `NUMERIC(12,2)` | Yes | Prior cycle premium amount | `24940.00` |
| 13 | `premium_increase_pct` | `NUMERIC(6,2)` | **No** | Premium price change percentage (-10% to +37.3%) | `9.26` |
| 14 | `payment_frequency` | `VARCHAR(30)` | **No** | Installment schedule (`Monthly`, `Quarterly`, `Half-Yearly`, `Annual`) | `"Annual"` |
| 15 | `days_to_renewal` | `INT` | **No** | Urgency / proximity window in days (12–93 days) | `46` |
| 16 | `has_late_payments` | `BOOLEAN` | **No** | Historical delinquency flag (`True`/`False`) | `False` |
| 17 | `late_payment_count` | `INT` | **No** | Number of late payments in past 12 months (0–12) | `0` |
| 18 | `avg_days_late` | `NUMERIC(6,2)` | **No** | Average delay in payment days (0.0–30.0) | `0.00` |
| 19 | `on_time_payment_rate` | `NUMERIC(6,2)` | **No** | On-time fulfillment percentage (0.0% – 100.0%) | `100.00` |
| 20 | `num_claims_last_year` | `INT` | **No** | Number of claims filed in prior year (0–6) | `3` |
| 21 | `total_claim_amount_last_year`| `NUMERIC(12,2)`| **No**| Aggregate monetary claim amount | `132460.00` |
| 22 | `rejected_claims` | `INT` | **No** | Count of rejected claims (0–4) | `0` |
| 23 | `claims_approved` | `INT` | **No** | Count of approved claims (0–6) | `2` |

---

## 3. Training Contract & Target Variable (`lapse_model_training_data`)

For training, cross-validation, and offline evaluation, models query `lapse_model_training_data`.

### Ground Truth Targets:
- **`renewed`** (`BOOLEAN`):
  - `TRUE`: Customer successfully renewed (65.53% / 6,553 policies).
  - `FALSE`: Policy lapsed (34.47% / 3,447 policies).
- **`lapse_target`** (`INTEGER` binary label):
  - `1`: Lapsed (`renewed = FALSE`)
  - `0`: Renewed (`renewed = TRUE`)

---

## 4. Strict Data Leakage Prevention

The following columns **MUST NEVER** be passed as input features to the lapse-risk or renewal-offer models:

| Excluded Column | Leakage Category | Reason for Strict Prohibition |
|---|---|---|
| `renewed` | **Target Label** | The exact outcome being predicted. |
| `policy_status` | **Target Proxy** | Contains `'Renewed'` or `'Lapsed'`, directly revealing the label. |
| `offer_accepted` | **Post-Event Action** | Only known after the renewal pitch/campaign is executed. |
| `renewal_date` | **Post-Event Timestamp** | Recorded only upon successful renewal completion. |
| `risk_score` | **Output Variable** | Existing dataset baseline score / prediction output. |
| `renewal_offer_type` | **Downstream Decision** | Output of the renewal-offer recommendation engine. |
| `renewal_offer_amount`| **Downstream Decision**| Output of the pricing discount engine. |

The database views `policy_model_features` and `lapse_model_inference_data` automatically enforce this exclusion.

---

## 5. Model Output Contract 1: `risk_scores`

The ML Lapse-Risk pipeline writes predictions into `risk_scores`:

```sql
INSERT INTO risk_scores (policy_id, risk_score, risk_level, risk_reasons, model_version)
VALUES (
    'P00201',
    78.45,
    'HIGH',
    '["Late payment count >= 3", "On-time rate below 65%", "Premium increase > 15%"]'::jsonb,
    'xgb_v1.0.0'
);
```

- **`risk_score`**: `NUMERIC(6,2)` (0.00 to 100.00).
- **`risk_level`**: `'LOW'` (<35.0), `'MEDIUM'` (35.0–65.0), `'HIGH'` (>65.0).
- **`risk_reasons`**: `JSONB` array of human-readable explainability driver strings.
- **`model_version`**: e.g., `'xgb_v1.0.0'`, `'catboost_v1'`.

---

## 6. Model Output Contract 2: `renewal_offers`

The ML Renewal-Offer Recommendation engine writes recommended interventions into `renewal_offers`:

```sql
INSERT INTO renewal_offers (policy_id, offer_type, offer_amount, offer_sent, offer_accepted, model_version)
VALUES (
    'P00201',
    'DISCOUNT_PLUS_INSTALLMENT',
    24500.00,
    TRUE,
    FALSE,
    'offer_rec_v1.0.0'
);
```

- **`offer_type`**: `'LOYALTY_DISCOUNT'`, `'STANDARD_RENEWAL'`, `'DISCOUNT_PLUS_INSTALLMENT'`, `'INSTALLMENT_PLAN'`, `'NO_CLAIM_BENEFIT'`.
- **`offer_amount`**: Recommended adjusted premium amount.
- **`offer_sent`**: `TRUE` when dispatched.
- **`offer_accepted`**: Updated by frontend/agent interaction.
