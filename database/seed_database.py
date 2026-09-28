"""
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
"""

import os
import sys
import argparse
import time
from urllib.parse import urlparse
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values, RealDictCursor
from dotenv import load_dotenv

load_dotenv()


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
    candidate_paths = [
        user_path,
        "data/insurance_policies_20000.csv",
        "insurance_policies_20000.csv",
        "../data/insurance_policies_20000.csv",
        "../insurance_policies_20000.csv"
    ]
    for path in candidate_paths:
        if path and os.path.exists(path):
            return os.path.abspath(path)
    
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