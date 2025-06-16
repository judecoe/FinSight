import { plaidClient } from "../../../lib/plaid";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { access_token } = req.query;

  if (!access_token) {
    return res.status(400).json({ message: "Access token is required" });
  }

  try {
    // Get account information
    const accountsRequest = {
      access_token: access_token,
    };

    const accountsResponse = await plaidClient.accountsGet(accountsRequest);
    const accounts = accountsResponse.data.accounts;

    // Process account data
    const processedData = {
      accounts: accounts.map((account) => ({
        id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: {
          current: account.balances.current,
          available: account.balances.available,
          limit: account.balances.limit,
        },
        currency: account.balances.iso_currency_code || "USD",
      })),
      summary: {
        totalBalance: accounts
          .filter((account) => account.type === "depository") // Only checking/savings
          .reduce((sum, account) => sum + (account.balances.current || 0), 0),
        totalAvailable: accounts
          .filter((account) => account.type === "depository")
          .reduce((sum, account) => sum + (account.balances.available || 0), 0),
        accountCount: accounts.length,
      },
    };

    res.status(200).json(processedData);
  } catch (error) {
    console.error("Error fetching accounts:", error);

    res.status(500).json({
      error: "Failed to fetch accounts",
      message: error.message,
    });
  }
}
