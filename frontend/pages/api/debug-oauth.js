// Debug endpoint to check NextAuth URLs
export default function handler(req, res) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const callbackUrl = `${baseUrl}/api/auth/callback/google`;

  res.status(200).json({
    nextAuthUrl: process.env.NEXTAUTH_URL,
    expectedCallbackUrl: callbackUrl,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? "Set ✅" : "Missing ❌",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET
      ? "Set ✅"
      : "Missing ❌",
    instructions: {
      step1: "Go to https://console.cloud.google.com/apis/credentials",
      step2: "Edit your OAuth 2.0 Client ID",
      step3: `Add this EXACT URI to "Authorized redirect URIs": ${callbackUrl}`,
      step4: "Save and wait a few minutes for changes to propagate",
    },
  });
}
