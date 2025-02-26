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

    const user = await db.userProfile.findFirst({
      where: {
        userId,
      },
      include: {
        department: true,
        role: true,
      },
    });

    if (!workFromHomeRequest) {
      return new NextResponse("Work From Home Request not found", {
        status: 400,
      });
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
        title: "Work From Home Request Rejected",
        message: `Your Work From Home request from ${workFromHomeRequest.startDate} to ${workFromHomeRequest.endDate} has been rejected.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
        link: "/employee/workFromHome",
      },
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "Work From Home Request Rejected",
        message: `${user?.fullName} has rejected a Work From Home request from ${workFromHomeRequest.startDate} to ${workFromHomeRequest.endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user?.userImage,
        link: `/admin/workFromHome`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Work From Home Request Rejected",
        message: `${user?.fullName} has rejected a Work From Home request from ${workFromHomeRequest.startDate} to ${workFromHomeRequest.endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user?.userImage,
        link: `/ceo/workFromHome`,
        type: NotificationType.General,
      })),
    ];

    const updateWorkFromHomeRequest = await db.workFromHome.update({
      where: {
        id: workFromHomeRequestId,
      },
      data: {
        status: "Rejected",
        rejectedBy: user?.role?.name === "CEO"
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
      message: `Work From Home Request for ${updateWorkFromHomeRequest.user.fullName} Rejected`,
      updateWorkFromHomeRequest,
    });
  } catch (error) {
    console.error(`MANAGE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
