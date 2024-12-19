import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { notificationId } = await req.json();

    if (!notificationId) {
      return new NextResponse("Notification ID is required", { status: 400 });
    }

    const notification = await db.notifications.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return NextResponse.json({
      message: "Notification marked as read successfully.",
      notification,
    });
  } catch (error) {
    console.error(`MARK_NOTIFICATION_AS_READ_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
