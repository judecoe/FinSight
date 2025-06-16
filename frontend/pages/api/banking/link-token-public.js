// Mock API endpoint for banking link token
export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Return a mock link token for testing
  res.status(200).json({
    link_token: "mock_link_token_for_testing_" + Date.now(),
    expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
  });
}
