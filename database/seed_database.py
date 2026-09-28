"""
<<<<<<< HEAD
Seed Database from CSV: insurance_policies_20000 (1).csv
Reads the real CSV data and populates all tables with actual + randomly-generated supplementary fields.
Drops and recreates all data, preserving schema.
=======
=============================================================================
Insurance Retention Platform - Authoritative 20K Dataset Seeding Engine
=============================================================================
Authoritative Dataset: data/insurance_policies_20000.csv (20,000 records)

Architecture:
  1. policy_products    (200 catalog templates)
  2. customers          (20,000 unique customers)
  3. customer_policies  (20,000 customer contracts)
  4. payment_summary    (20,000 payment performance records)
  5. claim_summary      (20,000 claims metrics records)
  6. risk_scores        (0 initially - ML output destination)
  7. renewal_offers     (0 initially - ML output destination)
  8. interactions       (0 initially - runtime interactions)
  9. retention_actions  (0 initially - runtime retention actions)

Usage:
    python database/seed_database.py
    python database/seed_database.py --reset
>>>>>>> 39e2ec5fbf1c01686a442360794d731fe05b21e6
"""
import csv
import random
import hashlib
from datetime import date, timedelta, datetime
import sys
<<<<<<< HEAD
import os
=======
import argparse
import time
from urllib.parse import urlparse
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values, RealDictCursor
from dotenv import load_dotenv
>>>>>>> 39e2ec5fbf1c01686a442360794d731fe05b21e6

# Add parent to path for app imports
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.join(script_dir, '..')
sys.path.insert(0, project_root)
sys.path.insert(0, os.path.join(project_root, 'backend'))
from app.database import engine
from sqlalchemy import text

CSV_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'insurance_policies_20000 (1).csv')

<<<<<<< HEAD
# ─── Realistic Indian Data Pools ───────────────────────────────────────────────
INDIAN_CITIES = [
    ("Mumbai", "Maharashtra", "400001"), ("Delhi", "Delhi", "110001"),
    ("Bengaluru", "Karnataka", "560001"), ("Hyderabad", "Telangana", "500001"),
    ("Chennai", "Tamil Nadu", "600001"), ("Kolkata", "West Bengal", "700001"),
    ("Pune", "Maharashtra", "411001"), ("Ahmedabad", "Gujarat", "380001"),
    ("Jaipur", "Rajasthan", "302001"), ("Lucknow", "Uttar Pradesh", "226001"),
    ("Surat", "Gujarat", "395001"), ("Kochi", "Kerala", "682001"),
    ("Chandigarh", "Chandigarh", "160001"), ("Indore", "Madhya Pradesh", "452001"),
    ("Gurgaon", "Haryana", "122001"), ("Noida", "Uttar Pradesh", "201301"),
    ("Nagpur", "Maharashtra", "440001"), ("Vadodara", "Gujarat", "390001"),
    ("Coimbatore", "Tamil Nadu", "641001"), ("Bhopal", "Madhya Pradesh", "462001"),
    ("Visakhapatnam", "Andhra Pradesh", "530001"), ("Patna", "Bihar", "800001"),
    ("Thiruvananthapuram", "Kerala", "695001"), ("Mangalore", "Karnataka", "575001"),
    ("Ranchi", "Jharkhand", "834001"), ("Guwahati", "Assam", "781001"),
    ("Dehradun", "Uttarakhand", "248001"), ("Raipur", "Chhattisgarh", "492001"),
    ("Mysuru", "Karnataka", "570001"), ("Nashik", "Maharashtra", "422001"),
]

FIRST_NAMES_MALE = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
                     "Rohan", "Dhruv", "Kabir", "Ansh", "Arnav", "Rudra", "Shaurya", "Yash", "Atharv", "Aarush",
                     "Advait", "Ritvik", "Darsh", "Parth", "Rishi", "Dev", "Mihir", "Harsh", "Nikhil", "Pranav",
                     "Vikram", "Rahul", "Amit", "Rajesh", "Suresh", "Manish", "Deepak", "Naveen", "Karthik", "Varun",
                     "Hemant", "Gaurav", "Sanjay", "Rakesh", "Ajay", "Pankaj", "Rohit", "Sachin", "Ashish", "Manoj"]

