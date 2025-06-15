import os
from fastapi import APIRouter, Depends, HTTPException
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
from plaid.configuration import Configuration
from plaid.api_client import ApiClient
import plaid
import uuid
from typing import List

router = APIRouter(prefix="/api/banking", tags=["banking"])

# Configure Plaid client
def get_plaid_client():
    plaid_env = os.getenv("PLAID_ENV", "sandbox").lower()
    host = plaid.Environment.Sandbox if plaid_env == "sandbox" else plaid.Environment.Development
    
    configuration = Configuration(
        host=host,
        api_key={
            'clientId': os.getenv('PLAID_CLIENT_ID'),
            'secret': os.getenv('PLAID_SECRET'),
        }
    )
    api_client = ApiClient(configuration)
    return plaid_api.PlaidApi(api_client)

@router.get("/link-token-public")
async def create_link_token():
    try:
        client = get_plaid_client()
        
        # Parse products from env
        products_list = os.getenv("PLAID_PRODUCTS", "transactions").split(",")
        products = []
        for product in products_list:
            if product.strip():
                if hasattr(Products, product.strip()):
                    products.append(getattr(Products, product.strip()))
        
        # Parse country codes from env
        country_codes_list = os.getenv("PLAID_COUNTRY_CODES", "US").split(",")
        country_codes = []
        for code in country_codes_list:
            if code.strip():
                if hasattr(CountryCode, code.strip()):
                    country_codes.append(getattr(CountryCode, code.strip()))
        
        # Create a unique user id
        user_id = str(uuid.uuid4())
        
        # Request body for link token creation
        request = LinkTokenCreateRequest(
            user=LinkTokenCreateRequestUser(
                client_user_id=user_id
            ),
            client_name="Finance Dashboard",
            products=products,
            country_codes=country_codes,
            language="en",
            redirect_uri=os.getenv("PLAID_REDIRECT_URI")
        )
        
        response = client.link_token_create(request)
        return response.to_dict()
        
    except Exception as e:
        print(f"Error creating link token: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
