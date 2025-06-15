from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict
from app.api.banking.service import create_link_token, exchange_public_token
from app.core.security import get_current_user

router = APIRouter()

class PublicTokenRequest(BaseModel):
    public_token: str

@router.get("/link-token", response_model=Dict)
async def get_link_token(current_user=Depends(get_current_user)):
    """Generate a link token for Plaid Link."""
    return create_link_token(str(current_user.id))

@router.post("/set-access-token", response_model=Dict)
async def set_access_token(request: PublicTokenRequest, current_user=Depends(get_current_user)):
    """Exchange public token for access token and store account data."""
    return exchange_public_token(request.public_token, str(current_user.id))

# Add these new endpoints that don't require authentication for testing
@router.get("/link-token-public", response_model=Dict)
async def get_link_token_public():
    """Generate a link token for Plaid Link (public testing endpoint)."""
    return create_link_token("test-user-id")

@router.post("/set-access-token-public", response_model=Dict)
async def set_access_token_public(request: PublicTokenRequest):
    """Exchange public token for access token (public testing endpoint)."""
    return exchange_public_token(request.public_token, "test-user-id")
