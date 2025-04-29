import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { date, entitledLeaves, employeeIds, reason } = await req.json();

    // Validate the entitledLeaves input
    const leavesValue = parseFloat(entitledLeaves);
    if (isNaN(leavesValue)) {
      return NextResponse.json(
        { error: "Invalid leave value provided" },
        { status: 400 }
      );
    }

    const requestingUser = await db.userProfile.findUnique({
      where: { userId },
      include: { role: true },
    });

    if (
      !requestingUser ||
      !["Admin", "CEO"].includes(requestingUser.role?.name || "")
    ) {
      return NextResponse.json(
        { error: "You don't have permission to adjust leave balances" },
        { status: 403 }
      );
    }

    // Process each selected employee
    for (const employeeId of employeeIds) {
      const employee = await db.userProfile.findUnique({
        where: { userId: employeeId },
      });

      if (!employee) continue;

      // Create leave balance adjustment record
      await db.leaveBalanceAdjustment.create({
        data: {
          userId: employeeId,
          date: new Date(date),
          entitledLeaves: entitledLeaves,
          reason: reason,
        },
      });

      // Calculate new balance (convert current balance to number safely)
      const currentBalance =
        parseFloat(employee.totalLeavesBalance || "0") || 0;
      const newBalance = currentBalance + leavesValue;

      // Update user's leave balance
      await db.userProfile.update({
        where: { userId: employeeId },
        data: {
          totalLeavesBalance: newBalance.toString(),
        },
      });
    }

    return NextResponse.json({  
      success: true,
      message: "Leave balances adjusted successfully",
    });
  } catch (error) {
    console.error("Error in Leave Balance Management:", error);
    return NextResponse.json(
      {
        error: "Failed to process leave balance adjustment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
