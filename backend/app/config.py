import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current dir and parent dirs
root_env = Path(__file__).resolve().parent.parent.parent / ".env"
if root_env.exists():
    load_dotenv(root_env)
else:
    load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_7RaJT2uXvzmp@ep-morning-bird-aoghnh15-pooler.c-2.ap-southeast-1.aws.neon.tech/insurance_retention?sslmode=require"
)

# Convert postgres:// to postgresql:// if needed for SQLAlchemy
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

API_V1_STR = "/api"
PROJECT_NAME = "InsureRenew Retention Engine API"

# AI Inference Keys & Settings
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AQ.Ab8RN6LBNQSHqf8VTTZIOxPSmsub5uyRoxAYoi1ZJPBuOLfCsA")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "nvidia/nemotron-3.5-lightning")
