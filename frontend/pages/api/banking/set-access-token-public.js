// Mock API endpoint for exchanging public token
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { public_token } = req.body;

  if (!public_token) {
    return res.status(400).json({ message: "Public token is required" });
  }

  // Return mock success response
  res.status(200).json({
    access_token: "mock_access_token_" + Date.now(),
    item_id: "mock_item_id_" + Date.now(),
    accounts: [
      {
        account_id: "mock_account_1",
        name: "Checking Account",
        type: "depository",
        subtype: "checking",
        balance: {
          available: 5000,
          current: 5000,
        },
      },
      {
        account_id: "mock_account_2",
        name: "Savings Account",
        type: "depository",
        subtype: "savings",
        balance: {
          available: 10000,
          current: 10000,
        },
      },
    ],
    success: true,
    message: "Bank account connected successfully!",
  });
}
