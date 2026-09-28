-- =============================================================================
-- INSURANCE POLICY RENEWAL & LAPSE PREVENTION PLATFORM
-- PostgreSQL Database Schema
-- Database: insurance_retention
-- =============================================================================

-- Clean up existing views and tables if rebuilding
DROP VIEW IF EXISTS lapsed_customers CASCADE;
DROP VIEW IF EXISTS retention_action_queue CASCADE;
DROP VIEW IF EXISTS customer_360 CASCADE;
DROP VIEW IF EXISTS high_risk_policies CASCADE;
DROP VIEW IF EXISTS upcoming_renewals CASCADE;
DROP VIEW IF EXISTS policy_model_features CASCADE;

DROP TABLE IF EXISTS retention_actions CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS renewal_offers CASCADE;
DROP TABLE IF EXISTS risk_scores CASCADE;
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- =============================================================================
-- 1. CUSTOMERS TABLE
-- =============================================================================
CREATE TABLE customers (
    id INT GENERATED ALWAYS AS IDENTITY,
    customer_id VARCHAR(30) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    age INT NOT NULL CHECK (age >= 18 AND age <= 120),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    occupation VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(30),
    country VARCHAR(60),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_country_city ON customers(country, city);

-- =============================================================================
-- 2. POLICIES TABLE (Central Hub)
-- =============================================================================
CREATE TABLE policies (
    policy_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(30) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    product VARCHAR(30) NOT NULL CHECK (product IN ('auto', 'home', 'health', 'life', 'travel', 'other')),
    premium NUMERIC(12, 2) NOT NULL CHECK (premium >= 0),
    previous_premium NUMERIC(12, 2) CHECK (previous_premium >= 0),
    payment_frequency VARCHAR(20) NOT NULL CHECK (payment_frequency IN ('monthly', 'quarterly', 'semi-annual', 'annual')),
    start_date DATE NOT NULL,
    renewal_date DATE NOT NULL,
    tenure_years NUMERIC(4, 1) NOT NULL DEFAULT 0.0 CHECK (tenure_years >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'RENEWED', 'LAPSED', 'CANCELLED')),
    lapse_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_policies_customer_id ON policies(customer_id);
CREATE INDEX idx_policies_status_renewal ON policies(status, renewal_date);
CREATE INDEX idx_policies_product ON policies(product);
CREATE INDEX idx_policies_renewal_date ON policies(renewal_date);

-- =============================================================================
-- 3. PAYMENTS TABLE (Historical & Scheduled Installments)
-- =============================================================================
CREATE TABLE payments (
    payment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    policy_id VARCHAR(30) NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    paid_date DATE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PAID', 'LATE', 'MISSED')),
    days_late INT NOT NULL DEFAULT 0 CHECK (days_late >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_policy_id ON payments(policy_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_payments_policy_status ON payments(policy_id, status);

-- =============================================================================
-- 4. CLAIMS TABLE
-- =============================================================================
CREATE TABLE claims (
    claim_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    policy_id VARCHAR(30) NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    claim_date DATE NOT NULL,
    claim_amount NUMERIC(12, 2) NOT NULL CHECK (claim_amount >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('APPROVED', 'REJECTED', 'PENDING')),
    rejection_reason VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claims_policy_id ON claims(policy_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_claim_date ON claims(claim_date);

-- =============================================================================
-- 5. RISK_SCORES TABLE (Lapse-Risk Prediction Model Output)
-- =============================================================================
CREATE TABLE risk_scores (
    risk_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    policy_id VARCHAR(30) NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    risk_score NUMERIC(5, 4) NOT NULL CHECK (risk_score >= 0.0000 AND risk_score <= 1.0000),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    risk_reasons JSONB,
    model_version VARCHAR(30) NOT NULL DEFAULT 'v1.0.0',
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_scores_policy_id ON risk_scores(policy_id);
CREATE INDEX idx_risk_scores_risk_level ON risk_scores(risk_level);
CREATE INDEX idx_risk_scores_calculated_at ON risk_scores(calculated_at DESC);

-- =============================================================================
-- 6. RENEWAL_OFFERS TABLE (Renewal-Offer Recommendation Model Output)
-- =============================================================================
CREATE TABLE renewal_offers (
    offer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    policy_id VARCHAR(30) NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    risk_id INT REFERENCES risk_scores(risk_id) ON DELETE SET NULL,
    offer_type VARCHAR(40) NOT NULL CHECK (offer_type IN ('STANDARD', 'DISCOUNT', 'FLEXIBLE_PAYMENT', 'LOYALTY_BONUS', 'CUSTOM')),
    original_offer_amount NUMERIC(12, 2),
    discount_percentage NUMERIC(5, 2) DEFAULT 0.00 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    installment_available BOOLEAN DEFAULT FALSE,
    no_claim_bonus NUMERIC(5, 2) DEFAULT 0.00 CHECK (no_claim_bonus >= 0 AND no_claim_bonus <= 100),
    offer_reason JSONB,
    recommended BOOLEAN DEFAULT TRUE,
    model_version VARCHAR(30) DEFAULT 'v1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_renewal_offers_policy_id ON renewal_offers(policy_id);
CREATE INDEX idx_renewal_offers_risk_id ON renewal_offers(risk_id);
CREATE INDEX idx_renewal_offers_recommended ON renewal_offers(recommended);

-- =============================================================================
-- 7. INTERACTIONS TABLE
-- =============================================================================
CREATE TABLE interactions (
    interaction_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    policy_id VARCHAR(30) NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    interaction_date DATE NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('PHONE', 'EMAIL', 'SMS', 'WHATSAPP')),
    interaction_type VARCHAR(30) NOT NULL CHECK (interaction_type IN ('RENEWAL_REMINDER', 'OFFER_DISPATCH', 'RETENTION_CALL', 'SUPPORT', 'WIN_BACK')),
    outcome VARCHAR(30) NOT NULL CHECK (outcome IN ('CONNECTED', 'NO_RESPONSE', 'INTERESTED', 'DECLINED', 'RENEWED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interactions_policy_id ON interactions(policy_id);
CREATE INDEX idx_interactions_date ON interactions(interaction_date);
CREATE INDEX idx_interactions_channel ON interactions(channel);

-- =============================================================================
-- 8. RETENTION_ACTIONS TABLE (Smart Retention Action Center)
-- =============================================================================
CREATE TABLE retention_actions (
    action_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    policy_id VARCHAR(30) NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    action_type VARCHAR(40) NOT NULL CHECK (action_type IN ('CALL_CUSTOMER', 'SEND_DISCOUNT_OFFER', 'OFFER_PAYMENT_PLAN', 'AGENT_VISIT', 'WIN_BACK_CAMPAIGN')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    due_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'SKIPPED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_retention_actions_policy_id ON retention_actions(policy_id);
CREATE INDEX idx_retention_actions_status_priority ON retention_actions(status, priority);
CREATE INDEX idx_retention_actions_due_date ON retention_actions(due_date);

-- =============================================================================
-- MODEL FEATURE VIEW: policy_model_features
-- Returns 1 row per policy with pre-aggregated metrics (Zero join multiplication)
-- =============================================================================
CREATE OR REPLACE VIEW policy_model_features AS
WITH pay_agg AS (
    SELECT 
        policy_id,
        COUNT(*)::INT AS total_payments,
        COALESCE(SUM(CASE WHEN status = 'LATE' THEN 1 ELSE 0 END), 0)::INT AS late_payments,
        COALESCE(SUM(CASE WHEN status = 'MISSED' THEN 1 ELSE 0 END), 0)::INT AS missed_payments,
        COALESCE(AVG(CASE WHEN status IN ('LATE', 'MISSED') THEN days_late ELSE 0 END), 0.0)::NUMERIC(6, 2) AS average_days_late
    FROM payments
    GROUP BY policy_id
),
claim_agg AS (
    SELECT 
        policy_id,
        COUNT(*)::INT AS claims_count,
        COALESCE(SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END), 0)::INT AS rejected_claims,
        COALESCE(SUM(claim_amount), 0.00)::NUMERIC(12, 2) AS total_claim_amount
    FROM claims
    GROUP BY policy_id
)
SELECT 
    p.policy_id,
    p.customer_id,
    c.age AS customer_age,
    c.gender AS customer_gender,
    c.occupation AS customer_occupation,
    c.city AS customer_city,
    c.country AS customer_country,
    p.product,
    p.premium,
    p.previous_premium,
    ROUND(
        CASE 
            WHEN p.previous_premium IS NOT NULL AND p.previous_premium > 0 
            THEN ((p.premium - p.previous_premium) / p.previous_premium) * 100.0 
            ELSE 0.00 
        END, 2
    )::NUMERIC(6, 2) AS premium_increase_pct,
    p.payment_frequency,
    p.tenure_years,
    COALESCE(pa.total_payments, 0)::INT AS total_payments,
    COALESCE(pa.late_payments, 0)::INT AS late_payments,
    COALESCE(pa.missed_payments, 0)::INT AS missed_payments,
    COALESCE(pa.average_days_late, 0.0)::NUMERIC(6, 2) AS average_days_late,
    COALESCE(ca.claims_count, 0)::INT AS claims_count,
    COALESCE(ca.rejected_claims, 0)::INT AS rejected_claims,
    COALESCE(ca.total_claim_amount, 0.00)::NUMERIC(12, 2) AS total_claim_amount,
    (p.renewal_date - CURRENT_DATE)::INT AS days_until_renewal,
    p.status AS current_policy_status
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
LEFT JOIN pay_agg pa ON p.policy_id = pa.policy_id
LEFT JOIN claim_agg ca ON p.policy_id = ca.policy_id;

-- =============================================================================
-- FRONTEND VIEW 1: upcoming_renewals
-- =============================================================================
CREATE OR REPLACE VIEW upcoming_renewals AS
SELECT 
    p.policy_id,
    p.customer_id,
    c.full_name AS customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,
    p.product,
    p.premium,
    p.payment_frequency,
    p.renewal_date,
    (p.renewal_date - CURRENT_DATE)::INT AS days_to_renewal,
    p.status AS policy_status,
    r.risk_score,
    r.risk_level,
    r.risk_reasons,
    o.offer_type AS recommended_offer_type,
    o.discount_percentage,
    o.installment_available
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
LEFT JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level, risk_reasons
    FROM risk_scores
    ORDER BY policy_id, calculated_at DESC
) r ON p.policy_id = r.policy_id
LEFT JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, offer_type, discount_percentage, installment_available
    FROM renewal_offers
    WHERE recommended = TRUE
    ORDER BY policy_id, created_at DESC
) o ON p.policy_id = o.policy_id
WHERE p.status IN ('ACTIVE', 'RENEWED');

-- =============================================================================
-- FRONTEND VIEW 2: high_risk_policies (Risk & Premium at Risk)
-- =============================================================================
CREATE OR REPLACE VIEW high_risk_policies AS
SELECT 
    p.policy_id,
    p.customer_id,
    c.full_name AS customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,
    p.product,
    p.premium AS premium_at_risk,
    p.renewal_date,
    r.risk_score,
    r.risk_level,
    r.risk_reasons,
    r.calculated_at
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level, risk_reasons, calculated_at
    FROM risk_scores
    ORDER BY policy_id, calculated_at DESC
) r ON p.policy_id = r.policy_id
WHERE r.risk_level = 'HIGH' AND p.status = 'ACTIVE';

-- =============================================================================
-- FRONTEND VIEW 3: customer_360 (Unified Customer Profile & Portfolio)
-- =============================================================================
CREATE OR REPLACE VIEW customer_360 AS
WITH cust_policies AS (
    SELECT 
        customer_id,
        COUNT(*)::INT AS total_policies_count,
        COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END), 0)::INT AS active_policies_count,
        COALESCE(SUM(CASE WHEN status = 'ACTIVE' THEN premium ELSE 0 END), 0.00)::NUMERIC(12, 2) AS total_active_premium,
        MAX(tenure_years)::NUMERIC(4, 1) AS max_tenure_years
    FROM policies
    GROUP BY customer_id
),
cust_claims AS (
    SELECT 
        p.customer_id,
        COUNT(cl.claim_id)::INT AS total_claims_count,
        COALESCE(SUM(cl.claim_amount), 0.00)::NUMERIC(12, 2) AS total_claims_amount
    FROM policies p
    JOIN claims cl ON p.policy_id = cl.policy_id
    GROUP BY p.customer_id
),
cust_actions AS (
    SELECT 
        p.customer_id,
        COUNT(ra.action_id)::INT AS pending_retention_actions
    FROM policies p
    JOIN retention_actions ra ON p.policy_id = ra.policy_id
    WHERE ra.status = 'PENDING'
    GROUP BY p.customer_id
)
SELECT 
    c.customer_id,
    c.full_name,
    c.email,
    c.phone,
    c.age,
    c.gender,
    c.occupation,
    c.city,
    c.state,
    c.country,
    COALESCE(cp.total_policies_count, 0)::INT AS total_policies_count,
    COALESCE(cp.active_policies_count, 0)::INT AS active_policies_count,
    COALESCE(cp.total_active_premium, 0.00)::NUMERIC(12, 2) AS total_active_premium,
    COALESCE(cp.max_tenure_years, 0.0)::NUMERIC(4, 1) AS tenure_years,
    COALESCE(cc.total_claims_count, 0)::INT AS total_claims_count,
    COALESCE(cc.total_claims_amount, 0.00)::NUMERIC(12, 2) AS total_claims_amount,
    COALESCE(ca.pending_retention_actions, 0)::INT AS pending_retention_actions
FROM customers c
LEFT JOIN cust_policies cp ON c.customer_id = cp.customer_id
LEFT JOIN cust_claims cc ON c.customer_id = cc.customer_id
LEFT JOIN cust_actions ca ON c.customer_id = ca.customer_id;

-- =============================================================================
-- FRONTEND VIEW 4: retention_action_queue (Smart Action Center Queue)
-- =============================================================================
CREATE OR REPLACE VIEW retention_action_queue AS
SELECT 
    ra.action_id,
    ra.policy_id,
    p.customer_id,
    c.full_name AS customer_name,
    c.phone AS customer_phone,
    c.email AS customer_email,
    p.product,
    p.premium,
    p.renewal_date,
    r.risk_score,
    r.risk_level,
    ra.action_type,
    ra.priority,
    ra.due_date,
    ra.reason,
    ra.status,
    ra.created_at
FROM retention_actions ra
JOIN policies p ON ra.policy_id = p.policy_id
JOIN customers c ON p.customer_id = c.customer_id
LEFT JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level
    FROM risk_scores
    ORDER BY policy_id, calculated_at DESC
) r ON p.policy_id = r.policy_id
ORDER BY 
    CASE ra.priority
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
        ELSE 5
    END,
    ra.due_date ASC;

-- =============================================================================
-- FRONTEND VIEW 5: lapsed_customers (Win-Back Opportunities)
-- =============================================================================
CREATE OR REPLACE VIEW lapsed_customers AS
SELECT 
    p.policy_id,
    p.customer_id,
    c.full_name AS customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,
    c.city,
    c.country,
    p.product,
    p.premium AS previous_premium,
    p.tenure_years,
    p.lapse_date,
    p.renewal_date AS original_expiry_date,
    (CURRENT_DATE - p.renewal_date)::INT AS days_since_lapse,
    ro.offer_type AS winback_offer_type,
    ro.discount_percentage AS winback_discount_pct,
    ro.offer_reason AS winback_incentive
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
LEFT JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, offer_type, discount_percentage, offer_reason
    FROM renewal_offers
    ORDER BY policy_id, created_at DESC
) ro ON p.policy_id = ro.policy_id
WHERE p.status = 'LAPSED' OR p.status = 'CANCELLED';
