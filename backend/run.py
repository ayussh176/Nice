import uvicorn
import os
import sys

# Ensure current directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    print(f"Starting InsureRenew FastAPI Backend on http://{host}:{port}...")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
