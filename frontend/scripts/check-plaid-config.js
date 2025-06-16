#!/usr/bin/env node

// Simple script to validate Plaid configuration
const fs = require("fs");
const path = require("path");

console.log("🔍 Checking Plaid Configuration...\n");

// Read .env.local file
const envPath = path.join(__dirname, "..", ".env.local");
let envVars = {};

try {
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split("\n");

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join("=").trim();
      }
    }
  });
} catch (error) {
  console.log("❌ Could not read .env.local file");
  console.log("📁 Make sure .env.local exists in the frontend directory");
  process.exit(1);
}

const clientId = envVars.PLAID_CLIENT_ID;
const secret = envVars.PLAID_SECRET;
const environment = envVars.PLAID_ENV || "sandbox";

console.log("📋 Configuration Status:");
console.log(
  `• Client ID: ${
    clientId
      ? clientId === "your_plaid_client_id_here"
        ? "❌ Placeholder value"
        : "✅ Set"
      : "❌ Not set"
  }`
);
console.log(
  `• Secret: ${
    secret
      ? secret === "your_plaid_secret_here"
        ? "❌ Placeholder value"
        : "✅ Set"
      : "❌ Not set"
  }`
);
console.log(`• Environment: ${environment}`);

if (
  !clientId ||
  !secret ||
  clientId === "your_plaid_client_id_here" ||
  secret === "your_plaid_secret_here"
) {
  console.log("\n❌ Plaid is not properly configured");
  console.log("\n📖 Setup Instructions:");
  console.log("1. Go to: https://dashboard.plaid.com/team/keys");
  console.log("2. Copy your Client ID and Secret");
  console.log("3. Update your .env.local file");
  console.log("4. Run this script again to verify");
  console.log("\n🔄 The app will use demo mode until configured.");
} else {
  console.log("\n✅ Plaid configuration looks good!");
  console.log("\n🚀 You can now use real Plaid integration.");
}

console.log("\n📁 Environment file: .env.local");
console.log("🔧 Restart your dev server after making changes.");
