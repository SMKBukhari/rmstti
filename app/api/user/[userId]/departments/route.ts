import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { name } = await req.json();
    const { userId } = await params;

    if (!name || typeof name !== "string") {
      throw new Error("Invalid department name");
    }

    // Fetch existing Education for the user at once
    const existingDepartment = await db.department.findUnique({
      where: { name },
    });

    if (existingDepartment) {
      throw new Error("Department already exists");
    }

    const newDepartment = await db.department.create({
      data: { name },
    });

    const sendNotification = await db.notifications.create({
      data: {
        userId,
        title: "Department Created",
        message: `Department (${name}) has been created successfully.`,
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json({ newDepartment, sendNotification });
  } catch (error) {
    console.error("Error creating User Skills:", error);
    return NextResponse.error();
  }
};

