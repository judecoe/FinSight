// Test Google OAuth setup
// Run this with: node scripts/test-google-auth.js

const https = require("https");

function testGoogleCredentials() {
  // Load environment variables
  require("dotenv").config({ path: ".env.local" });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;

  console.log("🔍 Testing Google OAuth Configuration...\n");

  // Check if all required variables are set
  const checks = [
    { name: "GOOGLE_CLIENT_ID", value: clientId, required: true },
    { name: "GOOGLE_CLIENT_SECRET", value: clientSecret, required: true },
    { name: "NEXTAUTH_SECRET", value: nextAuthSecret, required: true },
    { name: "NEXTAUTH_URL", value: nextAuthUrl, required: true },
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
    return;
  }

  console.log("\n✅ All environment variables are set!");

  // Test if Google Client ID format is valid
  if (clientId && clientId.includes(".apps.googleusercontent.com")) {
    console.log("✅ Google Client ID format looks correct");
  } else {
    console.log("⚠️  Google Client ID format may be incorrect");
  }

  console.log("\n🎉 Configuration looks good! Try signing in with Google.");
  console.log("📍 Visit: http://localhost:3000/login");
}

testGoogleCredentials();
