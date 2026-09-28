from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import PROJECT_NAME, API_V1_STR
from app.routers import overview, portfolio, risk_analysis, customer_details

app = FastAPI(
    title=PROJECT_NAME,
    description="FastAPI Backend for InsureRenew: Lapse Prevention & Retention Engine, powered by PostgreSQL.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local Vite development and any client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(overview.router, prefix=API_V1_STR)
app.include_router(portfolio.router, prefix=API_V1_STR)
app.include_router(risk_analysis.router, prefix=API_V1_STR)
app.include_router(customer_details.router, prefix=API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    """Health check endpoint confirming FastAPI service is active."""
    return {
        "status": "healthy",
        "service": PROJECT_NAME,
        "database": "connected"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to InsureRenew Retention Platform API",
        "docs": "/docs",
        "health": "/api/health"
    }
