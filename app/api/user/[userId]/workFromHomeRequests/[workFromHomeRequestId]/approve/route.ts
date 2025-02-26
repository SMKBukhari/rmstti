import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string; workFromHomeRequestId: string } }
) => {
  try {
    const { userId, workFromHomeRequestId } = params;

    const workFromHomeRequest = await db.workFromHome.findFirst({
      where: {
        id: workFromHomeRequestId,
      },
      include: {
        user: true,
      },
    });

    if (!workFromHomeRequest) {
      return new NextResponse("Work From Home Request not found", {
        status: 400,
      });
    }

    const user = await db.userProfile.findFirst({
      where: {
        userId,
      },
      include: {
        department: true,
        role: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 400 });
    }

    const admins = await db.userProfile.findMany({
      where: { role: { name: "Admin" } },
    });

    const ceo = await db.userProfile.findMany({
      where: { role: { name: "CEO" } },
    });

    const notifications = [
      {
        userId: workFromHomeRequest.userId,
        title: "Work From Home Request Approved",
        message: `Your Work From Home request from ${workFromHomeRequest.startDate} to ${workFromHomeRequest.endDate} has been approved.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
        link: "/employee/workFromHome",
      },
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "Work From Home Request Approved",
        message: `${user.fullName} has approved a Work From Home request for ${workFromHomeRequest.startDate} to ${workFromHomeRequest.endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/admin/workFromHome`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Work From Home Request Approved",
        message: `${user.fullName} has approved a Work From Home request for ${workFromHomeRequest.startDate} to ${workFromHomeRequest.endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/workFromHome`,
        type: NotificationType.General,
      })),
    ];

    const updateWorkFromRequest = await db.workFromHome.update({
      where: {
        id: workFromHomeRequestId,
      },
      data: {
        status: "Approved",
        aprrovedBy:
          user?.role?.name === "CEO"
            ? "CEO"
            : user?.role?.name === "Manager"
            ? `${user?.fullName} - ${user?.department?.name} Manager`
            : `${user?.fullName} - ${user?.role?.name}`,
      },
      include: {
        user: true,
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json({
      message: `Work From Home Request for ${updateWorkFromRequest.user.fullName} Approved`,
      updateWorkFromRequest,
    });
  } catch (error) {
    console.error(`MANAGE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
