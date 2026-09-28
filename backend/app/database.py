from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=300
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def fetch_all(query: str, params: dict = None):
    """Executes a SQL query and returns a list of dictionaries."""
    with engine.connect() as conn:
        result = conn.execute(text(query), params or {})
        return [dict(row._mapping) for row in result]

def fetch_one(query: str, params: dict = None):
    """Executes a SQL query and returns a single dictionary or None."""
    with engine.connect() as conn:
        result = conn.execute(text(query), params or {})
        row = result.first()
        return dict(row._mapping) if row else None

def execute_query(query: str, params: dict = None):
    """Executes an INSERT/UPDATE/DELETE query with autocommit."""
    with engine.begin() as conn:
        return conn.execute(text(query), params or {})