FIRST_NAMES_FEMALE = ["Aadhya", "Ananya", "Diya", "Myra", "Sara", "Kiara", "Aanya", "Avni", "Prisha", "Ira",
                      "Aditi", "Nisha", "Riya", "Meera", "Pooja", "Neha", "Kavita", "Shreya", "Divya", "Swati",
                      "Priya", "Sunita", "Sneha", "Ritu", "Tanvi", "Anjali", "Simran", "Deepika", "Pallavi", "Shalini",
                      "Komal", "Geeta", "Sapna", "Shweta", "Bhavna", "Archana", "Preeti", "Rekha", "Jyoti", "Nandini"]

LAST_NAMES = ["Sharma", "Verma", "Patel", "Rao", "Gupta", "Singh", "Kumar", "Joshi", "Mehta", "Nair",
              "Reddy", "Pillai", "Iyer", "Deshmukh", "Chopra", "Khanna", "Malhotra", "Agarwal", "Bhat", "Thakur",
              "Saxena", "Mishra", "Tiwari", "Pandey", "Dubey", "Sinha", "Kapoor", "Chauhan", "Yadav", "Bhatt",
              "Jain", "Shah", "Das", "Mukherjee", "Banerjee", "Chatterjee", "Sen", "Roy", "Ghosh", "Bose"]

PHONE_PREFIXES = ["98", "97", "96", "95", "94", "93", "91", "90", "89", "88", "87", "86", "85", "84", "83", "82", "81", "80", "79", "78"]

EMAIL_DOMAINS = ["gmail.com", "yahoo.co.in", "outlook.com", "hotmail.com", "rediffmail.com", "enterprise.in", "protonmail.com"]

POLICY_STATUSES = ["Renewed", "Renewed", "Renewed", "Renewed", "Renewed", "Renewed", "Renewed", "Lapsed", "Lapsed", "Active"]

def deterministic_hash(s: str) -> int:
    return int(hashlib.md5(s.encode()).hexdigest(), 16)

def generate_customer_name(customer_id: str, gender: str) -> str:
    h = deterministic_hash(customer_id)
    if gender.lower() == 'female':
        first = FIRST_NAMES_FEMALE[h % len(FIRST_NAMES_FEMALE)]
    elif gender.lower() == 'male':
        first = FIRST_NAMES_MALE[h % len(FIRST_NAMES_MALE)]
    else:
        pool = FIRST_NAMES_MALE + FIRST_NAMES_FEMALE
        first = pool[h % len(pool)]
    last = LAST_NAMES[(h >> 8) % len(LAST_NAMES)]
    return f"{first} {last}"
=======
def get_db_connection(max_retries=10, retry_delay=2):
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        result = urlparse(database_url)
        conn_params = {
            "dbname": result.path[1:],
            "user": result.username,
            "password": result.password,
            "host": result.hostname or "localhost",
            "port": result.port or 5433
        }
    else:
        conn_params = {
            "dbname": os.getenv("POSTGRES_DB", "insurance_retention"),
            "user": os.getenv("POSTGRES_USER", "postgres"),
            "password": os.getenv("POSTGRES_PASSWORD", "postgres"),
            "host": os.getenv("POSTGRES_HOST", "localhost"),
            "port": int(os.getenv("POSTGRES_PORT", 5433))
        }
>>>>>>> 39e2ec5fbf1c01686a442360794d731fe05b21e6

def generate_phone(customer_id: str) -> str:
    h = deterministic_hash(customer_id)
    prefix = PHONE_PREFIXES[h % len(PHONE_PREFIXES)]
    suffix = str(h % 100000000).zfill(8)
    return f"+91 {prefix}{suffix[:3]} {suffix[3:5]} {suffix[5:]}"

def generate_email(name: str, customer_id: str) -> str:
    h = deterministic_hash(customer_id)
    parts = name.lower().split()
    domain = EMAIL_DOMAINS[h % len(EMAIL_DOMAINS)]
    num = h % 999
    return f"{parts[0]}.{parts[-1]}{num}@{domain}"

<<<<<<< HEAD
def get_city_state_zip(customer_id: str):
    h = deterministic_hash(customer_id)
    city, state, pin = INDIAN_CITIES[h % len(INDIAN_CITIES)]
    return city, state, pin

