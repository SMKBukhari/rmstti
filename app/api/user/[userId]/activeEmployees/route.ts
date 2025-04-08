import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    // Check if user has permission to view employees
    const requestingUser = await db.userProfile.findUnique({
      where: { userId },
      include: { role: true },
    })

    if (!requestingUser || !["Admin", "Manager", "CEO"].includes(requestingUser.role?.name || "")) {
      return NextResponse.json({ error: "You don't have permission to view employees" }, { status: 403 })
    }

    // Get all active employees
    const activeEmployees = await db.userProfile.findMany({
      where: {
        isHired: true,
        status: {
          name: "Active",
        },
      },
      select: {
        userId: true,
        fullName: true,
        email: true,
        department: {
          select: {
            name: true,
          },
        },
        designation: true,
      },
      orderBy: {
        fullName: "asc",
      },
    })

    return NextResponse.json(activeEmployees)
  } catch (error) {
    console.error("Error fetching active employees:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch active employees",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
