"""
seed_to_sql.py  -- stdlib-only SQL generator for the 20K insurance dataset.
Pipe output directly into psql inside Docker to bypass host auth issues:

    python database/seed_to_sql.py | docker exec -i insurance_retention_postgres psql -U postgres -d insurance_retention
"""
import csv, sys, os

CSV_CANDIDATES = [
    "data/insurance_policies_20000.csv",
    "insurance_policies_20000.csv",
    "../data/insurance_policies_20000.csv",
]

def find_csv():
    for p in CSV_CANDIDATES:
        if os.path.exists(p):
            return p
    print("ERROR: 20K CSV not found", file=sys.stderr); sys.exit(1)

def esc(v):
    if v is None or str(v).strip() == "": return "NULL"
    return "'" + str(v).replace("'", "''") + "'"

def num(v, d="NULL"):
    try: return str(float(v))
    except: return d

def integer(v, d="NULL"):
    try: return str(int(float(v)))
    except: return d

def boolean(v):
    return "TRUE" if str(v).strip().lower() in ("true","1","yes","t") else "FALSE"

def main():
    csv_path = find_csv()
    print(f"-- Source: {csv_path}", file=sys.stderr)
    with open(csv_path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    print(f"-- Loaded {len(rows)} rows", file=sys.stderr)
    out = sys.stdout

    out.write("BEGIN;\n")
    out.write("SET session_replication_role = replica;\n\n")

    # policy_products
    seen_products = {}
    for r in rows:
        pid = r["policy_id"].strip()
        if pid not in seen_products:
            seen_products[pid] = (r["policy_name"].strip(), r["policy_type"].strip())
    out.write(f"-- 1. policy_products ({len(seen_products)} rows)\n")
    out.write("INSERT INTO policy_products (policy_id, policy_name, policy_type) VALUES\n")
    out.write(",\n".join(f"  ({esc(pid)},{esc(pn)},{esc(pt)})" for pid,(pn,pt) in seen_products.items()))
    out.write("\nON CONFLICT (policy_id) DO UPDATE SET policy_name=EXCLUDED.policy_name, policy_type=EXCLUDED.policy_type;\n\n")

    # customers
    seen_customers = {}
    for r in rows:
        cid = r["customer_id"].strip()
        if cid not in seen_customers: seen_customers[cid] = r
    out.write(f"-- 2. customers ({len(seen_customers)} rows)\n")
    out.write("INSERT INTO customers (customer_id,customer_age,customer_gender,customer_occupation,customer_tenure_years) VALUES\n")
    out.write(",\n".join(
        f"  ({esc(cid)},{integer(r['customer_age'])},{esc(r['customer_gender'].strip())},{esc(r.get('customer_occupation','').strip())},{num(r['customer_tenure_years'])})"
        for cid,r in seen_customers.items()
    ))
    out.write("\nON CONFLICT (customer_id) DO UPDATE SET customer_age=EXCLUDED.customer_age, customer_gender=EXCLUDED.customer_gender, customer_occupation=EXCLUDED.customer_occupation, customer_tenure_years=EXCLUDED.customer_tenure_years;\n\n")

    # customer_policies
    out.write(f"-- 3. customer_policies ({len(rows)} rows)\n")
    out.write("INSERT INTO customer_policies (customer_id,policy_id,premium_amount,previous_premium_amount,premium_increase_pct,payment_frequency,days_to_renewal) VALUES\n")
    out.write(",\n".join(
        f"  ({esc(r['customer_id'].strip())},{esc(r['policy_id'].strip())},{num(r['premium_amount'])},{num(r['previous_premium_amount'])},{num(r['premium_increase_pct'])},{esc(r['payment_frequency'].strip())},{integer(r['days_to_renewal'])})"
        for r in rows
    ))
    out.write("\nON CONFLICT (customer_id,policy_id) DO UPDATE SET premium_amount=EXCLUDED.premium_amount, previous_premium_amount=EXCLUDED.previous_premium_amount, premium_increase_pct=EXCLUDED.premium_increase_pct, payment_frequency=EXCLUDED.payment_frequency, days_to_renewal=EXCLUDED.days_to_renewal;\n\n")

    # staging table for payment+claim
    out.write("-- 4+5: staging -> payment_summary + claim_summary\n")
    out.write("CREATE TEMP TABLE _seed_staging (customer_id TEXT, policy_id TEXT, has_late_payments BOOLEAN, late_payment_count INT, avg_days_late NUMERIC, on_time_payment_rate NUMERIC, num_claims_last_year INT, total_claim_amount_last_year NUMERIC, rejected_claims INT, claims_approved INT) ON COMMIT DROP;\n")
    out.write("INSERT INTO _seed_staging VALUES\n")
    out.write(",\n".join(
        f"  ({esc(r['customer_id'].strip())},{esc(r['policy_id'].strip())},{boolean(r['has_late_payments'])},{integer(r['late_payment_count'],'0')},{num(r['avg_days_late'],'0')},{num(r['on_time_payment_rate'],'100')},{integer(r['num_claims_last_year'],'0')},{num(r['total_claim_amount_last_year'],'0')},{integer(r['rejected_claims'],'0')},{integer(r['claims_approved'],'0')})"
        for r in rows
    ))
    out.write(";\n\n")
    out.write("INSERT INTO payment_summary (customer_policy_id,has_late_payments,late_payment_count,avg_days_late,on_time_payment_rate) SELECT cp.customer_policy_id,s.has_late_payments,s.late_payment_count,s.avg_days_late,s.on_time_payment_rate FROM _seed_staging s JOIN customer_policies cp ON cp.customer_id=s.customer_id AND cp.policy_id=s.policy_id ON CONFLICT (customer_policy_id) DO UPDATE SET has_late_payments=EXCLUDED.has_late_payments, late_payment_count=EXCLUDED.late_payment_count, avg_days_late=EXCLUDED.avg_days_late, on_time_payment_rate=EXCLUDED.on_time_payment_rate;\n\n")
    out.write("INSERT INTO claim_summary (customer_policy_id,num_claims_last_year,total_claim_amount_last_year,rejected_claims,claims_approved) SELECT cp.customer_policy_id,s.num_claims_last_year,s.total_claim_amount_last_year,s.rejected_claims,s.claims_approved FROM _seed_staging s JOIN customer_policies cp ON cp.customer_id=s.customer_id AND cp.policy_id=s.policy_id ON CONFLICT (customer_policy_id) DO UPDATE SET num_claims_last_year=EXCLUDED.num_claims_last_year, total_claim_amount_last_year=EXCLUDED.total_claim_amount_last_year, rejected_claims=EXCLUDED.rejected_claims, claims_approved=EXCLUDED.claims_approved;\n\n")

    out.write("SET session_replication_role = DEFAULT;\n")
    out.write("COMMIT;\n\n")
    out.write("-- VERIFICATION\n")
    for tbl in ["policy_products","customers","customer_policies","payment_summary","claim_summary","risk_scores","renewal_offers"]:
        out.write(f"SELECT '{tbl}' AS tbl, COUNT(*) AS cnt FROM {tbl};\n")
    for vw in ["policy_model_features","lapse_model_training_data","lapse_model_inference_data"]:
        out.write(f"SELECT '{vw}' AS view_name, COUNT(*) AS cnt FROM {vw};\n")
    print("-- SQL generation complete.", file=sys.stderr)

if __name__ == "__main__":
    main()
