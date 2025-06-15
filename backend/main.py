from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from app.routers import banking  # Import the banking router

# Load environment variables from .env file
load_dotenv()

# Create FastAPI app instance
app = FastAPI(
    title="Finance Dashboard API",
    description="Backend API for Finance Dashboard application",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routers
app.include_router(banking.router, prefix="/api/banking")

# Root endpoint for testing
@app.get("/")
def read_root():
    return {"status": "API is running"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Example of using environment variables
@app.get("/config")
def get_config():
    return {
        "plaid_environment": os.getenv("PLAID_ENV"),
        "plaid_country_codes": os.getenv("PLAID_COUNTRY_CODES").split(","),
        "plaid_products": os.getenv("PLAID_PRODUCTS").split(",")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
