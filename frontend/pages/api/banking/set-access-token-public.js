import { plaidClient } from "../../../lib/plaid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { public_token } = req.body;

  if (!public_token) {
    return res.status(400).json({ message: "Public token is required" });
  }

  try {
    // Exchange public token for access token
    const exchangeRequest = {
      public_token: public_token,
    };

    const exchangeResponse = await plaidClient.itemPublicTokenExchange(
      exchangeRequest
    );
    const { access_token, item_id } = exchangeResponse.data;

    // Get account information
    const accountsRequest = {
      access_token: access_token,
    };

    const accountsResponse = await plaidClient.accountsGet(accountsRequest);
    const accounts = accountsResponse.data.accounts;

    // In a real app, you would save the access_token securely in your database
    // associated with the user's account. For demo purposes, we'll just return the data.

    res.status(200).json({
      access_token: access_token, // Don't return this in production!
      item_id: item_id,
      accounts: accounts.map((account) => ({
        account_id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: account.balances,
      })),
      success: true,
      message: "Bank account connected successfully!",
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);

    res.status(500).json({
      error: "Failed to exchange public token",
      message: error.message,
    });
  }
}
