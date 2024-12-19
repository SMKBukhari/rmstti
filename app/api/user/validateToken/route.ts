import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Check token in the database
    const user = await db.userProfile.findFirst({
      where: {
        loginSessionToken: token,
        loginSessionExpiry: {
          gte: new Date(), // Ensure token is not expired
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    return res.status(200).json({ message: "Valid token" });
  } catch (error) {
    console.error(`API_VALIDATION_ERROR: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
