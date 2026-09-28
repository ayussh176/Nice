import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper for generic paginated table queries
async function queryTable(tableName, req, res, searchColumns = [], defaultSort = '1') {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '25', 10)));
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').trim();
    const sort = req.query.sort || defaultSort;
    const order = (req.query.order || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Safe sanitize sort column (alphanumeric and underscore only, or integer index)
    const sanitizedSort = /^[a-zA-Z0-9_]+$/.test(sort) ? sort : defaultSort;

    let whereClause = '';
    const params = [];

    if (search && searchColumns.length > 0) {
      const searchConditions = searchColumns.map((col) => {
        params.push(`%${search}%`);
        return `CAST(${col} AS TEXT) ILIKE $${params.length}`;
      });
      whereClause = `WHERE ${searchConditions.join(' OR ')}`;
    }

    const countQuery = `SELECT COUNT(*) AS total FROM ${tableName} ${whereClause};`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total, 10);

    const dataParams = [...params, limit, offset];
    const dataQuery = `
      SELECT * FROM ${tableName}
      ${whereClause}
      ORDER BY ${sanitizedSort} ${order}
      LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length};
    `;

    const dataResult = await pool.query(dataQuery, dataParams);

    return res.json({
      success: true,
      table: tableName,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      rows: dataResult.rows,
    });
  } catch (err) {
    console.error(`Error querying table ${tableName}:`, err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}

// ── Database Health & Diagnostics ──────────────────────────────
app.get('/api/database/health', async (req, res) => {
  const startTime = Date.now();
  try {
    const dbRes = await pool.query('SELECT version(), current_database(), now() AS current_time;');
    const latencyMs = Date.now() - startTime;
    return res.json({
      status: 'connected',
      connected: true,
      latencyMs,
      database: dbRes.rows[0].current_database,
      version: dbRes.rows[0].version,
      timestamp: dbRes.rows[0].current_time,
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5433,
      containerEngine: 'Docker Desktop (PostgreSQL 16 Alpine)',
    });
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    return res.status(500).json({
      status: 'disconnected',
      connected: false,
      latencyMs,
      error: err.message,
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5433,
    });
  }
});

// ── Database Table Statistics ─────────────────────────────────
app.get('/api/database/stats', async (req, res) => {
  try {
    const tables = [
      'policy_products',
      'customers',
      'customer_policies',
      'payment_summary',
      'claim_summary',
      'risk_scores',
      'renewal_offers',
      'interactions',
      'retention_actions',
    ];

    const counts = {};
    for (const tbl of tables) {
      const q = await pool.query(`SELECT COUNT(*) AS cnt FROM ${tbl};`);
      counts[tbl] = parseInt(q.rows[0].cnt, 10);
    }

    // Also get view counts
    const viewCounts = {};
    const views = ['policy_model_features', 'lapse_model_inference_data', 'portfolio_renewals'];
    for (const vw of views) {
      const q = await pool.query(`SELECT COUNT(*) AS cnt FROM ${vw};`);
      viewCounts[vw] = parseInt(q.rows[0].cnt, 10);
    }

    // Aggregate summary
    const summaryQ = await pool.query('SELECT * FROM retention_dashboard_summary;');
    const summary = summaryQ.rows[0] || {};

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      counts: {
        policy_products: counts.policy_products,
        customers: counts.customers,
        customer_policies: counts.customer_policies,
        payment_summary: counts.payment_summary,
        claim_summary: counts.claim_summary,
        risk_scores: counts.risk_scores,
        renewal_offers: counts.renewal_offers,
        interactions: counts.interactions,
        retention_actions: counts.retention_actions,
      },
      viewCounts,
      summary,
    });
  } catch (err) {
    console.error('Error fetching database stats:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── Table Endpoints ───────────────────────────────────────────
app.get('/api/database/policy-products', (req, res) => {
  return queryTable('policy_products', req, res, ['policy_id', 'policy_name', 'policy_type'], 'policy_id');
});

app.get('/api/database/customers', (req, res) => {
  return queryTable('customers', req, res, ['customer_id', 'customer_occupation', 'customer_gender', 'customer_city'], 'customer_id');
});

app.get('/api/database/customer-policies', (req, res) => {
  return queryTable('customer_policies', req, res, ['customer_id', 'policy_id', 'policy_status', 'payment_frequency'], 'customer_policy_id');
});

app.get('/api/database/payment-summary', (req, res) => {
  return queryTable('payment_summary', req, res, ['customer_policy_id'], 'customer_policy_id');
});

app.get('/api/database/claim-summary', (req, res) => {
  return queryTable('claim_summary', req, res, ['customer_policy_id'], 'customer_policy_id');
});

app.get('/api/database/risk-scores', (req, res) => {
  return queryTable('risk_scores', req, res, ['customer_policy_id', 'risk_level', 'model_version'], 'risk_id');
});

app.get('/api/database/renewal-offers', (req, res) => {
  return queryTable('renewal_offers', req, res, ['customer_policy_id', 'offer_type', 'model_version'], 'offer_id');
});

app.get('/api/database/interactions', (req, res) => {
  return queryTable('interactions', req, res, ['customer_id', 'interaction_type', 'channel', 'interaction_status'], 'interaction_id');
});

app.get('/api/database/retention-actions', (req, res) => {
  return queryTable('retention_actions', req, res, ['customer_id', 'action_type', 'priority', 'status', 'assigned_to'], 'action_id');
});

// ── Customer Policy Full Details ──────────────────────────────
app.get('/api/database/customer-policy-details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = `
      SELECT
        cp.customer_policy_id,
        cp.customer_id,
        cp.policy_id,
        cp.policy_start_date,
        cp.policy_end_date,
        cp.premium_amount,
        cp.previous_premium_amount,
        cp.premium_increase_pct,
        cp.payment_frequency,
        cp.days_to_renewal,
        cp.policy_status,
        cp.created_at AS policy_created_at,
        -- Customer details
        c.customer_age,
        c.customer_gender,
        c.customer_occupation,
        c.customer_city,
        c.customer_state,
        c.customer_postal_code,
        c.customer_country,
        c.customer_tenure_years,
        -- Policy product catalog
        pp.policy_name,
        pp.policy_type,
        -- Payment summary
        ps.has_late_payments,
        ps.late_payment_count,
        ps.avg_days_late,
        ps.on_time_payment_rate,
        -- Claim summary
        cs.num_claims_last_year,
        cs.total_claim_amount_last_year,
        cs.rejected_claims,
        cs.claims_approved
      FROM customer_policies cp
      JOIN customers c ON c.customer_id = cp.customer_id
      JOIN policy_products pp ON pp.policy_id = cp.policy_id
      LEFT JOIN payment_summary ps ON ps.customer_policy_id = cp.customer_policy_id
      LEFT JOIN claim_summary cs ON cs.customer_policy_id = cp.customer_policy_id
      WHERE CAST(cp.customer_policy_id AS TEXT) = $1 OR cp.customer_id = $1
      LIMIT 1;
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Customer policy not found' });
    }

    const cpData = result.rows[0];

    // Fetch related risk scores
    const riskQ = await pool.query(
      'SELECT * FROM risk_scores WHERE customer_policy_id = $1 ORDER BY calculated_at DESC;',
      [cpData.customer_policy_id]
    );

    // Fetch related renewal offers
    const offersQ = await pool.query(
      'SELECT * FROM renewal_offers WHERE customer_policy_id = $1 ORDER BY created_at DESC;',
      [cpData.customer_policy_id]
    );

    // Fetch interactions
    const interactionsQ = await pool.query(
      'SELECT * FROM interactions WHERE customer_id = $1 OR customer_policy_id = $2 ORDER BY interaction_at DESC;',
      [cpData.customer_id, cpData.customer_policy_id]
    );

    // Fetch retention actions
    const actionsQ = await pool.query(
      'SELECT * FROM retention_actions WHERE customer_id = $1 OR customer_policy_id = $2 ORDER BY created_at DESC;',
      [cpData.customer_id, cpData.customer_policy_id]
    );

    return res.json({
      success: true,
      data: {
        ...cpData,
        risk_scores: riskQ.rows,
        renewal_offers: offersQ.rows,
        interactions: interactionsQ.rows,
        retention_actions: actionsQ.rows,
      },
    });
  } catch (err) {
    console.error('Error fetching customer policy details:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ── Model Views Inspector ─────────────────────────────────────
app.get('/api/database/views/:viewName', (req, res) => {
  const allowedViews = [
    'policy_model_features',
    'lapse_model_inference_data',
    'lapse_model_training_data',
    'portfolio_renewals',
    'lapse_risk_analysis',
    'renewal_offers_dashboard',
    'smart_reminders_queue',
    'customer_360',
    'retention_dashboard_summary',
  ];

  const viewName = req.params.viewName;
  if (!allowedViews.includes(viewName)) {
    return res.status(400).json({ success: false, error: `Invalid view name: ${viewName}` });
  }

  return queryTable(viewName, req, res, ['customer_id', 'policy_id'], 'customer_policy_id');
});

// Start server
app.listen(PORT, () => {
  console.log(`[BACKEND] Insurance Retention API running on http://localhost:${PORT}`);
  console.log(`[BACKEND] Connecting to PostgreSQL at ${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || '5433'}`);
});