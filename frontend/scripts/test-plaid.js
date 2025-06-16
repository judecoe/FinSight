// Test Plaid configuration
// Run this with: node scripts/test-plaid.js

const https = require("https");

function testPlaidCredentials() {
  // Load environment variables
  require("dotenv").config({ path: ".env.local" });

  const clientId = process.env.PLAID_CLIENT_ID;
  const secret = process.env.PLAID_SECRET;
  const environment = process.env.PLAID_ENV || "sandbox";

  console.log("🔍 Testing Plaid Configuration...\n");

  // Check if all required variables are set
  const checks = [
    { name: "PLAID_CLIENT_ID", value: clientId, required: true },
    { name: "PLAID_SECRET", value: secret, required: true },
    { name: "PLAID_ENV", value: environment, required: true },
  ];

  let allGood = true;

  checks.forEach((check) => {
    if (check.required && !check.value) {
      console.log(`❌ ${check.name}: Missing`);
      allGood = false;
    } else if (check.value) {
      const displayValue =
        check.value.length > 20
          ? check.value.substring(0, 20) + "..."
          : check.value;
      console.log(`✅ ${check.name}: ${displayValue}`);
    }
  });

  if (!allGood) {
    console.log(
      "\n❌ Configuration incomplete. Please set all required environment variables."
    );
    console.log("\n📋 To get Plaid credentials:");
    console.log("1. Sign up at https://dashboard.plaid.com/");
    console.log("2. Create a new app");
    console.log("3. Go to Team Settings > Keys");
    console.log("4. Copy Client ID and Secret (sandbox)");
    return;
  }

  console.log("\n✅ All Plaid environment variables are set!");

  // Test Plaid API connection
  console.log("\n🔌 Testing Plaid API connection...");

  const postData = JSON.stringify({
    client_id: clientId,
    secret: secret,
    user: {
      client_user_id: "test_user_" + Date.now(),
    },
    client_name: "Finance Dashboard Test",
    products: ["transactions"],
    country_codes: ["US"],
    language: "en",
  });

  const options = {
    hostname:
      environment === "sandbox" ? "sandbox-api.plaid.com" : "api.plaid.com",
    port: 443,
    path: "/link/token/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = https.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const response = JSON.parse(data);

        if (response.link_token) {
          console.log("✅ Plaid API connection successful!");
          console.log("✅ Link token created successfully");
          console.log("\n🎉 Plaid is configured correctly!");
          console.log(
            "📍 You can now test bank linking at: http://localhost:3000/link-bank"
          );
        } else if (response.error_code) {
          console.log("❌ Plaid API Error:", response.error_code);
          console.log("📝 Message:", response.error_message);

          if (response.error_code === "INVALID_CLIENT") {
            console.log(
              "\n🔧 Fix: Check your PLAID_CLIENT_ID and PLAID_SECRET"
            );
          }
        } else {
          console.log("❌ Unexpected response:", response);
        }
      } catch (error) {
        console.log("❌ Failed to parse response:", error.message);
        console.log("Raw response:", data);
      }
    });
  });

  req.on("error", (error) => {
    console.log("❌ Connection error:", error.message);
  });

  req.write(postData);
  req.end();
}

testPlaidCredentials();