def compute_risk_score(row: dict) -> tuple:
    """Compute a realistic risk score from CSV behavioral data."""
    score = 10  # base score
    late_count = int(row.get('late_payment_count', 0))
    on_time = float(row.get('on_time_payment_rate', 100.0))
    rejected = int(row.get('rejected_claims', 0))
    prem_inc = float(row.get('premium_increase_pct', 0))
    days_renewal = int(row.get('days_to_renewal', 60))
    tenure = float(row.get('customer_tenure_years', 5.0))

    # Late payment contribution
    if late_count >= 5:
        score += 30
    elif late_count >= 3:
        score += 22
    elif late_count >= 1:
        score += 12

    # On-time rate
    if on_time < 30:
        score += 20
    elif on_time < 50:
        score += 14
    elif on_time < 70:
        score += 8

    # Rejected claims
    if rejected >= 3:
        score += 22
    elif rejected >= 1:
        score += 14

    # Premium increase shock
    if prem_inc > 15:
        score += 15
    elif prem_inc > 10:
        score += 10
    elif prem_inc > 5:
        score += 5

    # Proximity to renewal
    if days_renewal <= 7:
        score += 8
    elif days_renewal <= 14:
        score += 5

    # Short tenure fragility
    if tenure < 1.0:
        score += 8
    elif tenure < 2.0:
        score += 4

    # Add small randomness
    score += random.randint(-5, 5)
    score = max(5, min(99, score))

    if score >= 70:
        level = 'HIGH'
    elif score >= 40:
        level = 'MEDIUM'
    else:
        level = 'LOW'

    return score, level

