# Setting Up Plaid Integration

This guide will help you set up Plaid integration for the FinSight Dashboard.

## Prerequisites

1. **Plaid Account**: Sign up at [https://plaid.com/](https://plaid.com/)
2. **Plaid Dashboard Access**: Get your API keys from [https://dashboard.plaid.com/team/keys](https://dashboard.plaid.com/team/keys)

## Step 1: Get Your Plaid Credentials

1. Go to [Plaid Dashboard](https://dashboard.plaid.com/team/keys)
2. Copy your **Client ID** and **Secret Key**
3. Note your environment (Sandbox for development, Production for live)

## Step 2: Configure Environment Variables

1. Open `.env.local` in the frontend directory
2. Replace the placeholder values with your actual Plaid credentials:

```env
# Plaid Configuration
PLAID_CLIENT_ID=your_actual_client_id_here
PLAID_SECRET=your_actual_secret_key_here
PLAID_ENV=sandbox

# For production, change to:
# PLAID_ENV=production
```

> **⚠️ Important**: You MUST replace `your_actual_client_id_here` and `your_actual_secret_key_here` with your real Plaid credentials. The app will automatically detect placeholder values and show helpful error messages.

## What Happens Without Credentials?

If you haven't set up Plaid credentials yet:

- The app will detect missing/placeholder credentials
- You'll see a helpful error message with setup instructions
- The app will automatically fall back to demo mode
- All functionality will work with simulated data

## Step 3: Test the Integration

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Sign in to the application
3. Click "Connect Bank Account"
4. You should see the real Plaid Link interface

## Environments

### Sandbox (Development)

- Use `PLAID_ENV=sandbox`
- Test with Plaid's test credentials
- No real bank data is accessed

### Production

- Use `PLAID_ENV=production`
- Requires Plaid approval and compliance
- Real bank data access

## Test Credentials for Sandbox

When using Plaid Link in sandbox mode, you can use these test credentials:

- **Institution**: Chase, Bank of America, Wells Fargo, etc.
- **Username**: `user_good`
- **Password**: `pass_good`

## Fallback Mode

If Plaid credentials are not configured, the app will automatically fall back to demo mode with simulated data.

## Security Notes

- Never commit your real Plaid credentials to version control
- Use environment variables for all sensitive data
- In production, implement proper user authentication and data storage
- Store access tokens securely in your database (not returned to frontend)

## Production Considerations

1. **Database Integration**: Store access tokens in your database
2. **User Authentication**: Implement proper user management
3. **Webhook Handling**: Set up Plaid webhooks for real-time updates
4. **Error Handling**: Implement comprehensive error handling
5. **Compliance**: Ensure you meet financial data regulations

## Troubleshooting

### Common Issues

1. **"Plaid credentials not configured"**

   - Check your `.env.local` file
   - Ensure variable names match exactly
   - Restart your development server

2. **"Invalid credentials"**

   - Verify your Client ID and Secret
   - Check that you're using the correct environment

3. **"Link token creation failed"**
   - Check your Plaid dashboard for API limits
   - Verify your account status

## Support

- [Plaid Documentation](https://plaid.com/docs/)
- [Plaid API Reference](https://plaid.com/docs/api/)
- [Plaid Community](https://support.plaid.com/)
