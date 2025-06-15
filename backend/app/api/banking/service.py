# Implementation for Plaid API integration
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
from fastapi import HTTPException
from typing import Dict
import os
from app.core.config import settings

# Configure Plaid client
host = plaid.Environment.Sandbox if settings.PLAID_ENV == "sandbox" else plaid.Environment.Development
configuration = plaid.Configuration(
    host=host,
    api_key={
        'clientId': settings.PLAID_CLIENT_ID,
        'secret': settings.PLAID_SECRET,
    }
)
api_client = plaid.ApiClient(configuration)
plaid_client = plaid_api.PlaidApi(api_client)

def create_link_token(user_id: str) -> Dict:
    """Create a Plaid Link token for a user."""
    try:
        # Convert string products to enum list
        products_list = settings.PLAID_PRODUCTS.split(',')
        products = [Products(product) for product in products_list]
        
        # Convert string country codes to enum list
        country_codes_list = settings.PLAID_COUNTRY_CODES.split(',')
        country_codes = [CountryCode(code) for code in country_codes_list]
        
        request = LinkTokenCreateRequest(
            user=LinkTokenCreateRequestUser(client_user_id=user_id),
            client_name="FinSight",
            products=products,
            country_codes=country_codes,
            language='en'
        )
        
        response = plaid_client.link_token_create(request)
        return response.to_dict()
    except plaid.ApiException as e:
        raise HTTPException(status_code=400, detail=f"Plaid API error: {e}")

def exchange_public_token(public_token: str, user_id: str) -> Dict:
    """Exchange public token for access token and store account info."""
    try:
        from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
        
        exchange_request = ItemPublicTokenExchangeRequest(public_token=public_token)
        exchange_response = plaid_client.item_public_token_exchange(exchange_request)
        
        access_token = exchange_response.access_token
        item_id = exchange_response.item_id
        
        # TODO: In a real app, store these tokens in your database
        # For now, just return a success message
        
        return {
            "success": True,
            "item_id": item_id
        }
        
    except plaid.ApiException as e:
        raise HTTPException(status_code=400, detail=f"Plaid API error: {e}")
