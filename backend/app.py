from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import banking router - adjust path as needed
from routers.banking import router as banking_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router with the /api/banking prefix
app.include_router(banking_router, prefix="/api/banking")

# ... existing code ...
