import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.status(200).json({
      message: "Authentication working!",
      user: session.user,
      session: {
        expires: session.expires,
      },
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
