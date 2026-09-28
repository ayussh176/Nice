-- ============================================================
-- Insurance Retention Platform - Authoritative 20K Schema
-- Architecture:
--   policy_products (1:N) customer_policies (N:1) customers
--   customer_policies (1:1) payment_summary
--   customer_policies (1:1) claim_summary
--   customer_policies (1:N) risk_scores
--   customer_policies (1:N) renewal_offers
--   customer_policies (1:N) interactions
--   customer_policies (1:N) retention_actions
-- ============================================================

-- ── Drop views first ────────────────────────────────────────
DROP VIEW IF EXISTS lapse_model_inference_data CASCADE;
DROP VIEW IF EXISTS lapse_model_training_data CASCADE;
DROP VIEW IF EXISTS policy_model_features CASCADE;
DROP VIEW IF EXISTS retention_action_queue CASCADE;
DROP VIEW IF EXISTS smart_reminders_queue CASCADE;
DROP VIEW IF EXISTS customer_360 CASCADE;
DROP VIEW IF EXISTS renewal_offers_dashboard CASCADE;
DROP VIEW IF EXISTS lapse_risk_analysis CASCADE;
DROP VIEW IF EXISTS portfolio_renewals CASCADE;
DROP VIEW IF EXISTS retention_dashboard_summary CASCADE;
DROP VIEW IF EXISTS upcoming_renewals CASCADE;

