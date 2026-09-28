"""
=============================================================================
Insurance Retention Platform - Database Seeding Engine (10,000 Policies)
=============================================================================
This script normalizes the authoritative 10,000-row dataset
(insurance_policy_renewal_10000.csv) into normalized PostgreSQL tables:
  1. customers
  2. policies
  3. payment_summary
  4. claim_summary
  5. risk_scores (historical baseline)
  6. renewal_offers (historical baseline)

Usage:
    python database/seed_database.py
    python database/seed_database.py --reset
    python database/seed_database.py --file data/insurance_policy_renewal_10000.csv
"""

import os
import sys
import argparse
import time
from datetime import datetime
from urllib.parse import urlparse
import pandas as pd
import numpy as np
import psycopg2
from psycopg2.extras import execute_values, RealDictCursor
from dotenv import load_dotenv

load_dotenv()


def get_db_connection(max_retries=10, retry_delay=2):
    """Establishes connection to PostgreSQL with retry mechanism."""
    database_url = os.getenv("DATABASE_URL")
    
    if database_url:
        result = urlparse(database_url)
        conn_params = {
            "dbname": result.path[1:],
            "user": result.username,
            "password": result.password,
            "host": result.hostname or "localhost",
            "port": result.port or 5432
        }
    else:
        conn_params = {
            "dbname": os.getenv("POSTGRES_DB", "insurance_retention"),
            "user": os.getenv("POSTGRES_USER", "postgres"),
            "password": os.getenv("POSTGRES_PASSWORD", "postgres"),
            "host": os.getenv("POSTGRES_HOST", "localhost"),
            "port": int(os.getenv("POSTGRES_PORT", 5432))
        }

    for attempt in range(1, max_retries + 1):
        try:
            conn = psycopg2.connect(**conn_params)
            conn.autocommit = False
            return conn
        except psycopg2.OperationalError as e:
            if attempt == max_retries:
                print(f"[ERROR] Could not connect to PostgreSQL at {conn_params['host']}:{conn_params['port']} after {max_retries} attempts.")
                print(f"Details: {e}")
                sys.exit(1)
            print(f"[WAIT] Waiting for PostgreSQL to become ready (attempt {attempt}/{max_retries})...")
            time.sleep(retry_delay)


def resolve_csv_path(user_path=None):
    """Locates the 10000-row primary CSV dataset file."""
    candidate_paths = [
        user_path,
        "data/insurance_policy_renewal_10000.csv",
        "insurance_policy_renewal_10000.csv",
        "../data/insurance_policy_renewal_10000.csv",
        "../insurance_policy_renewal_10000.csv",
        "data/insurance-policy-renewal-prediction.csv"
    ]
    for path in candidate_paths:
        if path and os.path.exists(path):
            return os.path.abspath(path)
    
    print(f"[ERROR] Primary dataset CSV not found in any standard paths: {candidate_paths}")
    sys.exit(1)


def parse_date_dmy(date_val):
    """Converts DD-MM-YYYY strings or timestamps to YYYY-MM-DD standard SQL strings."""
    if pd.isna(date_val) or str(date_val).strip() == "":
        return None
    try:
        dt = datetime.strptime(str(date_val).strip(), "%d-%m-%Y")
        return dt.strftime("%Y-%m-%d")
    except ValueError:
        try:
            dt = datetime.strptime(str(date_val).strip(), "%Y-%m-%d")
            return dt.strftime("%Y-%m-%d")
        except Exception:
            return None


def calculate_risk_level(score):
    """Maps continuous risk_score (0-100) to standard categorical risk level."""
    if score < 35.0:
        return "LOW"
    elif score <= 65.0:
        return "MEDIUM"
    else:
        return "HIGH"


