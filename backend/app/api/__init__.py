from fastapi import APIRouter
from app.api.auth.router import router as auth_router
from app.api.banking.router import router as banking_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(banking_router, prefix="/banking", tags=["banking"])
