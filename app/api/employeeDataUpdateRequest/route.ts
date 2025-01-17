import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId, values } = await req.json();

    const user = await db.userProfile.findUnique({
      where: { userId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const adminExceptThisUser = await db.userProfile.findMany({
      where: {
        role: {
          name: "Admin",
        },
      },
    });

    const ceo = await db.userProfile.findMany({
      where: {
        role: {
          name: "CEO",
        },
      },
    });

    const notifications = [
      {
        userId: userId,
        title: "Profile Update Request",
        message: `Your profile update request has been submitted successfully.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Profile Update Request",
        message: `Employee ${user.fullName} has requested a profile update.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/requests/profileUpdateRequests`,
        type: NotificationType.General,
      })),
      ...adminExceptThisUser.map((admin) => ({
        userId: admin.userId,
        title: "Profile Update Request",
        message: `Employee ${user.fullName} has requested a profile update.`,
        createdBy: NotificationCreator.Admin,
        senderImage: user.userImage,
        link: `/admin/requests/profileUpdateRequests`,
        type: NotificationType.General,
      })),
    ];

    // Create an object with only the changed fields
    const changedFields = Object.keys(values).reduce((acc, key) => {
      if (values[key] !== user[key]) {
        acc[key] = values[key];
      }
      return acc;
    }, {});

    // Create a new profile update request in the database with only the changed fields
    const updateRequest = await db.profieUpdateRequests.create({
      data: {
        userId,
        ...changedFields,
      },
    });

    // Send notifications
    const createdNotifications = await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json({ updateRequest, createdNotifications });
  } catch (error) {
    console.error(`USER_UPDATE_PATCH: ${error}`);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
