import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const values = await req.json();

    const { userId } = await params;

    const updateUser = await db.userProfile.update({
      where: { userId },
      data: { ...values },
    });

    const sendNotification = await db.notifications.create({
      data: {
        userId,
        title: "Profile Updated",
        message: "Your profile has been updated successfully",
        createdBy: "Account",
        isRead: false,
        type: "General",
      },
    });

    return NextResponse.json({updateUser, sendNotification});
  } catch (error) {
    console.error(`USER_UPDATE_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