def main():
    print(f"[1/6] Reading CSV from {CSV_PATH}...")
    with open(CSV_PATH, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    print(f"       Loaded {len(rows)} rows")

    # ─── Collect unique customers ───────────────────────────────────────────
    customers = {}  # customer_id -> customer data
    policies = []
    payment_summaries = []
    claim_summaries = []
    risk_scores_data = []
    renewal_offers_data = []

    random.seed(42)  # reproducible

    for i, row in enumerate(rows):
        cid = row['customer_id']
        age = int(row['customer_age'])
        gender = row['customer_gender']
        occupation = row['customer_occupation']
        tenure = float(row['customer_tenure_years'])

        # Generate customer if not seen
        if cid not in customers:
            city, state, pin = get_city_state_zip(cid)
            name = generate_customer_name(cid, gender)
            phone = generate_phone(cid)
            email = generate_email(name, cid)
            customers[cid] = {
                'customer_id': cid,
                'customer_name': name,
                'customer_age': age,
                'customer_gender': gender,
                'customer_occupation': occupation,
                'customer_city': city,
                'customer_state': state,
                'customer_postal_code': pin,
                'customer_country': 'India',
                'customer_tenure_years': tenure,
                'customer_phone': phone,
                'customer_email': email,
            }

        # Generate unique policy_id per row (CSV policy_id is a template code)
        unique_policy_id = f"{row['policy_id']}-{cid}"  # e.g. P001-CUST000001
        premium = float(row['premium_amount'])
        prev_premium = float(row['previous_premium_amount'])
        prem_inc = float(row['premium_increase_pct'])
        days_renewal = int(row['days_to_renewal'])
        freq = row['payment_frequency']
        policy_type = row['policy_type']

        # Compute dates
        today = date(2025, 10, 25)
        renewal_dt = today + timedelta(days=days_renewal)
        start_dt = renewal_dt - timedelta(days=365)
        status = random.choice(POLICY_STATUSES)

        policies.append({
            'policy_id': unique_policy_id,
            'customer_id': cid,
            'policy_type': policy_type,
            'policy_start_date': start_dt.isoformat(),
            'policy_end_date': renewal_dt.isoformat(),
            'premium_amount': premium,
            'previous_premium_amount': prev_premium,
            'premium_increase_pct': prem_inc,
            'payment_frequency': freq,
            'policy_status': status,
            'days_to_renewal': days_renewal,
            'renewal_date': renewal_dt.isoformat(),
        })

        # Payment summary
        has_late = row['has_late_payments'].strip().lower() == 'true'
        late_count = int(row['late_payment_count'])
        avg_late = float(row['avg_days_late'])
        on_time = float(row['on_time_payment_rate'])
        payment_summaries.append({
            'policy_id': unique_policy_id,
            'has_late_payments': has_late,
            'late_payment_count': late_count,
            'avg_days_late': avg_late,
            'on_time_payment_rate': on_time,
        })

        # Claim summary
        num_claims = int(row['num_claims_last_year'])
        total_claim = float(row['total_claim_amount_last_year'])
        rejected = int(row['rejected_claims'])
        approved = int(row['claims_approved'])
        claim_summaries.append({
            'policy_id': unique_policy_id,
            'num_claims_last_year': num_claims,
            'total_claim_amount_last_year': total_claim,
            'rejected_claims': rejected,
            'claims_approved': approved,
        })

        # Risk scores (computed from actual behavioral data)
        risk_score, risk_level = compute_risk_score(row)
        risk_scores_data.append({
            'policy_id': unique_policy_id,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'model_version': 'gemini-actuarial-v1',
        })

        # Renewal offers
        if risk_score >= 70:
            offer_type = random.choice(['Loyalty Discount 15%', 'Premium Freeze', 'Flexible EMI Plan', 'Cashback Offer'])
            offer_amount = round(premium * random.uniform(0.08, 0.18), 2)
        elif risk_score >= 40:
            offer_type = random.choice(['Early Bird 5%', 'Auto-Debit Incentive', 'NCB Protection Bundle'])
            offer_amount = round(premium * random.uniform(0.03, 0.08), 2)
        else:
            offer_type = 'Standard Renewal'
            offer_amount = 0.0

        renewal_offers_data.append({
            'policy_id': unique_policy_id,
            'offer_type': offer_type,
            'offer_amount': offer_amount,
            'offer_sent': random.random() < 0.3,
            'offer_accepted': random.random() < 0.15,
            'model_version': 'nemotron-3.5-lightning',
        })

    print(f"[2/6] Parsed {len(customers)} unique customers, {len(policies)} policies")

    # ─── Truncate existing data ─────────────────────────────────────────────
    # ─── Fast Bulk Insert Using execute_values ──────────────────────────
    from psycopg2.extras import execute_values

    print("[3/6] Truncating existing tables...")
    raw_conn = engine.raw_connection()
    cur = raw_conn.cursor()

    cur.execute("TRUNCATE TABLE interactions, retention_actions, renewal_offers, risk_scores, claim_summary, payment_summary, policies, customers CASCADE")
    raw_conn.commit()

    print(f"[4/6] Inserting {len(customers)} customers via bulk execute_values...")
    cust_tuples = [
        (c['customer_id'], c['customer_name'], c['customer_age'], c['customer_gender'], c['customer_occupation'],
         c['customer_city'], c['customer_state'], c['customer_postal_code'], c['customer_country'], c['customer_tenure_years'],
         c['customer_phone'], c['customer_email'])
        for c in customers.values()
=======
def resolve_csv_path(user_path=None):
    candidate_paths = [
        user_path,
        "data/insurance_policies_20000.csv",
        "insurance_policies_20000.csv",
        "../data/insurance_policies_20000.csv",
        "../insurance_policies_20000.csv"
>>>>>>> 39e2ec5fbf1c01686a442360794d731fe05b21e6
    ]
    execute_values(
        cur,
        """
        INSERT INTO customers (customer_id, customer_name, customer_age, customer_gender, customer_occupation,
                              customer_city, customer_state, customer_postal_code, customer_country, customer_tenure_years,
                              customer_phone, customer_email)
        VALUES %s
        ON CONFLICT (customer_id) DO NOTHING
        """,
        cust_tuples,
        page_size=2000
    )
    raw_conn.commit()
    print("       Customers inserted successfully!")

    print(f"[5/6] Inserting {len(policies)} policies, payment summaries, claims, risk scores, renewal offers...")
    
<<<<<<< HEAD
    # 1. Policies
    pol_tuples = [
        (p['policy_id'], p['customer_id'], p['policy_type'], p['policy_start_date'], p['policy_end_date'],
         p['premium_amount'], p['previous_premium_amount'], p['premium_increase_pct'], p['payment_frequency'],
         p['policy_status'], p['days_to_renewal'], p['renewal_date'])
        for p in policies
    ]
    execute_values(
        cur,
        """
        INSERT INTO policies (policy_id, customer_id, policy_type, policy_start_date, policy_end_date,
                             premium_amount, previous_premium_amount, premium_increase_pct, payment_frequency,
                             policy_status, days_to_renewal, renewal_date)
        VALUES %s
        ON CONFLICT (policy_id) DO NOTHING
        """,
        pol_tuples,
        page_size=2000
    )
    raw_conn.commit()
    print("       Policies inserted!")

    # 2. Payment summary
    pay_tuples = [
        (ps['policy_id'], ps['has_late_payments'], ps['late_payment_count'], ps['avg_days_late'], ps['on_time_payment_rate'])
        for ps in payment_summaries
    ]
    execute_values(
        cur,
        """
        INSERT INTO payment_summary (policy_id, has_late_payments, late_payment_count, avg_days_late, on_time_payment_rate)
        VALUES %s
        ON CONFLICT (policy_id) DO NOTHING
        """,
        pay_tuples,
        page_size=2000
    )
    raw_conn.commit()
    print("       Payment summaries inserted!")

    # 3. Claim summary
    claim_tuples = [
        (cs['policy_id'], cs['num_claims_last_year'], cs['total_claim_amount_last_year'], cs['rejected_claims'], cs['claims_approved'])
        for cs in claim_summaries
    ]
    execute_values(
        cur,
        """
        INSERT INTO claim_summary (policy_id, num_claims_last_year, total_claim_amount_last_year, rejected_claims, claims_approved)
        VALUES %s
        ON CONFLICT (policy_id) DO NOTHING
        """,
        claim_tuples,
        page_size=2000
    )
    raw_conn.commit()
    print("       Claim summaries inserted!")

    # 4. Risk scores
    risk_tuples = [
        (rs['policy_id'], rs['risk_score'], rs['risk_level'], rs['model_version'])
        for rs in risk_scores_data
    ]
    execute_values(
        cur,
        """
        INSERT INTO risk_scores (policy_id, risk_score, risk_level, model_version)
        VALUES %s
        """,
        risk_tuples,
        page_size=2000
    )
    raw_conn.commit()
    print("       Risk scores inserted!")

    # 5. Renewal offers
    offer_tuples = [
        (ro['policy_id'], ro['offer_type'], ro['offer_amount'], ro['offer_sent'], ro['offer_accepted'], ro['model_version'])
        for ro in renewal_offers_data
    ]
    execute_values(
        cur,
        """
        INSERT INTO renewal_offers (policy_id, offer_type, offer_amount, offer_sent, offer_accepted, model_version)
        VALUES %s
        """,
        offer_tuples,
        page_size=2000
    )
    raw_conn.commit()
    print("       Renewal offers inserted!")

    cur.close()
    raw_conn.close()

    # ─── Verify ─────────────────────────────────────────────────────────────
    print("[6/6] Verifying...")
    with engine.connect() as conn:
        for tbl in ['customers', 'policies', 'payment_summary', 'claim_summary', 'risk_scores', 'renewal_offers']:
            cnt = conn.execute(text(f"SELECT COUNT(*) AS cnt FROM {tbl}")).first()
            print(f"       {tbl}: {cnt.cnt} rows")

    print("\n[SUCCESS] Database seeded successfully with 20,000 real CSV records!")

if __name__ == '__main__':
    main()
=======
    print(f"[ERROR] Primary dataset CSV not found in candidate paths: {candidate_paths}")
    sys.exit(1)


def seed_database(csv_path, reset=True):
    print("=" * 80)
    print("INSURANCE RETENTION PLATFORM - 20,000 RECORD SEEDING ENGINE")
    print("=" * 80)
    print(f"Dataset: {csv_path}")

    # 1. Load CSV
    df = pd.read_csv(csv_path)
    total_csv_rows = len(df)
    print(f"[LOAD] Successfully read {total_csv_rows:,} rows from CSV.")

    # 2. Database Connection
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # 3. Apply Schema
        schema_file = os.path.join(os.path.dirname(__file__), "schema.sql")
        if not os.path.exists(schema_file):
            schema_file = os.path.abspath("database/schema.sql")

        if os.path.exists(schema_file):
            print(f"[SCHEMA] Applying database schema from {schema_file}...")
            with open(schema_file, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            cursor.execute(schema_sql)
            conn.commit()
            print("  -> Schema applied successfully.")

        # 4. Step 1: Policy Products (200 catalog products)
        print("[STEP 1/5] Inserting Policy Products (catalog templates)...")
        prod_df = df[["policy_id", "policy_name", "policy_type"]].drop_duplicates()
        prod_records = [
            (str(row["policy_id"]), str(row["policy_name"]), str(row["policy_type"]))
            for _, row in prod_df.iterrows()
        ]

        prod_insert_sql = """
            INSERT INTO policy_products (policy_id, policy_name, policy_type)
            VALUES %s
            ON CONFLICT (policy_id) DO UPDATE SET
                policy_name = EXCLUDED.policy_name,
                policy_type = EXCLUDED.policy_type;
        """
        execute_values(cursor, prod_insert_sql, prod_records, page_size=1000)
        print(f"  -> Inserted {len(prod_records)} policy products.")

        # 5. Step 2: Customers (20,000 unique customers)
        print("[STEP 2/5] Inserting Customers (20,000 unique records)...")
        cust_df = df[["customer_id", "customer_age", "customer_gender", "customer_occupation", "customer_tenure_years"]].drop_duplicates(subset=["customer_id"])
        cust_records = [
            (
                str(row["customer_id"]),
                int(row["customer_age"]),
                str(row["customer_gender"]),
                str(row["customer_occupation"]),
                None,  # city
                None,  # state
                None,  # postal
                None,  # country
                float(row["customer_tenure_years"])
            )
            for _, row in cust_df.iterrows()
        ]

        cust_insert_sql = """
            INSERT INTO customers (
                customer_id, customer_age, customer_gender, customer_occupation,
                customer_city, customer_state, customer_postal_code, customer_country, customer_tenure_years
            ) VALUES %s
            ON CONFLICT (customer_id) DO UPDATE SET
                customer_age = EXCLUDED.customer_age,
                customer_gender = EXCLUDED.customer_gender,
                customer_occupation = EXCLUDED.customer_occupation,
                customer_tenure_years = EXCLUDED.customer_tenure_years;
        """
        execute_values(cursor, cust_insert_sql, cust_records, page_size=2000)
        print(f"  -> Inserted {len(cust_records):,} unique customers.")

        # 6. Step 3: Customer Policies (20,000 contracts)
        print("[STEP 3/5] Inserting Customer Policies (20,000 contracts)...")
        policy_records = [
            (
                str(row["customer_id"]),
                str(row["policy_id"]),
                float(row["premium_amount"]),
                float(row["previous_premium_amount"]),
                float(row["premium_increase_pct"]),
                str(row["payment_frequency"]),
                int(row["days_to_renewal"]),
                "Active"
            )
            for _, row in df.iterrows()
        ]

        policy_insert_sql = """
            INSERT INTO customer_policies (
                customer_id, policy_id, premium_amount, previous_premium_amount,
                premium_increase_pct, payment_frequency, days_to_renewal, policy_status
            ) VALUES %s
            ON CONFLICT (customer_id, policy_id) DO UPDATE SET
                premium_amount = EXCLUDED.premium_amount,
                previous_premium_amount = EXCLUDED.previous_premium_amount,
                premium_increase_pct = EXCLUDED.premium_increase_pct,
                payment_frequency = EXCLUDED.payment_frequency,
                days_to_renewal = EXCLUDED.days_to_renewal,
                policy_status = EXCLUDED.policy_status;
        """
        execute_values(cursor, policy_insert_sql, policy_records, page_size=2000)
        print(f"  -> Inserted {len(policy_records):,} customer policy contracts.")

        # Lookup customer_policy_id map for foreign keys
        cursor.execute("SELECT customer_policy_id, customer_id, policy_id FROM customer_policies;")
        cp_lookup = {(r["customer_id"], r["policy_id"]): r["customer_policy_id"] for r in cursor.fetchall()}

        # 7. Step 4: Payment Summary (20,000 records)
        print("[STEP 4/5] Inserting Payment Summaries (20,000 records)...")
        payment_records = []
        for _, row in df.iterrows():
            cp_id = cp_lookup.get((str(row["customer_id"]), str(row["policy_id"])))
            payment_records.append((
                cp_id,
                bool(row["has_late_payments"]),
                int(row["late_payment_count"]),
                float(row["avg_days_late"]),
                float(row["on_time_payment_rate"])
            ))

        pay_insert_sql = """
            INSERT INTO payment_summary (
                customer_policy_id, has_late_payments, late_payment_count, avg_days_late, on_time_payment_rate
            ) VALUES %s
            ON CONFLICT (customer_policy_id) DO UPDATE SET
                has_late_payments = EXCLUDED.has_late_payments,
                late_payment_count = EXCLUDED.late_payment_count,
                avg_days_late = EXCLUDED.avg_days_late,
                on_time_payment_rate = EXCLUDED.on_time_payment_rate;
        """
        execute_values(cursor, pay_insert_sql, payment_records, page_size=2000)
        print(f"  -> Inserted {len(payment_records):,} payment summary records.")

        # 8. Step 5: Claim Summary (20,000 records)
        print("[STEP 5/5] Inserting Claim Summaries (20,000 records)...")
        claim_records = []
        for _, row in df.iterrows():
            cp_id = cp_lookup.get((str(row["customer_id"]), str(row["policy_id"])))
            claim_records.append((
                cp_id,
                int(row["num_claims_last_year"]),
                float(row["total_claim_amount_last_year"]),
                int(row["rejected_claims"]),
                int(row["claims_approved"])
            ))

        claim_insert_sql = """
            INSERT INTO claim_summary (
                customer_policy_id, num_claims_last_year, total_claim_amount_last_year, rejected_claims, claims_approved
            ) VALUES %s
            ON CONFLICT (customer_policy_id) DO UPDATE SET
                num_claims_last_year = EXCLUDED.num_claims_last_year,
                total_claim_amount_last_year = EXCLUDED.total_claim_amount_last_year,
                rejected_claims = EXCLUDED.rejected_claims,
                claims_approved = EXCLUDED.claims_approved;
        """
        execute_values(cursor, claim_insert_sql, claim_records, page_size=2000)
        print(f"  -> Inserted {len(claim_records):,} claim summary records.")

        # Commit all changes
        conn.commit()
        print("\n[SUCCESS] Seeding completed successfully. Verifying database state...")

        # Validation
        tables_to_check = [
            "policy_products",
            "customers",
            "customer_policies",
            "payment_summary",
            "claim_summary",
            "risk_scores",
            "renewal_offers",
            "interactions",
            "retention_actions"
        ]
        print("-" * 50)
        print(f"{'Table':<25} | {'Row Count':>15}")
        print("-" * 50)
        for tbl in tables_to_check:
            cursor.execute(f"SELECT COUNT(*) AS cnt FROM {tbl};")
            cnt = cursor.fetchone()["cnt"]
            print(f"{tbl:<25} | {cnt:>15,}")
        print("-" * 50)

        views_to_check = [
            "policy_model_features",
            "lapse_model_inference_data",
            "portfolio_renewals",
            "retention_dashboard_summary"
        ]
        print(f"{'View':<30} | {'Row Count':>10}")
        print("-" * 50)
        for vw in views_to_check:
            cursor.execute(f"SELECT COUNT(*) AS cnt FROM {vw};")
            cnt = cursor.fetchone()["cnt"]
            print(f"{vw:<30} | {cnt:>10,}")
        print("=" * 50)

    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Seeding failed: {e}")
        raise e
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed Insurance Retention PostgreSQL Database with 20K Dataset")
    parser.add_argument("--file", type=str, default=None, help="Path to 20,000-row CSV file")
    parser.add_argument("--reset", action="store_true", help="Reset schema and reseed")
    args = parser.parse_args()

    csv_path = resolve_csv_path(args.file)
    seed_database(csv_path, reset=args.reset)
>>>>>>> 39e2ec5fbf1c01686a442360794d731fe05b21e6
