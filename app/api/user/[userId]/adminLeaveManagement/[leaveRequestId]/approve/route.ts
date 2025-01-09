import { db } from "@/lib/db";
import { NotificationCreator, NotificationType } from "@prisma/client";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { userId: string; leaveRequestId: string } }
) => {
  try {
    const { userId, leaveRequestId } = params;

    const leaveRequest = await db.leaveRequest.findFirst({
      where: {
        id: leaveRequestId,
      },
      include: {
        user: true,
        leaveType: true,
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

    if (!leaveRequest) {
      return new NextResponse("Leave Request not found", { status: 400 });
    }

    const admins = await db.userProfile.findMany({
      where: { role: { name: "Admin" } },
    });

    const ceo = await db.userProfile.findMany({
      where: { role: { name: "CEO" } },
    });

    const notifications = [
      {
        userId,
        title: "Leave Request Approved",
        message: `Your leave request for ${leaveRequest.leaveType.name} from ${leaveRequest.startDate} to ${leaveRequest.endDate} has been approved.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
        link: "/employee/leave-management",
      },
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "Leave Request Approved",
        message: `${user?.fullName} has approved a leave request for ${leaveRequest.leaveType.name} from ${leaveRequest.startDate} to ${leaveRequest.endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user?.userImage,
        link: `/admin/leave-management/manage-requests`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Leave Request Approved",
        message: `${user?.fullName} has approved a leave request for ${leaveRequest.leaveType.name} from ${leaveRequest.startDate} to ${leaveRequest.endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user?.userImage,
        link: `/ceo/leave-management/manage-requests`,
        type: NotificationType.General,
      })),
    ];

    const updateLeaveRequest = await db.leaveRequest.update({
      where: {
        id: leaveRequestId,
      },
      data: {
        status: "Approved",
        // approvedBy: `${user?.role?.name === }${user?.fullName} - ${user?.department?.name} Manager`,
        approvedBy:
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
      message: `Leave Request for ${updateLeaveRequest.user.fullName} Approved`,
      updateLeaveRequest,
    });
  } catch (error) {
    console.error(`MANAGE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
