from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router
from app.core.config import settings

app = FastAPI(title="FinSight API", openapi_url=f"{settings.API_V1_STR}/openapi.json")

# Set up CORS
origins = [
    "http://localhost:5173",  # React dev server
    "http://localhost:4173",  # Vite preview
    # Add additional origins for production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Import routers
from app.routers import banking

# Include routers
app.include_router(banking.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FinSight API"}
