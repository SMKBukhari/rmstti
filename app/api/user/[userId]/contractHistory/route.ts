import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Get contract history for the user
    const contractHistory = await db.contractRenewal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      contractHistory,
    });
  } catch (error) {
    console.error("Error fetching contract history:", error);
    return NextResponse.json(
      { error: "Failed to fetch contract history" },
      { status: 500 }
    );
  }
}
