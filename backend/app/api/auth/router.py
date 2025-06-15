from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Optional
from app.core.security import create_access_token
import jwt
import requests
from datetime import timedelta
from app.core.config import settings

router = APIRouter()

class AppleAuthRequest(BaseModel):
    identity_token: str
    user: Optional[Dict] = None

@router.post("/apple", response_model=Dict)
async def apple_sign_in(request: AppleAuthRequest):
    """Authenticate with Apple ID token."""
    try:
        # For demonstration purposes - in production, validate the token with Apple
        # This is a simplified implementation
        
        # In a real app, verify the token with Apple servers
        # For now, just decode it without verification to get the payload
        payload = jwt.decode(request.identity_token, options={"verify_signature": False})
        
        user_id = payload.get("sub")
        email = payload.get("email")
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found in token")
        
        # TODO: In a real app, check if user exists, if not create a new user
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user_id},
            expires_delta=timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": email
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")
