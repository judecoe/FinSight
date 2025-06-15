const express = require("express");
const router = express.Router();
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

// Configure Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// Create a link token for the frontend to initialize Plaid Link
router.get("/link-token-public", async (req, res) => {
  try {
    const configs = {
      user: {
        // This should be the user's ID in your application
        client_user_id: req.user
          ? req.user.id.toString()
          : "user-" + Date.now(),
      },
      client_name: "Finance Dashboard",
      products: process.env.PLAID_PRODUCTS.split(","),
      country_codes: process.env.PLAID_COUNTRY_CODES.split(","),
      language: "en",
    };

    if (process.env.PLAID_REDIRECT_URI) {
      configs.redirect_uri = process.env.PLAID_REDIRECT_URI;
    }

    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    return res.json(createTokenResponse.data);
  } catch (error) {
    console.error("Error creating link token:", error);
    return res.status(500).json({
      error: error.message || "Failed to create link token",
    });
  }
});

// Add more banking routes here as needed

module.exports = router;
