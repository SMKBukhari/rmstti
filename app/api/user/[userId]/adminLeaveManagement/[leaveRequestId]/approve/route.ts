// import { db } from "@/lib/db"
// import { NotificationCreator, NotificationType } from "@prisma/client"
// import { NextResponse } from "next/server"

// export const PATCH = async (req: Request, { params }: { params: { userId: string; leaveRequestId: string } }) => {
//   try {
//     const { userId, leaveRequestId } = params

//     const leaveRequest = await db.leaveRequest.findFirst({
//       where: {
//         id: leaveRequestId,
//       },
//       include: {
//         user: true,
//         leaveType: true,
//       },
//     })

//     if (!leaveRequest) {
//       return new NextResponse("Leave Request not found", { status: 400 })
//     }

//     const user = await db.userProfile.findFirst({
//       where: {
//         userId,
//       },
//       include: {
//         department: true,
//         role: true,
//       },
//     })

//     if (!user) {
//       return new NextResponse("User not found", { status: 400 })
//     }

//     // Calculate the number of days requested
//     let daysRequested
//     if (leaveRequest.leaveType.name.toLowerCase().includes("half leave")) {
//       // If it's a half-day leave
//       daysRequested = 0.5
//     } else {
//       const startDate = new Date(leaveRequest.startDate)
//       const endDate = new Date(leaveRequest.endDate)

//       // Calculate the difference in days
//       const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
//       daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // Add 1 to include both start and end dates
//     }

//     // Calculate new total leaves taken
//     const currentLeavesTaken = Number.parseFloat(user.totalLeavesTaken)
//     const newTotalLeavesTaken = currentLeavesTaken + daysRequested

//     const admins = await db.userProfile.findMany({
//       where: { role: { name: "Admin" } },
//     })

//     const ceo = await db.userProfile.findMany({
//       where: { role: { name: "CEO" } },
//     })

//     const notifications = [
//       {
//         userId: leaveRequest.userId,
//         title: "Leave Request Approved",
//         message: `Your leave request for ${leaveRequest.leaveType.name} from ${leaveRequest.startDate} to ${leaveRequest.endDate} has been approved.`,
//         createdBy: NotificationCreator.Account,
//         type: NotificationType.General,
//         link: "/employee/leave-management",
//       },
//       ...admins.map((admin) => ({
//         userId: admin.userId,
//         title: "Leave Request Approved",
//         message: `${user.fullName} has approved a leave request for ${leaveRequest.leaveType.name} from ${leaveRequest.startDate} to ${leaveRequest.endDate}.`,
//         createdBy: NotificationCreator.Employee,
//         senderImage: user.userImage,
//         link: `/admin/leave-management/manage-requests`,
//         type: NotificationType.General,
//       })),
//       ...ceo.map((ceo) => ({
//         userId: ceo.userId,
//         title: "Leave Request Approved",
//         message: `${user.fullName} has approved a leave request for ${leaveRequest.leaveType.name} from ${leaveRequest.startDate} to ${leaveRequest.endDate}.`,
//         createdBy: NotificationCreator.Employee,
//         senderImage: user.userImage,
//         link: `/ceo/leave-management/manage-requests`,
//         type: NotificationType.General,
//       })),
//     ]

//     const updateLeaveRequest = await db.leaveRequest.update({
//       where: {
//         id: leaveRequestId,
//       },
//       data: {
//         status: "Approved",
//         approvedBy:
//           user?.role?.name === "CEO"
//             ? "CEO"
//             : user?.role?.name === "Manager"
//               ? `${user?.fullName} - ${user?.department?.name} Manager`
//               : `${user?.fullName} - ${user?.role?.name}`,
//       },
//       include: {
//         user: true,
//       },
//     })

//     // Update user's total leaves taken
//     await db.userProfile.update({
//       where: {
//         userId: leaveRequest.userId,
//       },
//       data: {
//         totalLeavesTaken: newTotalLeavesTaken.toString(),
//       },
//     })

//     await db.notifications.createMany({
//       data: notifications,
//     })

//     return NextResponse.json({
//       message: `Leave Request for ${updateLeaveRequest.user.fullName} Approved`,
//       updateLeaveRequest,
//       daysDeducted: daysRequested,
//     })
//   } catch (error) {
//     console.error(`MANAGE_LEAVE_REQUEST_ERROR: ${error}`)
//     return new NextResponse("Internal Server Error", { status: 500 })
//   }
// }

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

    if (!leaveRequest) {
      return new NextResponse("Leave Request not found", { status: 400 });
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

    // Calculate the number of days requested
    let daysRequested;
    if (leaveRequest.leaveType.name.toLowerCase().includes("half leave")) {
      // If it's a half-day leave
      daysRequested = 0.5;
    } else {
      const startDate = new Date(leaveRequest.startDate);
      const endDate = new Date(leaveRequest.endDate);

      // Calculate the difference in days
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include both start and end dates
    }

    // Calculate new total leaves taken
    const currentLeavesTaken = Number.parseFloat(user.totalLeavesTaken);
    const newTotalLeavesTaken = currentLeavesTaken + daysRequested;

    // Calculate new total leaves balance
    const currentLeavesBalance = Number(leaveRequest.user.totalLeavesBalance);
    const newTotalLeavesBalance = currentLeavesBalance - daysRequested;

    const admins = await db.userProfile.findMany({
      where: { role: { name: "Admin" } },
    });

    const ceo = await db.userProfile.findMany({
      where: { role: { name: "CEO" } },
    });

    const notifications = [
      {
        userId: leaveRequest.userId,
        title: "Leave Request Approved",
        message: `Your leave request for ${leaveRequest.leaveType.name} from ${leaveRequest.startDate} to ${leaveRequest.endDate} has been approved.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
        link: "/employee/leave-management",
      },
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "Leave Request Approved",
        message: `${user.fullName} has approved a leave request for ${leaveRequest.leaveType.name} from ${leaveRequest.startDate} to ${leaveRequest.endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/admin/leave-management/manage-requests`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "Leave Request Approved",
        message: `${user.fullName} has approved a leave request for ${leaveRequest.leaveType.name} from ${leaveRequest.startDate} to ${leaveRequest.endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
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

    // Update user's total leaves taken
    await db.userProfile.update({
      where: {
        userId: leaveRequest.userId,
      },
      data: {
        // totalLeavesTaken: newTotalLeavesTaken.toString(),
        totalLeavesBalance: newTotalLeavesBalance.toString(),
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    return NextResponse.json({
      message: `Leave Request for ${updateLeaveRequest.user.fullName} Approved`,
      updateLeaveRequest,
      daysDeducted: daysRequested,
    });
  } catch (error) {
    console.error(`MANAGE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
