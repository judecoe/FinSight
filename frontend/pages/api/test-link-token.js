// Test link token creation directly
// Visit: http://localhost:3000/api/test-link-token

export default async function handler(req, res) {
  try {
    // Import the plaid client
    const { plaidClient, PLAID_PRODUCTS, PLAID_COUNTRY_CODES } = await import(
      "../../lib/plaid"
    );

    console.log("Testing Plaid link token creation...");
    console.log("Environment:", process.env.PLAID_ENV || "sandbox");
    console.log("Client ID set:", !!process.env.PLAID_CLIENT_ID);
    console.log("Secret set:", !!process.env.PLAID_SECRET);

    const linkTokenRequest = {
      user: {
        client_user_id: "test_user_" + Date.now(),
      },
      client_name: "Finance Dashboard Test",
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: "en",
    };

    console.log("Request:", JSON.stringify(linkTokenRequest, null, 2));

    const linkTokenResponse = await plaidClient.linkTokenCreate(
      linkTokenRequest
    );

    res.status(200).json({
      success: true,
      link_token: linkTokenResponse.data.link_token,
      expiration: linkTokenResponse.data.expiration,
      request_id: linkTokenResponse.data.request_id,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);

    res.status(500).json({
      success: false,
      error: error.message,
      plaid_error: error.response?.data,
      status: error.response?.status,
      config: {
        env: process.env.PLAID_ENV,
        client_id_set: !!process.env.PLAID_CLIENT_ID,
        secret_set: !!process.env.PLAID_SECRET,
      },
    });
  }
}
