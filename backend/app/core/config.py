import os
from pydantic_settings import BaseSettings  # Changed import

class Settings(BaseSettings):
    # API configuration
    API_V1_STR: str = "/api"
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "dev_secret_key_change_in_production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRATION_MINUTES: int = int(os.getenv("JWT_EXPIRATION_MINUTES", "1440"))  # 24 hours
    
    # Plaid
    PLAID_CLIENT_ID: str = os.getenv("PLAID_CLIENT_ID", "")
    PLAID_SECRET: str = os.getenv("PLAID_SECRET", "")
    PLAID_ENV: str = os.getenv("PLAID_ENV", "sandbox")
    PLAID_COUNTRY_CODES: str = os.getenv("PLAID_COUNTRY_CODES", "US")
    PLAID_PRODUCTS: str = os.getenv("PLAID_PRODUCTS", "transactions,auth")
    
    # Apple Sign In
    APPLE_CLIENT_ID: str = os.getenv("APPLE_CLIENT_ID", "")
    APPLE_TEAM_ID: str = os.getenv("APPLE_TEAM_ID", "")
    APPLE_KEY_ID: str = os.getenv("APPLE_KEY_ID", "")
    
    class Config:
        env_file = ".env"

settings = Settings()