-- ── Drop tables ─────────────────────────────────────────────
DROP TABLE IF EXISTS retention_actions CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS renewal_offers CASCADE;
DROP TABLE IF EXISTS risk_scores CASCADE;
DROP TABLE IF EXISTS claim_summary CASCADE;
DROP TABLE IF EXISTS payment_summary CASCADE;
DROP TABLE IF EXISTS customer_policies CASCADE;
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS policy_products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- ============================================================
-- 1. POLICY_PRODUCTS (200 catalog templates)
-- ============================================================
CREATE TABLE policy_products (
    policy_id    VARCHAR(30)  PRIMARY KEY,
    policy_name  VARCHAR(100) NOT NULL,
    policy_type  VARCHAR(50)  NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_policy_products_type ON policy_products (policy_type);

-- ============================================================
-- 2. CUSTOMERS (20,000 unique customers)
-- ============================================================
CREATE TABLE customers (
    customer_id           VARCHAR(30)  PRIMARY KEY,
    customer_age          INTEGER,
    customer_gender       VARCHAR(20),
    customer_occupation   VARCHAR(100),
    customer_city         VARCHAR(100),
    customer_state        VARCHAR(100),
    customer_postal_code  VARCHAR(20),
    customer_country      VARCHAR(100),
    customer_tenure_years NUMERIC(5,2),
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_age    ON customers (customer_age);
CREATE INDEX idx_customers_gender ON customers (customer_gender);
CREATE INDEX idx_customers_occupation ON customers (customer_occupation);

-- ============================================================
-- 3. CUSTOMER_POLICIES (20,000 customer contracts)
-- ============================================================
CREATE TABLE customer_policies (
    customer_policy_id    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id           VARCHAR(30)  NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    policy_id             VARCHAR(30)  NOT NULL REFERENCES policy_products(policy_id) ON DELETE RESTRICT,
    policy_start_date     DATE,
    policy_end_date       DATE,
    premium_amount        NUMERIC(12,2),
    previous_premium_amount NUMERIC(12,2),
    premium_increase_pct  NUMERIC(8,4),
    payment_frequency     VARCHAR(20),
    days_to_renewal       INTEGER,
    policy_status         VARCHAR(30)  DEFAULT 'Active',
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_customer_policy UNIQUE (customer_id, policy_id)
);

CREATE INDEX idx_customer_policies_customer_id     ON customer_policies (customer_id);
CREATE INDEX idx_customer_policies_policy_id       ON customer_policies (policy_id);
CREATE INDEX idx_customer_policies_days_to_renewal ON customer_policies (days_to_renewal);
CREATE INDEX idx_customer_policies_status          ON customer_policies (policy_status);

-- ============================================================
-- 4. PAYMENT_SUMMARY (1:1 with customer_policies)
-- ============================================================
CREATE TABLE payment_summary (
    customer_policy_id    INTEGER      PRIMARY KEY REFERENCES customer_policies(customer_policy_id) ON DELETE CASCADE,
    has_late_payments     BOOLEAN      NOT NULL DEFAULT FALSE,
    late_payment_count    INTEGER      NOT NULL DEFAULT 0,
    avg_days_late         NUMERIC(8,2) NOT NULL DEFAULT 0,
    on_time_payment_rate  NUMERIC(5,2) NOT NULL DEFAULT 100
);

-- ============================================================
-- 5. CLAIM_SUMMARY (1:1 with customer_policies)
-- ============================================================
CREATE TABLE claim_summary (
    customer_policy_id           INTEGER       PRIMARY KEY REFERENCES customer_policies(customer_policy_id) ON DELETE CASCADE,
    num_claims_last_year         INTEGER       NOT NULL DEFAULT 0,
    total_claim_amount_last_year NUMERIC(14,2) NOT NULL DEFAULT 0,
    rejected_claims              INTEGER       NOT NULL DEFAULT 0,
    claims_approved              INTEGER       NOT NULL DEFAULT 0
);

-- ============================================================
-- 6. RISK_SCORES (1:N with customer_policies - ML output)
-- ============================================================
CREATE TABLE risk_scores (
    risk_id             INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_policy_id  INTEGER      NOT NULL REFERENCES customer_policies(customer_policy_id) ON DELETE CASCADE,
    risk_score          NUMERIC(5,2),
    risk_level          VARCHAR(20),
    risk_reasons        JSONB,
    model_version       VARCHAR(30)  DEFAULT 'v1.0',
    calculated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_risk_scores_cp_id         ON risk_scores (customer_policy_id);
CREATE INDEX idx_risk_scores_risk_level    ON risk_scores (risk_level);
CREATE INDEX idx_risk_scores_calculated_at ON risk_scores (calculated_at DESC);

-- ============================================================
-- 7. RENEWAL_OFFERS (1:N with customer_policies - ML output)
-- ============================================================
CREATE TABLE renewal_offers (
    offer_id            INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_policy_id  INTEGER      NOT NULL REFERENCES customer_policies(customer_policy_id) ON DELETE CASCADE,
    offer_type          VARCHAR(50),
    offer_amount        NUMERIC(12,2),
    discount_percentage NUMERIC(5,2),
    offer_sent          BOOLEAN      NOT NULL DEFAULT FALSE,
    offer_accepted      BOOLEAN,
    model_version       VARCHAR(30)  DEFAULT 'v1.0',
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_renewal_offers_cp_id      ON renewal_offers (customer_policy_id);
CREATE INDEX idx_renewal_offers_offer_sent ON renewal_offers (offer_sent);

-- ============================================================
-- 8. INTERACTIONS (1:N with customers / customer_policies)
-- ============================================================
CREATE TABLE interactions (
    interaction_id      INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id         VARCHAR(30)  NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    customer_policy_id  INTEGER      REFERENCES customer_policies(customer_policy_id) ON DELETE SET NULL,
    interaction_type    VARCHAR(50),
    channel             VARCHAR(50),
    interaction_status  VARCHAR(30),
    notes               TEXT,
    interaction_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interactions_customer_id ON interactions (customer_id);
CREATE INDEX idx_interactions_cp_id       ON interactions (customer_policy_id);

-- ============================================================
-- 9. RETENTION_ACTIONS (1:N with customers / customer_policies)
-- ============================================================
CREATE TABLE retention_actions (
    action_id           INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id         VARCHAR(30)  NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    customer_policy_id  INTEGER      REFERENCES customer_policies(customer_policy_id) ON DELETE SET NULL,
    action_type         VARCHAR(50),
    priority            VARCHAR(20),
    channel             VARCHAR(50),
    recommended_offer   VARCHAR(100),
    reason              TEXT,
    status              VARCHAR(30)  DEFAULT 'pending',
    assigned_to         VARCHAR(100),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    completed_at        TIMESTAMPTZ
);

CREATE INDEX idx_retention_actions_customer_id ON retention_actions (customer_id);
CREATE INDEX idx_retention_actions_cp_id       ON retention_actions (customer_policy_id);
CREATE INDEX idx_retention_actions_status      ON retention_actions (status);

-- ============================================================
-- VIEWS
-- ============================================================

-- ── policy_model_features (20,000 rows - ML feature base) ───
CREATE VIEW policy_model_features AS
SELECT
    cp.customer_policy_id,
    cp.customer_id,
    cp.policy_id,
    pp.policy_name,
    pp.policy_type,
    cp.premium_amount,
    cp.previous_premium_amount,
    cp.premium_increase_pct,
    cp.payment_frequency,
    cp.days_to_renewal,
    c.customer_age,
    c.customer_gender,
    c.customer_occupation,
    c.customer_city,
    c.customer_state,
    c.customer_tenure_years,
    COALESCE(ps.has_late_payments, FALSE)        AS has_late_payments,
    COALESCE(ps.late_payment_count, 0)           AS late_payment_count,
    COALESCE(ps.avg_days_late, 0)                AS avg_days_late,
    COALESCE(ps.on_time_payment_rate, 100)       AS on_time_payment_rate,
    COALESCE(cs.num_claims_last_year, 0)         AS num_claims_last_year,
    COALESCE(cs.total_claim_amount_last_year, 0) AS total_claim_amount_last_year,
    COALESCE(cs.rejected_claims, 0)              AS rejected_claims,
    COALESCE(cs.claims_approved, 0)              AS claims_approved
FROM customer_policies cp
JOIN customers c ON c.customer_id = cp.customer_id
JOIN policy_products pp ON pp.policy_id = cp.policy_id
LEFT JOIN payment_summary ps ON ps.customer_policy_id = cp.customer_policy_id
LEFT JOIN claim_summary cs ON cs.customer_policy_id = cp.customer_policy_id;

-- ── lapse_model_training_data (includes policy_status outcome) ───
CREATE VIEW lapse_model_training_data AS
SELECT
    pmf.*,
    cp.policy_status
FROM policy_model_features pmf
JOIN customer_policies cp ON cp.customer_policy_id = pmf.customer_policy_id
WHERE cp.policy_status IS NOT NULL;

-- ── lapse_model_inference_data (predictive features, no leakage) ───
CREATE VIEW lapse_model_inference_data AS
SELECT
    customer_policy_id,
    customer_id,
    policy_id,
    policy_name,
    policy_type,
    premium_amount,
    previous_premium_amount,
    premium_increase_pct,
    payment_frequency,
    days_to_renewal,
    customer_age,
    customer_gender,
    customer_occupation,
    customer_tenure_years,
    has_late_payments,
    late_payment_count,
    avg_days_late,
    on_time_payment_rate,
    num_claims_last_year,
    total_claim_amount_last_year,
    rejected_claims,
    claims_approved
FROM policy_model_features;

-- ── retention_dashboard_summary ─────────────────────────────
CREATE VIEW retention_dashboard_summary AS
SELECT
    COUNT(*)                                         AS total_policies,
    COUNT(DISTINCT cp.customer_id)                   AS total_customers,
    COUNT(*) FILTER (WHERE cp.days_to_renewal <= 30) AS renewing_soon,
    COUNT(*) FILTER (WHERE cp.days_to_renewal <= 7)  AS renewing_this_week,
    ROUND(AVG(cp.premium_amount)::NUMERIC, 2)        AS avg_premium,
    SUM(cp.premium_amount)                           AS total_premium_value,
    COUNT(*) FILTER (WHERE rs.risk_level = 'High')   AS high_risk_count,
    COUNT(*) FILTER (WHERE rs.risk_level = 'Medium') AS medium_risk_count,
    COUNT(*) FILTER (WHERE rs.risk_level = 'Low')    AS low_risk_count
FROM customer_policies cp
JOIN customers c ON c.customer_id = cp.customer_id
LEFT JOIN LATERAL (
    SELECT risk_level FROM risk_scores
    WHERE customer_policy_id = cp.customer_policy_id
    ORDER BY calculated_at DESC LIMIT 1
) rs ON TRUE;

-- ── portfolio_renewals ───────────────────────────────────────
CREATE VIEW portfolio_renewals AS
SELECT
    cp.customer_policy_id,
    cp.customer_id,
    c.customer_age,
    c.customer_gender,
    c.customer_occupation,
    pp.policy_id,
    pp.policy_name,
    pp.policy_type,
    cp.premium_amount,
    cp.previous_premium_amount,
    cp.premium_increase_pct,
    cp.payment_frequency,
    cp.days_to_renewal,
    cp.policy_status,
    cp.policy_end_date,
    ps.has_late_payments,
    ps.on_time_payment_rate,
    cs.num_claims_last_year
FROM customer_policies cp
JOIN customers c ON c.customer_id = cp.customer_id
JOIN policy_products pp ON pp.policy_id = cp.policy_id
LEFT JOIN payment_summary ps ON ps.customer_policy_id = cp.customer_policy_id
LEFT JOIN claim_summary cs ON cs.customer_policy_id = cp.customer_policy_id
ORDER BY cp.days_to_renewal ASC NULLS LAST;

-- ── lapse_risk_analysis ──────────────────────────────────────
CREATE VIEW lapse_risk_analysis AS
SELECT
    cp.customer_policy_id,
    cp.customer_id,
    c.customer_age,
    c.customer_occupation,
    pp.policy_id,
    pp.policy_name,
    pp.policy_type,
    cp.premium_amount,
    cp.premium_increase_pct,
    cp.days_to_renewal,
    cp.policy_status,
    ps.has_late_payments,
    ps.late_payment_count,
    ps.avg_days_late,
    ps.on_time_payment_rate,
    cs.num_claims_last_year,
    cs.rejected_claims,
    rs.risk_score,
    rs.risk_level,
    rs.risk_reasons,
    rs.calculated_at AS risk_calculated_at
FROM customer_policies cp
JOIN customers c ON c.customer_id = cp.customer_id
JOIN policy_products pp ON pp.policy_id = cp.policy_id
LEFT JOIN payment_summary ps ON ps.customer_policy_id = cp.customer_policy_id
LEFT JOIN claim_summary cs ON cs.customer_policy_id = cp.customer_policy_id
LEFT JOIN LATERAL (
    SELECT risk_score, risk_level, risk_reasons, calculated_at
    FROM risk_scores WHERE customer_policy_id = cp.customer_policy_id
    ORDER BY calculated_at DESC LIMIT 1
) rs ON TRUE;

-- ── renewal_offers_dashboard ─────────────────────────────────
CREATE VIEW renewal_offers_dashboard AS
SELECT
    ro.offer_id,
    ro.customer_policy_id,
    cp.customer_id,
    pp.policy_id,
    pp.policy_name,
    pp.policy_type,
    cp.premium_amount,
    cp.days_to_renewal,
    ro.offer_type,
    ro.offer_amount,
    ro.discount_percentage,
    ro.offer_sent,
    ro.offer_accepted,
    ro.created_at AS offer_created_at
FROM renewal_offers ro
JOIN customer_policies cp ON cp.customer_policy_id = ro.customer_policy_id
JOIN policy_products pp ON pp.policy_id = cp.policy_id
JOIN customers c ON c.customer_id = cp.customer_id;

-- ── smart_reminders_queue ────────────────────────────────────
CREATE VIEW smart_reminders_queue AS
SELECT
    cp.customer_policy_id,
    cp.customer_id,
    pp.policy_id,
    pp.policy_name,
    pp.policy_type,
    cp.days_to_renewal,
    cp.premium_amount,
    cp.payment_frequency,
    ps.has_late_payments,
    ps.on_time_payment_rate,
    rs.risk_score,
    rs.risk_level,
    CASE
        WHEN cp.days_to_renewal <= 7  THEN 'URGENT'
        WHEN cp.days_to_renewal <= 30 THEN 'HIGH'
        WHEN cp.days_to_renewal <= 60 THEN 'MEDIUM'
        ELSE 'LOW'
    END AS reminder_priority
FROM customer_policies cp
JOIN policy_products pp ON pp.policy_id = cp.policy_id
LEFT JOIN payment_summary ps ON ps.customer_policy_id = cp.customer_policy_id
LEFT JOIN LATERAL (
    SELECT risk_score, risk_level FROM risk_scores
    WHERE customer_policy_id = cp.customer_policy_id ORDER BY calculated_at DESC LIMIT 1
) rs ON TRUE
WHERE cp.days_to_renewal IS NOT NULL
ORDER BY cp.days_to_renewal ASC;

-- ── customer_360 ─────────────────────────────────────────────
CREATE VIEW customer_360 AS
SELECT
    c.customer_id,
    c.customer_age,
    c.customer_gender,
    c.customer_occupation,
    c.customer_city,
    c.customer_state,
    c.customer_country,
    c.customer_tenure_years,
    cp.customer_policy_id,
    pp.policy_id,
    pp.policy_name,
    pp.policy_type,
    cp.premium_amount,
    cp.days_to_renewal,
    cp.policy_status,
    ps.has_late_payments,
    ps.on_time_payment_rate,
    cs.num_claims_last_year,
    cs.total_claim_amount_last_year,
    rs.risk_score,
    rs.risk_level
FROM customers c
JOIN customer_policies cp ON cp.customer_id = c.customer_id
JOIN policy_products pp ON pp.policy_id = cp.policy_id
LEFT JOIN payment_summary ps ON ps.customer_policy_id = cp.customer_policy_id
LEFT JOIN claim_summary cs ON cs.customer_policy_id = cp.customer_policy_id
LEFT JOIN LATERAL (
    SELECT risk_score, risk_level FROM risk_scores
    WHERE customer_policy_id = cp.customer_policy_id ORDER BY calculated_at DESC LIMIT 1
) rs ON TRUE;