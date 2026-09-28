# RenewIQ — Insurance Retention Command Center

> **An insurance retention platform that identifies renewal risk, recommends targeted retention actions, and helps teams prioritize customer interventions.**

---

## Nice Software Solutions Innovation Hackathon Submission

* **Track / Use Case**: Insurance — Policy Renewal & Lapse Prevention
* **Primary Business User**: Customer Retention Teams, Underwriting Leads, and Portfolio Managers at an Insurer
* **Core Value Proposition**: Transform retention from reactive chasing into proactive, behaviour-informed intervention to protect recurring premium revenue.

---

## Table of Contents

1. [Business Problem](#1-business-problem)
2. [Our Solution](#2-our-solution)
3. [Core Hackathon Features](#3-core-hackathon-features)
4. [Our Fifth Feature — Payment-Date Alignment Engine](#4-our-fifth-feature--payment-date-alignment-engine)
5. [Payment-Date Alignment Logic](#5-payment-date-alignment-logic)
6. [Business Value of Feature 5](#6-business-value-of-feature-5)
7. [How Our Features Work Together](#7-how-our-features-work-together)
8. [Bonus Features](#8-bonus-features)
9. [End-to-End Demo Story (6-Minute Pitch)](#9-end-to-end-demo-story-6-minute-pitch)
10. [Data & Synthetic Dataset Details](#10-data--synthetic-dataset-details)
11. [Database Architecture & Schema](#11-database-architecture--schema)
12. [System Architecture](#12-system-architecture)
13. [Technology Stack](#13-technology-stack)
14. [Backend API Documentation](#14-backend-api-documentation)
15. [Project Structure](#15-project-structure)
16. [Local Setup & Running Instructions](#16-local-setup--running-instructions)
17. [Environment Variables](#17-environment-variables)
18. [Team Contributions & Feature Ownership](#18-team-contributions--feature-ownership)
19. [Implemented vs Planned Features](#19-implemented-vs-planned-features)
20. [Limitations & Assumptions](#20-limitations--assumptions)
21. [Why RenewIQ?](#21-why-renewiq)

---

## 1. Business Problem

Insurance policies represent long-term recurring revenue for insurance carriers. However, customer churn during renewal windows poses a major financial leakage:

* **Passive Lapses**: Policyholders often forget to renew, get confused by disjointed schedules, or experience friction in recurring payments.
* **Active Lapses**: Customers experiencing sudden premium hikes, rejected claim disputes, or poor customer support actively seek competitors.
* **Generic Outreach Failure**: Traditional insurers blast uniform email reminders ("Your policy expires soon. Click to renew") regardless of whether the customer churn risk is driven by pricing shock, service frustration, or payment timing mismatch.
* **Capacity Bottlenecks**: Retention operations teams have limited calling and outreach capacity. They need to know *which* accounts represent the highest revenue risk and *what specific intervention* will yield the highest retention probability.

The goal of RenewIQ is not just to flag churn risk, but to give retention managers the causal drivers, optimal counter-offers, behavioural payment alignments, and actionable workflows to protect the book of business.

---

## 2. Our Solution

**RenewIQ** is an integrated retention command center that unifies portfolio visibility, explainable risk scoring, offer personalization, and payment behaviour alignment:

```
                      POLICY PORTFOLIO
                             │
                             ▼
                      RENEWAL CALENDAR
              (Track renewals by week and month)
                             │
                             ▼
                    LAPSE-RISK DETECTION
          (Multivariate scoring + Red Flag triggers)
                             │
                             ▼
                  CUSTOMER / POLICY REASON
        (Pricing shock, payment friction, claim dispute)
                             │
                             ▼
                  RETENTION OFFER / ACTION
       (Loyalty discount, instalment plan, NCB protection,
                Payment-Date Alignment offer)
                             │
                             ▼
                  RETENTION PRIORITIZATION
              (Triage by urgency and SLA tiers)
                             │
                             ▼
                  PROTECTED REVENUE AT RISK
```

All features operate seamlessly on the same underlying relational database schema, ensuring live synchronization across dashboards, risk engines, and outreach workbenches.

---

## 3. Core Hackathon Features

| # | Feature | Route | Hackathon Purpose & Actual Implementation |
|---|---|---|---|
| **1** | **Portfolio & Renewal Calendar** | `/portfolio-renewals` | Provides macro-to-micro visibility over underwritten books. Features interactive Month/Week/List views, 7-day urgency filters, product line breakdowns, and CSV exports. |
| **2** | **Lapse-Risk Score & Diagnostics** | `/lapse-risk-analysis` | Computes multidimensional lapse probabilities (0–100) using payment friction, claim rejections, tenure, and price hikes. Includes an Explainable Diagnostic Inspector breaking down exact risk contributors. |
| **3** | **Renewal Offer Rules Engine** | `/renewal-offers` | Prescribes targeted counter-offers (e.g., 10% Loyalty Rebate, Split-Pay Instalments, Deductible Waiver) matching the policyholder's specific friction reason. Includes single and batch dispatch actions. |
| **4** | **Retention Dashboard** | `/` | Executive and managerial console displaying real-time renewals due, total premium at risk, retention rates, line-of-business exposures, and a critical intervention queue. |
| **5** | **Payment-Date Alignment Engine** | `/smart-reminders` | **[Team's Own Feature]** Detects observed historical payment patterns to resolve structural recurring delinquency by aligning policy billing dates with the customer's natural cashflow window. |

---

## 4. Our Fifth Feature — Payment-Date Alignment Engine

### The Business Insight
In standard insurance operations, customers who repeatedly pay after their official due date are flagged as "delinquent" and subjected to aggressive late reminders, penalties, and cancellation threats.

However, analysis of policyholder behaviour reveals a critical pattern: **many customers are not refusing to pay; their official billing cycle simply clashes with their real-world cashflow cycle.**

### Example Scenario
* **Official Policy Due Date**: `5th of the month`
* **Observed Historical Payment Dates**: `9th`, `10th`, `8th`, `9th`, `10th`
* **Traditional Insurer Action**: Send 3 urgent warning notices between the 6th and 8th, increasing customer anxiety and churn friction.
* **RenewIQ Action**: 
  1. Detect an average delay of approx 4 days.
  2. Identify an **Observed Payment Pattern** clustered tightly between the `8th` and `10th`.
  3. Calculate the robust median payment date (`9th`).
  4. Prescribe a **Payment-Date Alignment Offer**: *"Adjust billing cycle from the 5th to the 9th of the month."*

> **Important Clarification**: RenewIQ does **not** perform salary inference, employer tracking, or bank account scraping. The engine operates purely on the customer's **Observed Payment Pattern** within the policy payment ledger.

---

## 5. Payment-Date Alignment Logic

The engine executes a 6-stage analytical pipeline:

```
                  1. Payment Ledger Ingestion
                (Examine historical transaction log)
                             │
                             ▼
                 2. Calculate Payment Delays
         (Measure days between official due date and receipt)
                             │
                             ▼
             3. Detect Recurring Payment Pattern
             (Filter for repeated delays: count >= 3,
                   mean delay >= 2 business days)
                             │
                             ▼
                4. Measure Pattern Consistency
            (Calculate variance and cluster density)
                             │
                             ▼
             5. Identify Alignment Opportunity
        (Confirm customer regularly settles within a stable
                    post-due window)
                             │
                             ▼
               6. Suggest Future Payment Date
         (Recommend the MEDIAN observed payment day to protect
                against rare one-off outlier spikes)
```

### Why Median Calculation?
Using the **median** rather than the arithmetic mean guarantees that single anomalous events (such as a bank holiday delay or technical glitch) do not distort the recommended date.

For example, with observed payment dates `[8, 9, 9, 10, 25]`:
* Mean = `12.2` (distorted by the outlier 25th)
* **Median = 9** (accurately reflects the recurring pattern)

---

## 6. Business Value of Feature 5

1. **Replaces Friction with Convenience**: Transforms an adversarial collections experience into a personalized customer-care touchpoint.
2. **May Reduce Operational Churn**: Aligning payment dates with natural liquidity cycles can prevent inadvertent policy cancellations due to grace-period expiration.
3. **Optimizes Outreach Costs**: Stops wasteful reminder blasts sent during dates when the customer is known to lack liquidity.
4. **Actionable Retention Asset**: Provides agents with a non-monetary retention lever when policy discounts are financially unfeasible.

---

## 7. How Our Features Work Together

The five features form a continuous, cohesive loop operating on a single source of truth:

```
                 CUSTOMERS & POLICY CONTRACTS
                             │
                             ▼
                 1. PORTFOLIO & RENEWALS
             (Identify renewals due in 7-30 days)
                             │
                             ▼
                  2. LAPSE-RISK ANALYSIS
             (Detect elevated risk score & red flags)
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
 3. RENEWAL OFFER RULES            5. PAYMENT-DATE ALIGNMENT
(Pricing & loyalty counter-offer)    (Cashflow cycle alignment)
            │                                 │
            └────────────────┬────────────────┘
                             │
                             ▼
                 4. RETENTION DASHBOARD
           (Track total premium saved and overall
               portfolio retention health)
```

### Unified Scenario
1. **Portfolio Calendar** surfaces policy `#POL-1082` expiring in 18 days.
2. **Lapse-Risk Engine** flags a Hazard Score of `78/100` due to a 12.75% premium hike and 3 consecutive late payments.
3. **Renewal Offer Engine** generates a 10% Loyalty Discount.
4. **Payment-Date Alignment Engine** detects that payment is always settled on the 10th rather than the 1st, and recommends a date shift to the 10th.
5. **Retention Action**: The agent sends a combined package (10% rebate + billing date shift to the 10th), resolving both price sensitivity and payment friction in one touchpoint.

---

## 8. Bonus Features

In addition to the five mandatory capabilities, RenewIQ includes several production-ready bonus features:

### 1. Database Explorer (`/database`)
* **Real PostgreSQL Management Console**: A browser-based database frontend embedded directly into the React interface.
* **Live Connection Diagnostics**: Real-time health check badge monitoring the PostgreSQL 16 Docker container, database name (`insurance_retention`), host port (`5433`), and query latency in milliseconds.
* **9 Interactive Relational Tables**: Full server-side pagination, sorting, and debounced multi-field searching across 20,000 records.
* **Record Inspector (Customer 360)**: Visual modal rendering joined customer demographics, policy plan, contract terms, payment performance, and claims history.

### 2. Customer Details & Dossier 360 (`/customer-details`)
* Deep customer profile workbench including policy ledger history, claim audit timelines, and interaction records.

### 3. Mobile Retention Dashboard (`/retention-dashboard-mobile`)
* A responsive, on-the-go mobile console designed for field retention agents and executives.

### 4. Retention Budget Optimizer *(Designed / Planned Architecture)*
* A mathematical resource allocator designed to distribute limited retention budgets and agent call capacity based on expected value:
  * `Expected Value Saved = Premium * Lapse Probability * Response Rate`
  * `Intervention Priority = Expected Value Saved / Offer Cost`

---

## 9. End-to-End Demo Story (6-Minute Pitch)

1. **Minute 0:00 – 1:00 | Executive Overview (`/`)**:
   * Open the **Retention Dashboard**.
   * Highlight macro KPIs: Active policies, Total Premium at Risk, Renewals Due within 30 days, and Line of Business churn breakdown.
2. **Minute 1:00 – 2:15 | Portfolio & Risk Triage (`/portfolio-renewals` & `/lapse-risk-analysis`)**:
   * Filter the Renewal Calendar for high-urgency accounts expiring in < 7 days.
   * Drill into policy `#POL-1082` (Rahul Sharma, Annual Premium: Rs 84,000, Risk Score: 78/100).
   * Open the **Explainable Risk Inspector** to demonstrate the exact causal drivers: Price Hike (+12.75%) and Delinquency History.
3. **Minute 2:15 – 3:30 | Prescriptive Offers & Date Alignment (`/renewal-offers` & `/smart-reminders`)**:
   * Review the tailored Renewal Offer recommendation (10% Loyalty Discount + Split-Pay).
   * Open the **Smart Reminders / Payment-Date Alignment Engine**.
   * Show the historical payment dates (`9th`, `10th`, `8th`, `10th` vs `5th` due date) and the computed median payment alignment (`9th`).
   * Dispatch the combined retention package.
4. **Minute 3:30 – 4:45 | Database Proof & Live Verification (`/database`)**:
   * Navigate to the **Database Explorer**.
   * Show live PostgreSQL connection metrics (Port `5433`, 2ms latency).
   * Demonstrate server-side pagination and real queries across the 20,000 normalized records.
   * Open the Customer 360 Inspector to show full relational integrity.
5. **Minute 4:45 – 6:00 | Wrap-up & Q&A**:
   * Conclude on the core thesis: *"RenewIQ moves insurance retention from blind email blasts to precision behavioural interventions."*

---

## 10. Data & Synthetic Dataset Details

The application is powered by the authoritative 20,000-record dataset: **`data/insurance_policies_20000.csv`**.

> **Note**: In compliance with hackathon rules, this dataset is **100% synthetic**. No real personally identifiable customer information (PII) or confidential policy records are used.

### Entity Relationships & Dataset Breakdown

| Entity / Table | Record Count | Description |
|---|---|---|
| **Policy Products** | 200 | Deduplicated catalog templates (`P001`–`P200`) across Term Life, Health, Motor, Home, and Travel. |
| **Customers** | 20,000 | Policyholder demographic profiles (`CUST000001`–`CUST020000`) including age, gender, occupation, and tenure. |
| **Customer Policies** | 20,000 | Individual active subscription contracts containing premiums, prior premiums, price changes, and renewal windows. |
| **Payment Summaries** | 20,000 | 1:1 aggregated payment performance metrics (delinquencies, average delay days, on-time rates). |
| **Claim Summaries** | 20,000 | 1:1 aggregated claims metrics (filed count, total claim amount, approved vs rejected counts). |
| **Risk Scores** | 0 *(ML destination)* | Destination table for model-generated hazard scores and JSONB explanation vectors. |
| **Renewal Offers** | 0 *(ML destination)* | Destination table for model-generated discount offers and delivery tracking. |
| **Interactions** | 0 *(Runtime)* | Operational audit trail for agent notes and customer touchpoints. |
| **Retention Actions** | 0 *(Runtime)* | Work queue for assigned retention interventions. |

---

## 11. Database Architecture & Schema

The relational schema is defined in [database/schema.sql](file:///d:/Blockchain/nice/database/schema.sql):

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

### Machine Learning & Analytical Views

* **`policy_model_features`** *(20,000 rows)*: Complete feature matrix joining customer demographics, product catalog, contract terms, payment habits, and claims history with **Zero Data Leakage**.
* **`lapse_model_inference_data`** *(20,000 rows)*: Leakage-free feature vector specifically prepared for ML batch prediction.
* **`portfolio_renewals`** *(20,000 rows)*: Sorted renewals view ordered by `days_to_renewal ASC`.
* **`retention_dashboard_summary`** *(1 row)*: Real-time aggregate telemetry across the active portfolio.

---

## 12. System Architecture

```
                      React 18 Frontend (Vite)
                     Port: 5173 | Tailwind CSS
                                 │
                                 │ REST API Calls (/api/...)
                                 ▼
                     Express.js Backend (Node.js)
                                 │
                                 │ Connection Pool (pg)
                                 ▼
                 PostgreSQL 16 Alpine Database
                 Container: insurance_retention_postgres
                     Host Port: 5433 | DB: insurance_retention
                                 │
                                 ▼
                      Docker Desktop Engine
```

* **Frontend**: Renders responsive user interfaces and visual analytics.
* **Backend**: Express API with connection pooling and query sanitization.
* **PostgreSQL in Docker**: Persistent, normalized storage running strictly inside a Docker container on host port `5433` (preventing any Windows port 5432 conflicts).
* **Security**: Zero database credentials or passwords exist in frontend client code.

---

## 13. Technology Stack

| Layer | Technology | Version / Tooling | Purpose |
|---|---|---|---|
| **Frontend** | React | 18.3.1 | Single-page application UI components |
| **Build Tool** | Vite | 5.4.6 | Fast development server & production bundler |
| **Styling** | Tailwind CSS | 3.4.13 | Design system, layout grid, and UI tokens |
| **Icons & Fonts** | Material Symbols & Manrope | Google Fonts | Visual iconography & clean typography |
| **Backend API** | Node.js / Express | 4.19.2 (Node v22+) | RESTful endpoints & pagination engine |
| **Database Driver** | `pg` (node-postgres) | 8.11.5 | PostgreSQL connection pooling |
| **Database** | PostgreSQL | 16-Alpine | Authoritative relational storage & analytical views |
| **Infrastructure** | Docker Desktop & Compose | Docker Compose v2 | Containerized PostgreSQL deployment |
| **ETL & Data** | Python & Pandas | Python 3.10+ / Pandas / Psycopg2 | Dataset parsing and database seeding engine |

---

## 14. Backend API Documentation

The Express server exposes the following endpoints (running at `http://localhost:3001` and proxied via Vite):

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/database/health` | — | Live PostgreSQL status, host port, latency in ms, and container engine. |
| `GET` | `/api/database/stats` | — | Real-time row counts for all 9 tables and analytical views. |
| `GET` | `/api/database/policy-products` | `?page=&limit=&search=&sort=&order=` | Paginated policy catalog templates. |
| `GET` | `/api/database/customers` | `?page=&limit=&search=&sort=&order=` | Paginated customer profiles. |
| `GET` | `/api/database/customer-policies` | `?page=&limit=&search=&sort=&order=` | Paginated customer contracts, premiums, and renewal days. |
| `GET` | `/api/database/payment-summary` | `?page=&limit=&search=&sort=&order=` | Paginated payment performance records. |
| `GET` | `/api/database/claim-summary` | `?page=&limit=&search=&sort=&order=` | Paginated claims metrics. |
| `GET` | `/api/database/risk-scores` | `?page=&limit=&search=&sort=&order=` | Paginated ML risk scores. |
| `GET` | `/api/database/renewal-offers` | `?page=&limit=&search=&sort=&order=` | Paginated renewal offers. |
| `GET` | `/api/database/interactions` | `?page=&limit=&search=&sort=&order=` | Paginated customer interaction log. |
| `GET` | `/api/database/retention-actions` | `?page=&limit=&search=&sort=&order=` | Paginated retention agent tasks. |
| `GET` | `/api/database/customer-policy-details/:id` | — | Joined Customer 360 record (demographics + plan + contract + payment + claims). |
| `GET` | `/api/database/views/:viewName` | `?page=&limit=&search=&sort=&order=` | Paginated ML model view inspector. |

---

## 15. Project Structure

```
nice/
├── backend/                              # Express.js REST API
│   ├── db.js                             # PostgreSQL connection pool configuration
│   ├── package.json                      # Backend dependencies (express, pg, cors, dotenv)
│   └── server.js                         # REST endpoints & table query controllers
├── data/
│   └── insurance_policies_20000.csv      # Authoritative 20,000-record dataset
├── database/
│   ├── FRONTEND_DATA_CONTRACT.md         # UI component to schema data mapping
│   ├── MODEL_DATA_CONTRACT.md            # ML feature definitions & data leakage specs
│   ├── README.md                         # Database layer setup & SQL queries
│   ├── requirements.txt                  # Python ETL dependencies
│   ├── schema.sql                        # PostgreSQL 16 DDL & Analytical Views
│   ├── seed_database.py                  # Python ETL seeding pipeline
│   └── seed_to_sql.py                    # Standalone pure-SQL generator
├── Frontend/                             # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── DesktopLayout.jsx         # Shell layout (Sidebar + Header + Content)
│   │   │   ├── Header.jsx                # Global search & profile header
│   │   │   └── Sidebar.jsx               # Navigation bar with active state handling
│   │   ├── pages/
│   │   │   ├── CustomerDetailsDesktop.jsx# Customer 360 Dossier
│   │   │   ├── DatabaseExplorer.jsx      # Interactive PostgreSQL Management Frontend
│   │   │   ├── LapseRiskAnalysisDesktop.jsx # Explainable Hazard Diagnostics
│   │   │   ├── PortfolioRenewalsDesktop.jsx # Renewal Calendar & Portfolio Explorer
│   │   │   ├── RenewalOffersDesktop.jsx  # Prescriptive Offer Rules Engine
│   │   │   ├── RetentionDashboardDesktop.jsx # Main Executive Retention Console
│   │   │   ├── RetentionDashboardMobile.jsx  # Mobile Field Agent Dashboard
│   │   │   └── SmartRemindersDesktop.jsx # Payment-Date Alignment & Outreach Hub
│   │   ├── App.jsx                       # Client-side router configuration
│   │   ├── index.css                     # Design tokens & Tailwind utility classes
│   │   └── main.jsx                      # React application entry point
│   ├── package.json                      # Frontend dependencies (react, tailwind, vite)
│   ├── tailwind.config.js                # Custom color palettes & spacing tokens
│   └── vite.config.js                    # Vite dev server with /api proxy to backend
├── .env.example                          # Environment variable configuration template
├── docker-compose.yml                    # PostgreSQL 16 Alpine container definition
└── README.md                             # Hackathon project documentation
```

---

## 16. Local Setup & Running Instructions

### Prerequisites
* **Docker Desktop** (running)
* **Node.js** (v18.0 or higher)
* **Python** (v3.10 or higher with `pip`)

---

### Step 1: Configure Environment
```powershell
# Copy environment file
Copy-Item .env.example .env
```

---

### Step 2: Start PostgreSQL in Docker
```powershell
# Start container in detached mode:
docker compose up -d

# Verify container is healthy:
docker compose ps
```

---

### Step 3: Seed the Database (20,000 Records)
```powershell
# Install python requirements:
pip install -r database/requirements.txt

# Run the seeding engine:
python database/seed_database.py
```

---

### Step 4: Start the Backend API (Port 3001)
```powershell
cd backend
npm install
npm run dev
```

---

### Step 5: Start the React Frontend (Port 5173)
```powershell
# In a separate terminal:
cd Frontend
npm install
npm run dev
```

---

### Step 6: Access the Application
* **Retention Dashboard**: `http://localhost:5173/`
* **Database Explorer**: `http://localhost:5173/database`
* **Backend Health Check**: `http://localhost:3001/api/database/health`

---

## 17. Environment Variables

Environment variables are managed in `.env` (template in [.env.example](file:///d:/Blockchain/nice/.env.example)):

```env
# PostgreSQL Docker Configuration
POSTGRES_DB=insurance_retention
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5433

# PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/insurance_retention

# Backend API Configuration
BACKEND_PORT=3001
```

---

## 18. Team Contributions & Feature Ownership

| Team Member | Feature / Role | Primary Responsibilities |
|---|---|---|
| **[Team Member 1]** | **Portfolio & Renewal Calendar** | Built the interactive renewal timeline, multi-view calendar (month/week/list), and line-of-business filtering. |
| **[Team Member 2]** | **Lapse-Risk Score & Explainability** | Designed the multivariate risk scoring breakdown, explainable red-flag attribution pills, and risk telemetry. |
| **[Team Member 3]** | **Renewal Offer Rules Engine** | Implemented the counter-offer decision matrix, incentive generation (loyalty discount, split-pay), and dispatch flows. |
| **[Team Member 4]** | **Retention Dashboard** | Developed the executive KPI command center, premium-at-risk aggregation, and SLA intervention queue. |
| **[Team Member 5]** | **Payment-Date Alignment Engine** | Designed the 5th feature: median payment pattern detection, payment delay clustering, and cashflow alignment. |
| **[Entire Team]** | **Full-Stack Architecture & DB** | Docker PostgreSQL 16 setup, 20K database ETL pipeline, Express REST backend, and Database Explorer UI. |

---

## 19. Implemented vs Planned Features

### Currently Implemented
* [x] **Portfolio & Renewal Calendar** (`/portfolio-renewals`): Full calendar filtering, search, and list management.
* [x] **Lapse-Risk Diagnostics** (`/lapse-risk-analysis`): Risk scoring telemetry and causal factor breakdown.
* [x] **Renewal Offer Rules Engine** (`/renewal-offers`): Prescriptive counter-offer selection and dispatch simulator.
* [x] **Retention Dashboard** (`/`): Real-time portfolio metrics, premium-at-risk calculations, and SLA queues.
* [x] **Payment-Date Alignment Engine** (`/smart-reminders`): Observed pattern detection and billing alignment workbench.
* [x] **Database Explorer** (`/database`): Live PostgreSQL 16 inspection, latency telemetry, and server-side paginated queries.
* [x] **Customer 360 Dossier** (`/customer-details`): Complete multi-tab profile and ledger inspector.
* [x] **Mobile Dashboard** (`/retention-dashboard-mobile`): Mobile-optimized retention console.
* [x] **Dockerized PostgreSQL 16 & Seeding**: 20,000 normalized contracts with analytical views.

### Designed / Planned
* [ ] **Retention Budget Optimizer**: Mathematical solver to auto-allocate fixed monetary retention budgets across competing customer tiers.
* [ ] **Live Telephony / WhatsApp API Gateway**: Real integration with external SMS/telephony gateways (currently simulated with interactive UI feedback).
* [ ] **Automated ML Retraining Pipeline**: Daily scheduled cron jobs executing gradient boosted model inference.

---

## 20. Limitations & Assumptions

1. **Synthetic Data**: All 20,000 records are synthetically generated for hackathon benchmarking; no live customer PII is utilized.
2. **Observed Behaviour vs Income**: Payment-date alignment is strictly derived from past payment transaction dates. The system makes no assumptions about customer salary, employer, or external income sources.
3. **Recommendation Engine**: Prescribed retention offers are decision-support recommendations to empower retention managers, not automated financial guarantees.
4. **Isolated Docker Port**: Docker PostgreSQL is configured on host port `5433` to guarantee isolation and zero conflict with local services on the host machine.

---

## 21. Why RenewIQ?

> **"Don't just predict who will churn. Understand why they are leaving, choose the right intervention, and help the retention team act where it counts."**

By uniting **Portfolio Visibility -> Explainable Risk -> Offer Prescriptions -> Payment Pattern Alignment -> Real Database Governance**, RenewIQ equips insurance retention teams to protect their revenue base with precision.