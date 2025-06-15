import jwt
import requests
import time
from typing import Dict, Any
from fastapi import HTTPException
from app.core.config import settings
from app.db.models.users import User

async def verify_apple_token(identity_token: str) -> Dict[str, Any]:
    """Verify Apple ID token and extract user information."""
    try:
        # Get Apple's public key for verification
        response = requests.get('https://appleid.apple.com/auth/keys')
        keys = response.json()['keys']
        
        # Decode token header to find the key id
        header = jwt.get_unverified_header(identity_token)
        key_id = header.get('kid')
        
        if not key_id:
            raise HTTPException(status_code=400, detail="Invalid Apple ID token")
        
        # Find the matching public key
        public_key = None
        for key in keys:
            if key['kid'] == key_id:
                # Convert JWK to PEM format
                import json
                from cryptography.hazmat.primitives.asymmetric.rsa import RSAPublicNumbers
                from cryptography.hazmat.backends import default_backend
                from cryptography.hazmat.primitives import serialization
                import base64
                
                # More processing here to convert the JWK to PEM format
                # (simplified for brevity)
                
                public_key = "...PEM KEY..."  # Generated from the JWK
                break
        
        if not public_key:
            raise HTTPException(status_code=400, detail="Public key not found")
        
        # Verify the token
        payload = jwt.decode(
            identity_token,
            public_key,
            audience=settings.APPLE_CLIENT_ID,
            algorithms=['RS256']
        )
        
        # Extract user information
        user_id = payload.get('sub')
        email = payload.get('email')
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found in token")
        
        return {
            "user_id": user_id,
            "email": email
        }
        
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

async def login_or_create_user(apple_user_info: Dict[str, Any]) -> Dict[str, Any]:
    """Login user with Apple ID or create a new account if it doesn't exist."""
    # Check if user exists in database
    # If yes, generate a JWT and return
    # If no, create a new user account, then generate JWT and return
    
    # Example code (implement database operations based on your ORM)
    user_id = apple_user_info["user_id"]
    email = apple_user_info.get("email")
    
    # Generate JWT token for authentication
    from app.core.security import create_access_token
    
    # Dummy user object (replace with actual database logic)
    user = {"id": user_id, "email": email}
    
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
