import { db } from "@/lib/db";
import {
  LeaveStatus,
  NotificationCreator,
  NotificationType,
} from "@prisma/client";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const userId = params.userId;
    const { leaveType, startDate, endDate, reason } = await req.json();

    if (!leaveType || !startDate || !endDate || !reason) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const user = await db.userProfile.findFirst({
      where: {
        userId,
      },
      include: {
        leaveRequests: true,
        department: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const totalYearlyLeaves = Number.parseInt(user.totalYearlyLeaves);
    const totalMonthlyLeaves = Number.parseInt(user.totalMonthlyLeaves);

    const getLeaveType = await db.leaveType.findFirst({
      where: {
        name: leaveType,
      },
    });

    if (!getLeaveType) {
      return new NextResponse("Leave Type not found", { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysRequested =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const leavesTakenThisYear = user.leaveRequests.filter(
      (leaveRequest) =>
        new Date(leaveRequest.startDate).getFullYear() === currentYear
    ).length;
    const leavesTakenThisMonth = user.leaveRequests.filter(
      (leaveRequest) =>
        new Date(leaveRequest.startDate).getFullYear() === currentYear &&
        new Date(leaveRequest.startDate).getMonth() === currentMonth
    ).length;

    const remainingLeavesThisYear = totalYearlyLeaves - leavesTakenThisYear;
    const remainingLeavesThisMonth = totalMonthlyLeaves - leavesTakenThisMonth;

    let requireHigherApproval = false;

    if (
      remainingLeavesThisYear < daysRequested ||
      remainingLeavesThisMonth < daysRequested
    ) {
      requireHigherApproval = true;
    }

    const admins = await db.userProfile.findMany({
      where: { role: { name: "Admin" } },
    });

    const ceo = await db.userProfile.findMany({
      where: { role: { name: "CEO" } },
    });

    const manager = await db.userProfile.findFirst({
      where: {
        department: {
          name: user.department?.name,
        },
        userId: {
          not: user.userId,
        },
      },
    });

    // Calculate carried over leaves
    const calculateCarriedOverLeaves = async (userId: string) => {
      let carriedOverLeaves = 0;
      const lastMonth = subMonths(currentDate, 1);
      const startOfLastMonth = startOfMonth(lastMonth);
      const endOfLastMonth = endOfMonth(lastMonth);

      const lastMonthLeaves = await db.leaveRequest.count({
        where: {
          userId: userId,
          startDate: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
          status: LeaveStatus.Approved,
        },
      });

      if (lastMonthLeaves === 0) {
        carriedOverLeaves = Math.min(
          totalMonthlyLeaves,
          36 - totalYearlyLeaves
        );
      }

      return carriedOverLeaves;
    };

    const carriedOverLeaves = await calculateCarriedOverLeaves(userId);

    const notifications = [
      {
        userId,
        title: "Leave Request Submitted",
        message: `Your leave request for ${leaveType} from ${startDate} to ${endDate} has been submitted.`,
        createdBy: NotificationCreator.Account,
        type: NotificationType.General,
        link: "/manager/leave-management/raise-requests",
      },
      ...(manager
        ? [
            {
              userId: manager.userId,
              title: "New Leave Request Raised",
              message: `${user.fullName} has submitted a leave request for ${leaveType} from ${startDate} to ${endDate}.`,
              createdBy: NotificationCreator.Employee,
              senderImage: user.userImage,
              link: `/manager/leave-management/manage-requests`,
              type: NotificationType.General,
            },
          ]
        : []),
      ...admins.map((admin) => ({
        userId: admin.userId,
        title: "New Leave Request Raised",
        message: `${user.fullName} has submitted a leave request for ${leaveType} from ${startDate} to ${endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/admin/leave-management/manage-requests`,
        type: NotificationType.General,
      })),
      ...ceo.map((ceo) => ({
        userId: ceo.userId,
        title: "New Leave Request Raised",
        message: `${user.fullName} has submitted a leave request for ${leaveType} from ${startDate} to ${endDate}.`,
        createdBy: NotificationCreator.Employee,
        senderImage: user.userImage,
        link: `/ceo/leave-management/manage-requests`,
        type: NotificationType.General,
      })),
    ];

    const raiseLeaveRequest = await db.leaveRequest.create({
      data: {
        leaveType: {
          connect: {
            id: getLeaveType.id,
          },
        },
        startDate,
        endDate,
        requireHigherApproval,
        reason,
        user: {
          connect: {
            userId,
          },
        },
      },
    });

    await db.notifications.createMany({
      data: notifications,
    });

    await db.userProfile.update({
      where: {
        userId: raiseLeaveRequest.userId,
      },
      data: {
        totalYearlyLeaves: Math.min(
          totalYearlyLeaves + carriedOverLeaves,
          36
        ).toString(),
        totalMonthlyLeaves: Math.min(
          totalMonthlyLeaves + carriedOverLeaves,
          36
        ).toString(),
      },
    });

    return NextResponse.json(raiseLeaveRequest, { status: 201 });
  } catch (error) {
    console.error(`RAISE_LEAVE_REQUEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