def seed_database(csv_path, reset=False):
    """Main ETL pipeline and validation."""
    print("=" * 80)
    print("INSURANCE RETENTION PLATFORM - 10,000 POLICIES SEEDING ENGINE")
    print("=" * 80)
    print(f"Authoritative Dataset: {csv_path}")

    # 1. Load CSV with pandas
    df = pd.read_csv(csv_path)
    total_csv_rows = len(df)
    print(f"Loaded {total_csv_rows} rows from dataset.")

    # 2. Database Connection
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # Check and apply schema if tables don't exist yet
        schema_file = os.path.join(os.path.dirname(__file__), "schema.sql")
        if os.path.exists(schema_file):
            cursor.execute("SELECT to_regclass('public.policies');")
            policies_exist = cursor.fetchone()["to_regclass"] is not None
            if not policies_exist or reset:
                print(f"[INFO] Initializing/resetting schema from {schema_file}...")
                with open(schema_file, "r", encoding="utf-8") as f:
                    schema_sql = f.read()
                cursor.execute(schema_sql)
                conn.commit()

        if reset:
            print("[INFO] Truncating seed tables...")
            cursor.execute("""
                TRUNCATE TABLE retention_actions, interactions, renewal_offers, risk_scores, claim_summary, payment_summary, policies, customers RESTART IDENTITY CASCADE;
            """)
            conn.commit()

        # -------------------------------------------------------------------------
        # Step A: Deduplicate and Insert Customers (8,223 unique customers)
        # -------------------------------------------------------------------------
        print("[STEP 1/6] Processing and inserting Customers...")
        cust_df = df.groupby("customer_id").agg({
            "customer_age": "first",
            "customer_gender": "first",
            "customer_occupation": "first",
            "customer_city": "first",
            "customer_state": "first",
            "customer_postal_code": "first",
            "customer_country": "first",
            "customer_tenure_years": "max"  # Authoritative customer lifetime tenure
        }).reset_index()

        cust_records = [
            (
                row["customer_id"],
                int(row["customer_age"]),
                str(row["customer_gender"]),
                str(row["customer_occupation"]),
                str(row["customer_city"]),
                str(row["customer_state"]),
                str(row["customer_postal_code"]),
                str(row["customer_country"]),
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
                customer_occupation = EXCLUDED.customer_occupation,
                customer_city = EXCLUDED.customer_city,
                customer_state = EXCLUDED.customer_state,
                customer_tenure_years = EXCLUDED.customer_tenure_years;
        """
        execute_values(cursor, cust_insert_sql, cust_records, page_size=1000)
        print(f"  -> Successfully inserted/upserted {len(cust_records)} unique customers.")

        # -------------------------------------------------------------------------
        # Step B: Insert Policies (10,000 distinct policies)
        # -------------------------------------------------------------------------
        print("[STEP 2/6] Processing and inserting Policies...")
        policy_records = []
        for _, row in df.iterrows():
            start_d = parse_date_dmy(row["policy_start_date"])
            end_d = parse_date_dmy(row["policy_end_date"])
            ren_d = parse_date_dmy(row["renewal_date"]) if pd.notna(row["renewal_date"]) else None
            
            policy_records.append((
                str(row["policy_id"]),
                str(row["customer_id"]),
                str(row["policy_type"]),
                start_d,
                end_d,
                float(row["premium_amount"]),
                float(row["previous_premium_amount"]),
                float(row["premium_increase_pct"]),
                str(row["payment_frequency"]),
                str(row["policy_status"]),
                int(row["days_to_renewal"]),
                ren_d
            ))

        policy_insert_sql = """
            INSERT INTO policies (
                policy_id, customer_id, policy_type, policy_start_date, policy_end_date,
                premium_amount, previous_premium_amount, premium_increase_pct,
                payment_frequency, policy_status, days_to_renewal, renewal_date
            ) VALUES %s
            ON CONFLICT (policy_id) DO UPDATE SET
                premium_amount = EXCLUDED.premium_amount,
                previous_premium_amount = EXCLUDED.previous_premium_amount,
                premium_increase_pct = EXCLUDED.premium_increase_pct,
                policy_status = EXCLUDED.policy_status,
                days_to_renewal = EXCLUDED.days_to_renewal,
                renewal_date = EXCLUDED.renewal_date;
        """
        execute_values(cursor, policy_insert_sql, policy_records, page_size=1000)
        print(f"  -> Successfully inserted/upserted {len(policy_records)} policies.")

        # -------------------------------------------------------------------------
        # Step C: Insert Payment Summary (10,000 rows)
        # -------------------------------------------------------------------------
        print("[STEP 3/6] Processing and inserting Payment Summaries...")
        payment_records = [
            (
                str(row["policy_id"]),
                bool(row["has_late_payments"]),
                int(row["late_payment_count"]),
                float(row["avg_days_late"]),
                float(row["on_time_payment_rate"])
            )
            for _, row in df.iterrows()
        ]

        pay_insert_sql = """
            INSERT INTO payment_summary (
                policy_id, has_late_payments, late_payment_count, avg_days_late, on_time_payment_rate
            ) VALUES %s
            ON CONFLICT (policy_id) DO UPDATE SET
                has_late_payments = EXCLUDED.has_late_payments,
                late_payment_count = EXCLUDED.late_payment_count,
                avg_days_late = EXCLUDED.avg_days_late,
                on_time_payment_rate = EXCLUDED.on_time_payment_rate;
        """
        execute_values(cursor, pay_insert_sql, payment_records, page_size=1000)
        print(f"  -> Successfully inserted/upserted {len(payment_records)} payment summaries.")

        # -------------------------------------------------------------------------
        # Step D: Insert Claim Summary (10,000 rows)
        # -------------------------------------------------------------------------
        print("[STEP 4/6] Processing and inserting Claim Summaries...")
        claim_records = [
            (
                str(row["policy_id"]),
                int(row["num_claims_last_year"]),
                float(row["total_claim_amount_last_year"]),
                int(row["rejected_claims"]),
                int(row["claims_approved"])
            )
            for _, row in df.iterrows()
        ]

        claim_insert_sql = """
            INSERT INTO claim_summary (
                policy_id, num_claims_last_year, total_claim_amount_last_year, rejected_claims, claims_approved
            ) VALUES %s
            ON CONFLICT (policy_id) DO UPDATE SET
                num_claims_last_year = EXCLUDED.num_claims_last_year,
                total_claim_amount_last_year = EXCLUDED.total_claim_amount_last_year,
                rejected_claims = EXCLUDED.rejected_claims,
                claims_approved = EXCLUDED.claims_approved;
        """
        execute_values(cursor, claim_insert_sql, claim_records, page_size=1000)
        print(f"  -> Successfully inserted/upserted {len(claim_records)} claim summaries.")

        # -------------------------------------------------------------------------
        # Step E: Insert Risk Scores (Historical Reference Output: 10,000 rows)
        # -------------------------------------------------------------------------
        print("[STEP 5/6] Processing and inserting Reference Risk Scores...")
        risk_records = []
        for _, row in df.iterrows():
            score = float(row["risk_score"])
            level = calculate_risk_level(score)
            risk_records.append((
                str(row["policy_id"]),
                score,
                level,
                "historical_csv"
            ))

        risk_insert_sql = """
            INSERT INTO risk_scores (policy_id, risk_score, risk_level, model_version)
            VALUES %s;
        """
        execute_values(cursor, risk_insert_sql, risk_records, page_size=1000)
        print(f"  -> Successfully inserted {len(risk_records)} reference risk score records.")

        # -------------------------------------------------------------------------
        # Step F: Insert Renewal Offers (Historical Reference Output: 10,000 rows)
        # -------------------------------------------------------------------------
        print("[STEP 6/6] Processing and inserting Reference Renewal Offers...")
        offer_records = []
        for _, row in df.iterrows():
            offer_sent = bool(row["renewal_offer_sent"])
            offer_amt = float(row["renewal_offer_amount"]) if pd.notna(row["renewal_offer_amount"]) else None
            offer_tp = str(row["renewal_offer_type"]) if pd.notna(row["renewal_offer_type"]) else None
            offer_acc = bool(row["offer_accepted"])

            offer_records.append((
                str(row["policy_id"]),
                offer_tp,
                offer_amt,
                offer_sent,
                offer_acc,
                "historical_csv"
            ))

        offer_insert_sql = """
            INSERT INTO renewal_offers (policy_id, offer_type, offer_amount, offer_sent, offer_accepted, model_version)
            VALUES %s;
        """
        execute_values(cursor, offer_insert_sql, offer_records, page_size=1000)
        print(f"  -> Successfully inserted {len(offer_records)} reference renewal offer records.")

        # Commit Entire Transaction
        conn.commit()
        print("[SUCCESS] All tables committed successfully in transaction.")

        # -------------------------------------------------------------------------
        # Step G: Data Quality & Integrity Validation
        # -------------------------------------------------------------------------
        print("\n" + "=" * 80)
        print("DATABASE SEEDING INTEGRITY & VALIDATION REPORT")
        print("=" * 80)

        cursor.execute("SELECT COUNT(*) AS cnt FROM customers;")
        cnt_cust = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM policies;")
        cnt_pol = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM payment_summary;")
        cnt_pay = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM claim_summary;")
        cnt_claim = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM risk_scores;")
        cnt_risk = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM renewal_offers;")
        cnt_offers = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM interactions;")
        cnt_interact = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM retention_actions;")
        cnt_actions = cursor.fetchone()["cnt"]

        # Check views
        cursor.execute("SELECT COUNT(*) AS cnt FROM policy_model_features;")
        cnt_features = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM lapse_model_training_data;")
        cnt_training = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM lapse_model_inference_data;")
        cnt_inference = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM upcoming_renewals;")
        cnt_upcoming = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM customer_360;")
        cnt_c360 = cursor.fetchone()["cnt"]

        cursor.execute("SELECT COUNT(*) AS cnt FROM lapsed_customers;")
        cnt_lapsed = cursor.fetchone()["cnt"]

        # Check orphan relations
        cursor.execute("""
            SELECT 
                (SELECT COUNT(*) FROM policies WHERE customer_id NOT IN (SELECT customer_id FROM customers)) AS orphan_policies,
                (SELECT COUNT(*) FROM payment_summary WHERE policy_id NOT IN (SELECT policy_id FROM policies)) AS orphan_payments,
                (SELECT COUNT(*) FROM claim_summary WHERE policy_id NOT IN (SELECT policy_id FROM policies)) AS orphan_claims,
                (SELECT COUNT(*) FROM risk_scores WHERE policy_id NOT IN (SELECT policy_id FROM policies)) AS orphan_risk,
                (SELECT COUNT(*) FROM renewal_offers WHERE policy_id NOT IN (SELECT policy_id FROM policies)) AS orphan_offers;
        """)
        orphans = cursor.fetchone()

        print(f"Source CSV Rows:                        {total_csv_rows}")
        print(f"Customers Inserted:                     {cnt_cust} (Unique primary keys)")
        print(f"Policies Inserted:                      {cnt_pol} (Exact 10,000 required)")
        print(f"Payment Summaries Inserted:             {cnt_pay}")
        print(f"Claim Summaries Inserted:               {cnt_claim}")
        print(f"Risk Score Reference Records:           {cnt_risk}")
        print(f"Renewal Offer Reference Records:        {cnt_offers}")
        print(f"Interactions Count:                     {cnt_interact} (0 fabricated)")
        print(f"Retention Actions Count:                {cnt_actions} (0 fabricated)")
        print("-" * 80)
        print(f"Orphan Records Check:                   {dict(orphans)}")
        print("-" * 80)
        print(f"VIEW: policy_model_features Row Count:  {cnt_features}")
        print(f"VIEW: lapse_model_training_data:        {cnt_training}")
        print(f"VIEW: lapse_model_inference_data:       {cnt_inference}")
        print(f"VIEW: upcoming_renewals:                {cnt_upcoming}")
        print(f"VIEW: customer_360:                     {cnt_c360}")
        print(f"VIEW: lapsed_customers:                 {cnt_lapsed}")
        print("=" * 80)
        print("[STATUS] 10,000-Policy Database Seeding Engine executed successfully!")

    except Exception as e:
        conn.rollback()
        print(f"\n[FATAL ERROR] Seeding aborted and rolled back: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        cursor.close()
        conn.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed PostgreSQL database with 10,000 policy dataset.")
    parser.add_argument("--reset", action="store_true", help="Truncate existing tables before seeding.")
    parser.add_argument("--file", type=str, default=None, help="Path to 10k CSV file.")
    args = parser.parse_args()

    csv_path = resolve_csv_path(args.file)
    seed_database(csv_path, reset=args.reset)
