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
      throw new Error("Invalid Category name");
    }

    // Fetch existing Education for the user at once
    const existingCategory = await db.requestCategory.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }

    const newCategory = await db.requestCategory.create({
      data: { name },
    });

    const sendNotification = await db.notifications.create({
      data: {
        userId,
        title: "Category Created",
        message: `Category(${name}) has been created successfully.`,
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json({ newCategory, sendNotification });
  } catch (error) {
    console.error("Error creating User Skills:", error);
    return NextResponse.error();
  }
};
