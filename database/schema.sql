-- =============================================================================
-- INSURANCE POLICY RENEWAL & LAPSE PREVENTION PLATFORM
-- PostgreSQL Database Schema (Authoritative 10,000-Policy Dataset)
-- Database: insurance_retention
-- =============================================================================

-- Clean up existing views and tables if rebuilding
DROP VIEW IF EXISTS lapsed_customers CASCADE;
DROP VIEW IF EXISTS retention_action_queue CASCADE;
DROP VIEW IF EXISTS customer_360 CASCADE;
DROP VIEW IF EXISTS upcoming_renewals CASCADE;
DROP VIEW IF EXISTS lapse_model_inference_data CASCADE;
DROP VIEW IF EXISTS lapse_model_training_data CASCADE;
DROP VIEW IF EXISTS policy_model_features CASCADE;

DROP TABLE IF EXISTS retention_actions CASCADE;
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS renewal_offers CASCADE;
DROP TABLE IF EXISTS risk_scores CASCADE;
DROP TABLE IF EXISTS claim_summary CASCADE;
DROP TABLE IF EXISTS payment_summary CASCADE;
DROP TABLE IF EXISTS policies CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- =============================================================================
-- 1. CUSTOMERS TABLE (Deduplicated Master Customer Profiles)
-- =============================================================================
CREATE TABLE customers (
    customer_id VARCHAR(30) PRIMARY KEY,
    customer_age INT NOT NULL CHECK (customer_age >= 18 AND customer_age <= 120),
    customer_gender VARCHAR(20) NOT NULL CHECK (customer_gender IN ('Male', 'Female', 'Other', 'male', 'female', 'other')),
    customer_occupation VARCHAR(100),
    customer_city VARCHAR(100),
    customer_state VARCHAR(50),
    customer_postal_code VARCHAR(30),
    customer_country VARCHAR(60) DEFAULT 'India',
    customer_tenure_years NUMERIC(4, 1) NOT NULL DEFAULT 0.0 CHECK (customer_tenure_years >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_location ON customers(customer_country, customer_state, customer_city);
CREATE INDEX idx_customers_tenure ON customers(customer_tenure_years);

-- =============================================================================
-- 2. POLICIES TABLE (Central Policy Term Entity)
-- =============================================================================
CREATE TABLE policies (
    policy_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(30) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    policy_type VARCHAR(30) NOT NULL,
    policy_start_date DATE NOT NULL,
    policy_end_date DATE NOT NULL,
    premium_amount NUMERIC(12, 2) NOT NULL CHECK (premium_amount >= 0),
    previous_premium_amount NUMERIC(12, 2) CHECK (previous_premium_amount >= 0),
    premium_increase_pct NUMERIC(6, 2),
    payment_frequency VARCHAR(30) NOT NULL,
    policy_status VARCHAR(30) NOT NULL,
    days_to_renewal INT,
    renewal_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_policies_customer_id ON policies(customer_id);
CREATE INDEX idx_policies_status ON policies(policy_status);
CREATE INDEX idx_policies_type ON policies(policy_type);
CREATE INDEX idx_policies_end_date ON policies(policy_end_date);
CREATE INDEX idx_policies_days_to_renewal ON policies(days_to_renewal);

-- =============================================================================
-- 3. PAYMENT_SUMMARY TABLE (Aggregated Payment Behavior per Policy)
-- =============================================================================
CREATE TABLE payment_summary (
    policy_id VARCHAR(30) PRIMARY KEY REFERENCES policies(policy_id) ON DELETE CASCADE,
    has_late_payments BOOLEAN NOT NULL DEFAULT FALSE,
    late_payment_count INT NOT NULL DEFAULT 0 CHECK (late_payment_count >= 0),
    avg_days_late NUMERIC(6, 2) NOT NULL DEFAULT 0.0 CHECK (avg_days_late >= 0),
    on_time_payment_rate NUMERIC(6, 2) NOT NULL CHECK (on_time_payment_rate >= 0 AND on_time_payment_rate <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_summary_late_flag ON payment_summary(has_late_payments);
CREATE INDEX idx_payment_summary_on_time_rate ON payment_summary(on_time_payment_rate);

-- =============================================================================
-- 4. CLAIM_SUMMARY TABLE (Aggregated Claims History per Policy)
-- =============================================================================
CREATE TABLE claim_summary (
    policy_id VARCHAR(30) PRIMARY KEY REFERENCES policies(policy_id) ON DELETE CASCADE,
    num_claims_last_year INT NOT NULL DEFAULT 0 CHECK (num_claims_last_year >= 0),
    total_claim_amount_last_year NUMERIC(12, 2) NOT NULL DEFAULT 0.0 CHECK (total_claim_amount_last_year >= 0),
    rejected_claims INT NOT NULL DEFAULT 0 CHECK (rejected_claims >= 0),
    claims_approved INT NOT NULL DEFAULT 0 CHECK (claims_approved >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_claim_summary_claims_count ON claim_summary(num_claims_last_year);
CREATE INDEX idx_claim_summary_rejected ON claim_summary(rejected_claims);

-- =============================================================================
-- 5. RISK_SCORES TABLE (Historical Reference & Model Predictions Output)
-- =============================================================================
CREATE TABLE risk_scores (
    risk_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    policy_id VARCHAR(30) NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    risk_score NUMERIC(6, 2) NOT NULL CHECK (risk_score >= 0.00 AND risk_score <= 100.00),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    risk_reasons JSONB,
    model_version VARCHAR(30) NOT NULL DEFAULT 'historical_csv',
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_risk_scores_policy_id ON risk_scores(policy_id);
CREATE INDEX idx_risk_scores_risk_level ON risk_scores(risk_level);
CREATE INDEX idx_risk_scores_model_version ON risk_scores(model_version);

-- =============================================================================
-- 6. RENEWAL_OFFERS TABLE (Historical Reference & Offer Recommendation Output)
-- =============================================================================
CREATE TABLE renewal_offers (
    offer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    policy_id VARCHAR(30) NOT NULL REFERENCES policies(policy_id) ON DELETE CASCADE,
    offer_type VARCHAR(50),
    offer_amount NUMERIC(12, 2),
    offer_sent BOOLEAN NOT NULL DEFAULT FALSE,
    offer_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    model_version VARCHAR(30) NOT NULL DEFAULT 'historical_csv',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_renewal_offers_policy_id ON renewal_offers(policy_id);
CREATE INDEX idx_renewal_offers_sent_accepted ON renewal_offers(offer_sent, offer_accepted);
CREATE INDEX idx_renewal_offers_type ON renewal_offers(offer_type);

-- =============================================================================
-- 7. INTERACTIONS TABLE (Operational Outreach & Front Desk Activity)
-- =============================================================================
CREATE TABLE interactions (
    interaction_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id VARCHAR(30) REFERENCES customers(customer_id) ON DELETE CASCADE,
    policy_id VARCHAR(30) REFERENCES policies(policy_id) ON DELETE CASCADE,
    interaction_type VARCHAR(40) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    interaction_status VARCHAR(30) NOT NULL,
    notes TEXT,
    interaction_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interactions_customer ON interactions(customer_id);
CREATE INDEX idx_interactions_policy ON interactions(policy_id);

-- =============================================================================
-- 8. RETENTION_ACTIONS TABLE (Smart Retention Action Center)
-- =============================================================================
CREATE TABLE retention_actions (
    action_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id VARCHAR(30) REFERENCES customers(customer_id) ON DELETE CASCADE,
    policy_id VARCHAR(30) REFERENCES policies(policy_id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'SKIPPED')),
    assigned_to VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_retention_actions_status_priority ON retention_actions(status, priority);
CREATE INDEX idx_retention_actions_policy ON retention_actions(policy_id);

-- =============================================================================
-- MODEL FEATURE VIEW: policy_model_features
-- Exposes 1 row per policy with clean pre-renewal input features (No Leakage)
-- =============================================================================
CREATE OR REPLACE VIEW policy_model_features AS
SELECT 
    p.policy_id,
    p.customer_id,
    c.customer_age,
    c.customer_gender,
    c.customer_occupation,
    c.customer_city,
    c.customer_state,
    c.customer_country,
    c.customer_tenure_years,
    p.policy_type,
    p.premium_amount,
    p.previous_premium_amount,
    p.premium_increase_pct,
    p.payment_frequency,
    p.days_to_renewal,
    ps.has_late_payments,
    ps.late_payment_count,
    ps.avg_days_late,
    ps.on_time_payment_rate,
    cs.num_claims_last_year,
    cs.total_claim_amount_last_year,
    cs.rejected_claims,
    cs.claims_approved
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
LEFT JOIN payment_summary ps ON p.policy_id = ps.policy_id
LEFT JOIN claim_summary cs ON p.policy_id = cs.policy_id;

-- =============================================================================
-- MODEL TRAINING VIEW: lapse_model_training_data
-- Pre-renewal features + Target variable (renewed) for Model Training & Validation
-- =============================================================================
CREATE OR REPLACE VIEW lapse_model_training_data AS
SELECT 
    pmf.*,
    (CASE WHEN p.policy_status = 'Renewed' THEN TRUE ELSE FALSE END) AS renewed,
    (CASE WHEN p.policy_status = 'Lapsed' THEN 1 ELSE 0 END) AS lapse_target
FROM policy_model_features pmf
JOIN policies p ON pmf.policy_id = p.policy_id;

-- =============================================================================
-- MODEL INFERENCE VIEW: lapse_model_inference_data
-- Pure pre-renewal features for Production Batch Inference (Zero Leakage)
-- =============================================================================
CREATE OR REPLACE VIEW lapse_model_inference_data AS
SELECT * FROM policy_model_features;

-- =============================================================================
-- FRONTEND VIEW 1: upcoming_renewals
-- =============================================================================
CREATE OR REPLACE VIEW upcoming_renewals AS
SELECT 
    p.policy_id,
    p.customer_id,
    c.customer_city,
    c.customer_state,
    p.policy_type,
    p.premium_amount,
    p.policy_end_date,
    p.days_to_renewal,
    p.policy_status,
    r.risk_score,
    r.risk_level,
    ro.offer_amount,
    ro.offer_type,
    ro.offer_accepted
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
LEFT JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level
    FROM risk_scores
    ORDER BY policy_id, calculated_at DESC
) r ON p.policy_id = r.policy_id
LEFT JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, offer_amount, offer_type, offer_accepted
    FROM renewal_offers
    ORDER BY policy_id, created_at DESC
) ro ON p.policy_id = ro.policy_id
ORDER BY p.days_to_renewal ASC;

-- =============================================================================
-- FRONTEND VIEW 2: customer_360 (Unified Customer & Portfolio Profile)
-- =============================================================================
CREATE OR REPLACE VIEW customer_360 AS
WITH cust_metrics AS (
    SELECT 
        p.customer_id,
        COUNT(p.policy_id)::INT AS total_policies_count,
        COALESCE(SUM(CASE WHEN p.policy_status = 'Renewed' THEN 1 ELSE 0 END), 0)::INT AS active_renewed_policies,
        COALESCE(SUM(p.premium_amount), 0.00)::NUMERIC(12, 2) AS total_portfolio_premium,
        COALESCE(AVG(ps.on_time_payment_rate), 100.0)::NUMERIC(6, 2) AS avg_on_time_payment_rate,
        COALESCE(SUM(cs.num_claims_last_year), 0)::INT AS total_claims_count,
        COALESCE(SUM(cs.total_claim_amount_last_year), 0.00)::NUMERIC(12, 2) AS total_claims_amount,
        COALESCE(AVG(r.risk_score), 0.0)::NUMERIC(6, 2) AS avg_risk_score
    FROM policies p
    LEFT JOIN payment_summary ps ON p.policy_id = ps.policy_id
    LEFT JOIN claim_summary cs ON p.policy_id = cs.policy_id
    LEFT JOIN (
        SELECT DISTINCT ON (policy_id) policy_id, risk_score
        FROM risk_scores
        ORDER BY policy_id, calculated_at DESC
    ) r ON p.policy_id = r.policy_id
    GROUP BY p.customer_id
)
SELECT 
    c.customer_id,
    c.customer_age,
    c.customer_gender,
    c.customer_occupation,
    c.customer_city,
    c.customer_state,
    c.customer_country,
    c.customer_tenure_years,
    COALESCE(cm.total_policies_count, 0) AS total_policies_count,
    COALESCE(cm.active_renewed_policies, 0) AS active_renewed_policies,
    COALESCE(cm.total_portfolio_premium, 0.00) AS total_portfolio_premium,
    COALESCE(cm.avg_on_time_payment_rate, 100.00) AS avg_on_time_payment_rate,
    COALESCE(cm.total_claims_count, 0) AS total_claims_count,
    COALESCE(cm.total_claims_amount, 0.00) AS total_claims_amount,
    COALESCE(cm.avg_risk_score, 0.00) AS avg_risk_score
FROM customers c
LEFT JOIN cust_metrics cm ON c.customer_id = cm.customer_id;

-- =============================================================================
-- FRONTEND VIEW 3: retention_action_queue (High-Risk & Priority Action Center)
-- =============================================================================
CREATE OR REPLACE VIEW retention_action_queue AS
SELECT 
    p.policy_id,
    p.customer_id,
    c.customer_city,
    c.customer_state,
    p.policy_type,
    p.premium_amount,
    p.days_to_renewal,
    r.risk_score,
    r.risk_level,
    ps.has_late_payments,
    ps.on_time_payment_rate,
    cs.rejected_claims,
    CASE 
        WHEN r.risk_level = 'HIGH' AND p.days_to_renewal <= 30 THEN 'CRITICAL'
        WHEN r.risk_level = 'HIGH' THEN 'HIGH'
        WHEN r.risk_level = 'MEDIUM' AND ps.has_late_payments THEN 'MEDIUM'
        ELSE 'LOW'
    END AS suggested_priority,
    CASE 
        WHEN ps.has_late_payments AND r.risk_level = 'HIGH' THEN 'Offer Flexible Monthly Installment Plan'
        WHEN cs.rejected_claims > 0 THEN 'Schedule Policy Concierge Review Call'
        WHEN r.risk_level = 'HIGH' THEN 'Dispatch Targeted Retention Discount Offer'
        ELSE 'Send Standard Renewal Reminder'
    END AS recommended_action
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
LEFT JOIN payment_summary ps ON p.policy_id = ps.policy_id
LEFT JOIN claim_summary cs ON p.policy_id = cs.policy_id
LEFT JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, risk_score, risk_level
    FROM risk_scores
    ORDER BY policy_id, calculated_at DESC
) r ON p.policy_id = r.policy_id
WHERE p.policy_status = 'Renewed' OR r.risk_level IN ('HIGH', 'MEDIUM')
ORDER BY 
    CASE 
        WHEN r.risk_level = 'HIGH' AND p.days_to_renewal <= 30 THEN 1
        WHEN r.risk_level = 'HIGH' THEN 2
        WHEN r.risk_level = 'MEDIUM' THEN 3
        ELSE 4
    END,
    p.days_to_renewal ASC;

-- =============================================================================
-- FRONTEND VIEW 4: lapsed_customers (Win-Back Campaign Center)
-- =============================================================================
CREATE OR REPLACE VIEW lapsed_customers AS
SELECT 
    p.policy_id,
    p.customer_id,
    c.customer_city,
    c.customer_state,
    p.policy_type,
    p.premium_amount,
    p.previous_premium_amount,
    p.premium_increase_pct,
    c.customer_tenure_years,
    ps.has_late_payments,
    ps.on_time_payment_rate,
    cs.num_claims_last_year,
    cs.total_claim_amount_last_year,
    cs.rejected_claims,
    r.risk_score,
    ro.offer_type AS past_offer_type,
    ro.offer_amount AS past_offer_amount,
    ro.offer_accepted AS past_offer_accepted
FROM policies p
JOIN customers c ON p.customer_id = c.customer_id
LEFT JOIN payment_summary ps ON p.policy_id = ps.policy_id
LEFT JOIN claim_summary cs ON p.policy_id = cs.policy_id
LEFT JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, risk_score
    FROM risk_scores
    ORDER BY policy_id, calculated_at DESC
) r ON p.policy_id = r.policy_id
LEFT JOIN (
    SELECT DISTINCT ON (policy_id) policy_id, offer_type, offer_amount, offer_accepted
    FROM renewal_offers
    ORDER BY policy_id, created_at DESC
) ro ON p.policy_id = ro.policy_id
WHERE p.policy_status = 'Lapsed';
