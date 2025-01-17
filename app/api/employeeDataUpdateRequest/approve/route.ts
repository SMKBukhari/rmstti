import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { requestId, userId } = await req.json();

    const updateRequest = await db.profieUpdateRequests.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!updateRequest) {
      return new NextResponse("Profile update request not found", {
        status: 404,
      });
    }

    const user = await db.userProfile.findUnique({
      where: { userId: userId },
      include: { role: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const fieldsToUpdate = Object.keys(updateRequest).reduce((acc, key) => {
      if (
        key !== "id" &&
        key !== "userId" &&
        key !== "aprroved" &&
        key !== "rejected" &&
        key !== "createdAt" &&
        key !== "updatedAt" &&
        key !== "user" &&
        updateRequest[key] !== null &&
        updateRequest[key] !== undefined &&
        updateRequest[key] !== updateRequest.user[key]
      ) {
        acc[key] = updateRequest[key];
      }
      return acc;
    }, {});

    const admins = await db.userProfile.findMany({
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
        userId: updateRequest.userId,
        title: "Profile Update Approved",
        message: "Your profile update request has been approved.",
        createdBy: NotificationCreator.Admin,
        type: NotificationType.ProfileUpdate,
        link: "employee/requests",
      },
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Profile Update Approved",
        message: `${updateRequest.user.fullName}'s profile update request has been approved by ${user?.fullName}.`,
        createdBy:
          user.role?.name === "CEO"
            ? NotificationCreator.CEO
            : NotificationCreator.Admin,
        senderImage: user?.userImage,
        link: `/ceo/requests`,
        type: NotificationType.General,
      })),
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "Profile Update Approved",
        message: `${updateRequest.user.fullName}'s profile update request has been approved by ${user.fullName}.`,
        createdBy:
          user.role?.name === "CEO"
            ? NotificationCreator.CEO
            : NotificationCreator.Admin,
        senderImage: user.userImage,
        link: `/admin/requests`,
        type: NotificationType.General,
      })),
    ];

    await db.userProfile.update({
      where: { userId: updateRequest.userId },
      data: fieldsToUpdate,
    });

    await db.profieUpdateRequests.update({
      where: { id: requestId },
      data: { aprroved: true, rejected: false },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json({
      message: "Profile update request approved successfully",
    });
  } catch (error) {
    console.error("Error in approveProfileUpdate:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
