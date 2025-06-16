import {
  plaidClient,
  PLAID_PRODUCTS,
  PLAID_COUNTRY_CODES,
} from "../../../lib/plaid";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Check if Plaid credentials are properly configured
  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;

  if (
    !clientId ||
    !secret ||
    clientId === "your_plaid_client_id_here" ||
    secret === "your_plaid_secret_here"
  ) {
    return res.status(500).json({
      error: "Plaid credentials not configured",
      message: "Please set up your Plaid credentials in .env.local file",
      setup_url: "https://dashboard.plaid.com/team/keys",
      current_config: {
        client_id_set: !!clientId && clientId !== "your_plaid_client_id_here",
        secret_set: !!secret && secret !== "your_plaid_secret_here",
        environment: process.env.PLAID_ENV || "sandbox",
      },
    });
  }

  try {
    // Create a safe, non-sensitive user identifier
    const rawUserId = req.headers["user-id"] || "demo_user_" + Date.now();

    // Ensure the user ID doesn't contain sensitive information
    const sanitizeUserId = (userId) => {
      // Remove email-like patterns, special characters, etc.
      const sanitized = userId
        .replace(/@.*$/, "") // Remove email domain
        .replace(/[^a-zA-Z0-9_-]/g, "_") // Replace special chars with underscore
        .substring(0, 128); // Limit length as per Plaid requirements

      // Ensure it starts with a letter or number
      return sanitized.match(/^[a-zA-Z0-9]/) ? sanitized : `user_${sanitized}`;
    };

    const safeUserId = sanitizeUserId(rawUserId);

    // Create link token with Plaid
    const linkTokenRequest = {
      user: {
        client_user_id: safeUserId,
      },
      client_name: "FinSight Dashboard",
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: "en",
    };

    console.log(
      "Creating link token with request:",
      JSON.stringify(linkTokenRequest, null, 2)
    );
    const linkTokenResponse = await plaidClient.linkTokenCreate(
      linkTokenRequest
    );

    res.status(200).json({
      link_token: linkTokenResponse.data.link_token,
      expiration: linkTokenResponse.data.expiration,
    });
  } catch (error) {
    console.error("Error creating link token:", error);
    console.error("Error response data:", error.response?.data);

    // More specific error handling
    if (error.response?.status === 400) {
      const errorData = error.response.data;
      return res.status(500).json({
        error: "Plaid API error",
        message: errorData?.error_message || "Bad request to Plaid API",
        error_code: errorData?.error_code,
        error_type: errorData?.error_type,
        details: errorData,
        suggestion: "Check your Plaid credentials and configuration",
      });
    }

    res.status(500).json({
      error: "Failed to create link token",
      message: error.message,
      status: error.response?.status,
    });
  }
}
